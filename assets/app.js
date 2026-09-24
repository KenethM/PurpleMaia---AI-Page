/* =============================================================
   app.js — renders the page from content.js and wires up
   filtering, search, progress, theme and the lesson dialog.
   No dependencies, no build step.

   Three pieces to know about:
     audienceView()  merges SITE.event with the active audience's overrides;
                     everything that renders copy reads through it
     renderQuiz()    the one quiz component, used by the lesson dialog and
                     by two of the practice activities
     PRACTICE_ENGINES  type -> builder for the Practice section
   ============================================================= */
(function () {
  'use strict';

  var S = window.SITE;
  if (!S) { console.error('content.js did not load — check the script tag order in index.html.'); return; }

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- tiny icon set ---------- */
  var ICONS = {
    sprout:   '<path d="M12 21v-8"/><path d="M12 13C12 9 9 6 5 6c0 4 3 7 7 7z"/><path d="M12 13c0-3.5 2.6-6 6-6 0 3.5-2.6 6-6 6z"/>',
    wrench:   '<path d="M20.3 4.9a5 5 0 0 1-6.6 6.6l-7 7a2.3 2.3 0 0 1-3.2-3.2l7-7a5 5 0 0 1 6.6-6.6L14.4 5l1.2 3.4L19 9.6l1.3-4.7z"/>',
    shield:   '<path d="M12 3l7 3v5.5c0 4.3-2.9 8.2-7 9.5-4.1-1.3-7-5.2-7-9.5V6l7-3z"/><path d="M9.2 12.2l2 2 3.6-3.8"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3 10h18"/>',
    clock:    '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
    pin:      '<path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
    play:     '<path d="M7 4.8v14.4a.6.6 0 0 0 .92.5l11.3-7.2a.6.6 0 0 0 0-1L7.92 4.3a.6.6 0 0 0-.92.5z" fill="currentColor" stroke="none"/>',
    check:    '<path d="M4 12.5l5 5L20 6.5"/>',
    copy:     '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
    arrow:    '<path d="M5 12h13M12 5l7 7-7 7"/>',
    film:     '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M8 4v16M16 4v16M3 12h18"/>',
    link:     '<path d="M10 13.5a4 4 0 0 0 5.7.3l2.6-2.6a4 4 0 0 0-5.7-5.7L11.2 6.9"/><path d="M14 10.5a4 4 0 0 0-5.7-.3l-2.6 2.6a4 4 0 0 0 5.7 5.7l1.4-1.4"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
           (ICONS[name] || '') + '</svg>';
  }

  /* ---------- reveal-on-scroll setup (must exist before anything renders) ---------- */
  var revealObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' })
    : null;

  // Only now does the CSS start hiding .reveal elements. Without this class the
  // page renders fully visible, so a script failure can never blank a section.
  if (revealObserver) document.documentElement.classList.add('js-anim');

  /* ---------- simple {{path}} style binding ---------- */
  function valueAt(path) {
    // "event.*" resolves through the active audience so a switch re-skins the copy.
    var root = /^event\./.test(path) ? { event: audienceView() } : S;
    return path.split('.').reduce(function (o, k) { return o && o[k]; }, root);
  }
  function applyBindings() {
    $$('[data-bind]').forEach(function (el) {
      var v = valueAt(el.getAttribute('data-bind'));
      if (v != null) el.textContent = v;   // "" blanks a field on purpose
    });
  }

  /* =====================================================
     AUDIENCE — one knowledge base, re-skinned per room
     ===================================================== */
  /* `draft: true` holds an audience back completely: no chip, and no way in
     via ?for= or a saved choice either. The copy stays in content.js for
     review; the live page simply cannot reach it. */
  var AUDIENCES = (S.audiences || []).filter(function (a) { return !a.draft; });
  var AKEY = 'aihub:audience';
  /* Everything an audience is allowed to override. Anything not listed here
     is shared by every audience and lives in SITE.event. */
  var AUD_FIELDS = ['badge', 'tagline', 'intro', 'date', 'time', 'location',
                    'facts', 'pathways', 'agenda', 'ctaPrimary', 'ctaSecondary'];
  var audience = null;

  function audienceById(id) {
    for (var i = 0; i < AUDIENCES.length; i++) if (AUDIENCES[i].id === id) return AUDIENCES[i];
    return null;
  }
  function audienceView() {
    var ev = S.event || {}, out = {}, k;
    for (k in ev) if (Object.prototype.hasOwnProperty.call(ev, k)) out[k] = ev[k];
    // pathways and the run of show live at the top level of content.js, but an
    // audience overrides them the same way it overrides anything in `event`.
    out.pathways = S.pathways || [];
    out.agenda   = S.agenda || [];
    if (!audience) return out;
    AUD_FIELDS.forEach(function (f) {
      if (audience[f] !== undefined) out[f] = audience[f];
    });
    return out;
  }

  /* =====================================================
     THEME
     ===================================================== */
  var themeToggle = $('#themeToggle');
  function currentTheme() {
    var set = document.documentElement.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  themeToggle.addEventListener('click', function () {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('aihub:theme', next); } catch (e) {}
  });

  /* =====================================================
     HERO
     ===================================================== */
  function renderHero() {
    var ev = audienceView();
    applyBindings();
    document.title = (ev.name || 'Learning hub') + (ev.badge ? ' — ' + ev.badge : '');

    var meta = [];
    if (ev.date)     meta.push({ i: 'calendar', t: ev.date });
    if (ev.time)     meta.push({ i: 'clock',    t: ev.time });
    if (ev.location) meta.push({ i: 'pin',      t: ev.location });
    $('#heroMeta').innerHTML = meta.map(function (m) {
      return '<li>' + icon(m.i) + '<span>' + esc(m.t) + '</span></li>';
    }).join('');

    $('#heroFacts').innerHTML = (ev.facts || []).map(function (f) {
      return '<li><span class="fact-label">' + esc(f.label) + '</span>' +
             '<span class="fact-value">' + esc(f.value) + '</span></li>';
    }).join('');

    if (ev.ctaPrimary) {
      var a = $('#ctaPrimary');
      a.textContent = ev.ctaPrimary.label; a.href = ev.ctaPrimary.href || '#lessons';
    }
    if (ev.ctaSecondary) {
      var b = $('#ctaSecondary');
      b.textContent = ev.ctaSecondary.label; b.href = ev.ctaSecondary.href || '#agenda';
    }
  }

  /* =====================================================
     PATHWAYS
     ===================================================== */
  function renderPathways() {
    var root = $('#pathways');
    root.innerHTML = (audienceView().pathways || []).map(function (p) {
      var a = p.action, btn = '';
      if (a && a.goto)        btn = '<button type="button" data-goto="' + esc(a.goto) + '">' + esc(a.label) + '</button>';
      else if (a && a.filter) btn = '<button type="button" data-goto-track="' + esc(a.filter) + '">' + esc(a.label) + '</button>';
      return '<article class="pathway reveal">' +
               '<div class="pathway-icon">' + icon(p.icon) + '</div>' +
               '<h3>' + esc(p.title) + '</h3>' +
               '<p>' + esc(p.body) + '</p>' + btn +
             '</article>';
    }).join('');

    $$('[data-goto-track]', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTrack(btn.getAttribute('data-goto-track'));
        goTo('#lessons');
      });
    });
    $$('[data-goto]', root).forEach(function (btn) {
      btn.addEventListener('click', function () { goTo(btn.getAttribute('data-goto')); });
    });
    observeReveals(root);
  }

  /* =====================================================
     PROGRESS (localStorage, best effort)
     ===================================================== */
  var PKEY = 'aihub:progress';
  var done = (function () {
    try { return new Set(JSON.parse(localStorage.getItem(PKEY) || '[]')); }
    catch (e) { return new Set(); }
  })();
  function saveProgress() {
    try { localStorage.setItem(PKEY, JSON.stringify(Array.from(done))); } catch (e) {}
  }

  /* Quiz results live alongside progress: this browser only, never uploaded.
     Shape: { "m2-loop": { score: 2, total: 2 } } */
  var QKEY = 'aihub:quiz';
  var quizState = (function () {
    try { return JSON.parse(localStorage.getItem(QKEY) || '{}') || {}; }
    catch (e) { return {}; }
  })();
  function saveQuizResult(id, score, total) {
    var prev = quizState[id];
    if (prev && prev.score >= score) return;     // keep the best run
    quizState[id] = { score: score, total: total };
    try { localStorage.setItem(QKEY, JSON.stringify(quizState)); } catch (e) {}
  }
  function quizAced(id) {
    var r = quizState[id];
    return !!(r && r.total && r.score === r.total);
  }

  var CIRC = 2 * Math.PI * 52;
  function paintProgress() {
    var total = lessons.length;
    var n = lessons.filter(function (l) { return done.has(l.id); }).length;
    var pct = total ? Math.round((n / total) * 100) : 0;
    $('#ringFill').style.strokeDashoffset = String(CIRC - (CIRC * pct) / 100);
    $('#ringPct').textContent = pct + '%';
    $('#progressCount').textContent = n + ' of ' + total + ' lessons done';
    $('#resetProgress').hidden = n === 0;
    if (n === total && total > 0) {
      $('#progressHint').textContent = 'That is all of them. Go build something.';
    } else {
      $('#progressHint').textContent = 'Tick lessons off as you go. Saved in this browser only — nothing is uploaded.';
    }
  }
  $('#resetProgress').addEventListener('click', function () {
    done.clear(); saveProgress();
    quizState = {};
    try { localStorage.removeItem(QKEY); } catch (e) {}
    renderLessons();
    paintProgress();
    toast('Progress and quiz results cleared');
  });

  /* =====================================================
     VIDEO HELPERS
     ===================================================== */
  function parseVideo(v) {
    if (!v) return null;
    var i = v.indexOf(':');
    if (i < 0) return null;
    return { kind: v.slice(0, i), ref: v.slice(i + 1) };
  }
  function thumbFor(v) {
    var p = parseVideo(v);
    if (p && p.kind === 'youtube') return 'https://i.ytimg.com/vi/' + encodeURIComponent(p.ref) + '/hqdefault.jpg';
    return null;
  }
  function embedFor(v, title) {
    var p = parseVideo(v);
    if (!p) return '';
    if (p.kind === 'youtube') {
      return '<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(p.ref) + '?autoplay=1&rel=0" title="' + esc(title) +
        '" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>';
    }
    if (p.kind === 'vimeo') {
      return '<div class="video-frame"><iframe src="https://player.vimeo.com/video/' +
        encodeURIComponent(p.ref) + '?autoplay=1" title="' + esc(title) +
        '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>';
    }
    if (p.kind === 'file') {
      return '<div class="video-frame"><video src="' + esc(p.ref) + '" controls autoplay playsinline></video></div>';
    }
    return '';
  }
  var MISSING_VIDEO =
    '<div class="video-missing">' + icon('film') +
    '<p><strong>The recording is not up yet.</strong><br>' +
    'It will appear right here once it is posted — the notes below are ready now.</p>' +
    '<p class="facilitator-hint">Facilitator: add <code>video: "youtube:ID"</code> to this lesson in <code>content.js</code></p>' +
    '</div>';

  /* =====================================================
     LESSONS
     ===================================================== */
  var lessons = (S.lessons || []).slice();
  var trackLabel = {};
  (S.tracks || []).forEach(function (t) { trackLabel[t.id] = t.label; });

  var activeTrack = 'all';
  var lessonQuery = '';
  var featured = [];   // lesson ids this audience leads with, in order

  /* Reorders `lessons` so the audience's starting set comes first. Nothing is
     dropped — every lesson stays in the list and in search. */
  function orderLessons() {
    featured = (audience && audience.feature) || [];
    var rank = {};
    featured.forEach(function (id, i) { rank[id] = i; });
    var source = S.lessons || [];
    lessons = source.slice().sort(function (a, b) {
      var ra = rank[a.id] === undefined ? Infinity : rank[a.id];
      var rb = rank[b.id] === undefined ? Infinity : rank[b.id];
      if (ra !== rb) return ra - rb;
      return source.indexOf(a) - source.indexOf(b);
    });
  }
  function isFeatured(id) { return featured.indexOf(id) > -1; }
  function featureLabel() { return (audience && audience.featureLabel) || 'Start here'; }

  function renderFilters() {
    var counts = { all: lessons.length };
    lessons.forEach(function (l) { counts[l.track] = (counts[l.track] || 0) + 1; });
    var chips = [{ id: 'all', label: 'All lessons' }].concat(S.tracks || []);
    if (featured.length) {
      counts.feature = featured.length;
      chips.splice(1, 0, { id: 'feature', label: featureLabel(), extra: 'chip-feature' });
    }
    $('#trackFilters').innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip' + (c.extra ? ' ' + c.extra : '') +
             '" data-track="' + esc(c.id) + '" aria-pressed="' + (c.id === activeTrack) + '">' +
             esc(c.label) + '<span class="chip-count">' + (counts[c.id] || 0) + '</span></button>';
    }).join('');
    $$('#trackFilters .chip').forEach(function (chip) {
      chip.addEventListener('click', function () { setTrack(chip.getAttribute('data-track')); });
    });
  }

  function setTrack(id) {
    activeTrack = id;
    $$('#trackFilters .chip').forEach(function (c) {
      c.setAttribute('aria-pressed', String(c.getAttribute('data-track') === id));
    });
    renderLessons();
  }

  function lessonCard(l, index) {
    var thumb = thumbFor(l.video);
    var isDone = done.has(l.id);
    return '<article class="lesson-card reveal' + (isDone ? ' is-done' : '') + '" data-id="' + esc(l.id) + '">' +
      '<button class="thumb" type="button" data-open="' + esc(l.id) + '" aria-label="Open lesson: ' + esc(l.title) + '">' +
        '<span class="lesson-num">' + String(index + 1).padStart(2, '0') + '</span>' +
        (thumb ? '<img src="' + esc(thumb) + '" alt="" loading="lazy">' : '') +
        '<span class="thumb-overlay">' +
          '<span class="play">' + icon('play') + '</span>' +
          (thumb ? '' : '<span class="thumb-note">Video coming soon</span>') +
        '</span>' +
        (l.duration ? '<span class="duration-badge">' + esc(l.duration) + '</span>' : '') +
      '</button>' +
      '<div class="lesson-body">' +
        '<div class="lesson-tags">' +
          '<span class="tag tag-track">' + esc(trackLabel[l.track] || l.track) + '</span>' +
          (isFeatured(l.id) ? '<span class="tag tag-feature">' + esc(featureLabel()) + '</span>' : '') +
          (quizAced(l.id) ? '<span class="tag tag-check">Checked ✓</span>' : '') +
          (l.level ? '<span class="tag">' + esc(l.level) + '</span>' : '') +
        '</div>' +
        '<h3><button type="button" data-open="' + esc(l.id) + '">' + esc(l.title) + '</button></h3>' +
        '<p>' + esc(l.summary) + '</p>' +
        '<div class="lesson-foot">' +
          '<button class="done-toggle" type="button" data-done="' + esc(l.id) + '" aria-pressed="' + isDone + '">' +
            '<span class="box">' + icon('check') + '</span>' +
            '<span class="label">' + (isDone ? 'Done' : 'Mark done') + '</span>' +
          '</button>' +
          '<button class="open-link" type="button" data-open="' + esc(l.id) + '">Open →</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function renderLessons() {
    var q = lessonQuery.trim().toLowerCase();
    var list = lessons.filter(function (l) {
      if (activeTrack === 'feature') { if (!isFeatured(l.id)) return false; }
      else if (activeTrack !== 'all' && l.track !== activeTrack) return false;
      if (!q) return true;
      var hay = [l.title, l.summary, l.level, trackLabel[l.track], (l.takeaways || []).join(' ')].join(' ').toLowerCase();
      return hay.indexOf(q) > -1;
    });

    var grid = $('#lessonGrid');
    grid.innerHTML = list.map(function (l) {
      return lessonCard(l, lessons.indexOf(l));
    }).join('');
    $('#lessonEmpty').hidden = list.length !== 0;

    $$('[data-open]', grid).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openLesson(btn.getAttribute('data-open'));
      });
    });
    $$('[data-done]', grid).forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleDone(btn.getAttribute('data-done'));
      });
    });
    observeReveals(grid);
  }

  function toggleDone(id) {
    var nowDone;
    if (done.has(id)) { done.delete(id); nowDone = false; }
    else { done.add(id); nowDone = true; }
    saveProgress();
    paintProgress();

    $$('[data-id="' + id + '"]').forEach(function (card) {
      card.classList.toggle('is-done', nowDone);
      var btn = $('[data-done]', card);
      if (btn) {
        btn.setAttribute('aria-pressed', String(nowDone));
        btn.querySelector('.label').textContent = nowDone ? 'Done' : 'Mark done';
      }
    });
    if (nowDone) toast('Nice — marked as done');
  }

  $('#lessonSearch').addEventListener('input', function (e) {
    lessonQuery = e.target.value;
    renderLessons();
  });
  $('#clearFilters').addEventListener('click', function () {
    lessonQuery = ''; $('#lessonSearch').value = '';
    setTrack('all');
  });

  /* =====================================================
     QUIZ ENGINE
     One component, three homes: the check under each lesson,
     Term match, and Would you send it? Give it a host element
     and a list of { q, options, answer, why }.
     opts.onFinish(score, total)  — called once, at the end
     opts.restart()               — return fresh items for "Try again"
     opts.doneLabel               — heading on the final card
     ===================================================== */
  function renderQuiz(host, items, opts) {
    opts = opts || {};
    var i = 0, score = 0;

    /* Shuffle each question's options at render time and remap `answer` to
       follow. Content authors can write the correct option first — which is
       the natural way to write one — without the answer always being A.
       A question with `fixed: true` keeps its given order, for the rare case
       where the options only make sense in sequence. */
    function prepare(list) {
      return (list || []).map(function (it) {
        if (it.fixed) return it;
        var order = it.options.map(function (_, n) { return n; });
        shuffle(order);
        return {
          q: it.q,
          options: order.map(function (n) { return it.options[n]; }),
          answer: order.indexOf(it.answer),
          why: it.why
        };
      });
    }
    items = prepare(items);

    function drawQuestion() {
      var it = items[i];
      host.innerHTML =
        '<div class="quiz">' +
          '<div class="quiz-head">' +
            '<p class="quiz-q">' + esc(it.q) + '</p>' +
            (items.length > 1 ? '<span class="quiz-step">' + (i + 1) + ' / ' + items.length + '</span>' : '') +
          '</div>' +
          '<ul class="quiz-options">' +
            it.options.map(function (o, n) {
              return '<li><button class="quiz-option" type="button" data-n="' + n + '">' +
                       '<span class="mark">' + String.fromCharCode(65 + n) + '</span>' +
                       '<span>' + esc(o) + '</span>' +
                     '</button></li>';
            }).join('') +
          '</ul>' +
          '<div class="quiz-foot" data-foot hidden></div>' +
        '</div>';

      $$('.quiz-option', host).forEach(function (btn) {
        btn.addEventListener('click', function () { answer(Number(btn.getAttribute('data-n'))); });
      });
    }

    function answer(n) {
      var it = items[i];
      var right = n === it.answer;
      if (right) score++;

      $$('.quiz-option', host).forEach(function (btn, idx) {
        btn.disabled = true;
        if (idx === it.answer) {
          btn.classList.add('is-correct');
          btn.querySelector('.mark').textContent = '✓';
        } else if (idx === n) {
          btn.classList.add('is-wrong');
          btn.querySelector('.mark').textContent = '✕';
        }
      });

      var last = i === items.length - 1;
      var why = document.createElement('p');
      why.className = 'quiz-why';
      why.innerHTML = '<strong>' + (right ? 'Yes.' : 'Not quite.') + '</strong> ' + esc(it.why);
      $('.quiz-options', host).insertAdjacentElement('afterend', why);

      var foot = $('[data-foot]', host);
      foot.hidden = false;
      foot.innerHTML = '<button class="btn btn-primary btn-small" type="button" data-next>' +
                       (last ? 'See how you did' : 'Next question') + '</button>';
      $('[data-next]', foot).addEventListener('click', function () {
        if (last) { drawDone(); return; }
        i++; drawQuestion();
      });
    }

    function drawDone() {
      var total = items.length;
      host.innerHTML =
        '<div class="quiz">' +
          '<p class="quiz-score"><strong>' + score + ' of ' + total + '</strong> — ' +
            esc(score === total ? 'all of them. You can explain this to somebody else now.'
                                : score >= total - 1 ? 'close. The one you missed is worth a re-read.'
                                : 'worth another pass through the takeaways above.') + '</p>' +
          '<div class="quiz-foot"><button class="btn btn-ghost btn-small" type="button" data-again>Try again</button></div>' +
        '</div>';
      $('[data-again]', host).addEventListener('click', function () {
        items = prepare(opts.restart ? opts.restart() : items);   // reshuffle on every run
        i = 0; score = 0; drawQuestion();
      });
      if (opts.onFinish) opts.onFinish(score, total);
    }

    if (!items || !items.length) { host.innerHTML = ''; return; }
    drawQuestion();
  }

  /* ---------- lesson dialog ---------- */
  var dlg = $('#lessonDialog');
  var dlgScroll = $('#dialogScroll');

  function openLesson(id) {
    var l = lessons.filter(function (x) { return x.id === id; })[0];
    if (!l) return;
    var isDone = done.has(l.id);
    var n = lessons.indexOf(l) + 1;
    var quiz = ((S.quizzes || {})[l.id]) || [];
    var prev = quizState[l.id];

    // Same renderer as the Resources section, so `pending` behaves the same here.
    var res = (l.resources || []).map(resourceItem).join('');

    dlgScroll.innerHTML =
      (l.video ? embedFor(l.video, l.title) : MISSING_VIDEO) +
      '<div class="dialog-body">' +
        '<div class="lesson-tags">' +
          '<span class="tag tag-track">' + esc(trackLabel[l.track] || l.track) + '</span>' +
          '<span class="tag">Lesson ' + n + '</span>' +
          (l.duration ? '<span class="tag">' + esc(l.duration) + '</span>' : '') +
        '</div>' +
        '<h2 id="dlgTitle">' + esc(l.title) + '</h2>' +
        '<p class="dialog-summary">' + esc(l.summary) + '</p>' +
        ((l.takeaways || []).length
          ? '<h3>What to take away</h3><ul class="takeaways">' +
            l.takeaways.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'
          : '') +
        (quiz.length
          ? '<h3>Check your understanding' +
            (prev ? ' <span class="quiz-step">best so far: ' + prev.score + ' / ' + prev.total + '</span>' : '') +
            '</h3><div id="lessonQuiz"></div>'
          : '') +
        (res ? '<h3>Handouts &amp; links</h3><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px">' + res + '</ul>' : '') +
        '<div class="dialog-actions">' +
          '<button class="btn btn-primary btn-small" type="button" data-dlg-done="' + esc(l.id) + '">' +
            (isDone ? 'Marked as done ✓' : 'Mark as done') + '</button>' +
          (l.slides ? '<a class="btn btn-ghost btn-small" href="' + esc(l.slides) + '" target="_blank" rel="noopener">Open slides</a>' : '') +
          (n < lessons.length ? '<button class="btn btn-ghost btn-small" type="button" data-next="' + esc(lessons[n].id) + '">Next lesson →</button>' : '') +
        '</div>' +
      '</div>';

    if (quiz.length) {
      renderQuiz($('#lessonQuiz', dlgScroll), quiz, {
        onFinish: function (score, total) {
          saveQuizResult(l.id, score, total);
          renderLessons();   // repaint the "Checked ✓" flag on the card behind the dialog
        }
      });
    }

    var doneBtn = $('[data-dlg-done]', dlgScroll);
    if (doneBtn) doneBtn.addEventListener('click', function () {
      toggleDone(l.id);
      doneBtn.textContent = done.has(l.id) ? 'Marked as done ✓' : 'Mark as done';
    });
    var nextBtn = $('[data-next]', dlgScroll);
    if (nextBtn) nextBtn.addEventListener('click', function () {
      openLesson(nextBtn.getAttribute('data-next'));
    });

    if (!dlg.open) dlg.showModal();
    dlgScroll.scrollTop = 0;
  }

  function closeLesson() {
    if (dlg.open) dlg.close();
  }
  dlg.addEventListener('close', function () { dlgScroll.innerHTML = ''; });
  $('#dialogClose').addEventListener('click', closeLesson);
  dlg.addEventListener('click', function (e) {
    // click on the backdrop (outside the dialog box) closes it
    var r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeLesson();
  });

  /* The lessons grid, the hero and the agenda are all painted by
     applyAudience() at the bottom of this file, once everything exists. */

  /* =====================================================
     AGENDA
     ===================================================== */
  function renderAgenda() {
    var ev = audienceView();
    var sub = $('#agendaSub');
    sub.textContent = [ev.date, ev.time, ev.location].filter(Boolean).join(' · ');
    $('#timeline').innerHTML = (ev.agenda || []).map(function (a) {
      return '<li class="reveal">' +
        '<span class="t-time">' + esc(a.time) + '</span>' +
        '<div class="t-body">' +
          '<h3>' + esc(a.title) + (a.tag ? '<span class="t-tag">' + esc(a.tag) + '</span>' : '') + '</h3>' +
          '<p>' + esc(a.detail) + '</p>' +
        '</div></li>';
    }).join('');
    observeReveals($('#timeline'));
  }

  /* =====================================================
     PROMPTS
     ===================================================== */
  (function renderPrompts() {
    var grid = $('#promptGrid');
    grid.innerHTML = (S.prompts || []).map(function (p, i) {
      return '<article class="prompt-card reveal">' +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p class="prompt-use">' + esc(p.use) + '</p>' +
        '<pre>' + esc(p.text) + '</pre>' +
        '<button class="copy-btn" type="button" data-copy="' + i + '">' + icon('copy') + '<span>Copy prompt</span></button>' +
      '</article>';
    }).join('');

    $$('[data-copy]', grid).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var text = S.prompts[Number(btn.getAttribute('data-copy'))].text;
        copyText(text, function (ok) {
          if (!ok) { toast('Could not copy — select the text instead'); return; }
          btn.classList.add('copied');
          btn.querySelector('span').textContent = 'Copied';
          toast('Prompt copied to your clipboard');
          setTimeout(function () {
            btn.classList.remove('copied');
            btn.querySelector('span').textContent = 'Copy prompt';
          }, 1800);
        });
      });
    });
    observeReveals(grid);
  })();

  function copyText(text, cb) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { cb(true); }, function () { cb(fallbackCopy(text)); });
    } else {
      cb(fallbackCopy(text));
    }
  }
  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }

  /* =====================================================
     PRACTICE — the playable half of the page.
     Each entry in SITE.practice names a `type`; the engine for
     that type gets the card's body element and the entry.
     ===================================================== */
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  /* ---------- Token chopper ----------
     Byte-pair tokenizers do not split on length, they split on FREQUENCY.
     The vocabulary is built from the training data, so a word that appeared
     constantly gets its own token, and a word the training data barely
     contains has no entry at all and shatters into fragments. Characters
     outside plain ASCII — ʻokina, kahakō — are several bytes each and are
     rare in an English-dominated corpus, so they tend to come apart on
     their own.

     That is the whole bias argument in one widget, so it has to model the
     real cause. An earlier version split purely on word length, which made
     ʻōlelo Hawaiʻi look CHEAPER than English — exactly backwards.

     Still an approximation: a real vocabulary holds ~100k entries learned
     from data, not the ~350 below. Tiktokenizer is linked on the card. */

  // Words frequent enough in an English-heavy corpus to earn a single token.
  var TOK_VOCAB = (
    'the be to of and a in that have i it for not on with he as you do at this but his by from ' +
    'they we say her she or an will my one all would there their what so up out if about who get ' +
    'which go me when make can like time no just him know take people into year your good some ' +
    'could them see other than then now look only come its over think also back after use two how ' +
    'our work first well way even new want because any these give day most us is are was were been ' +
    'has had did does am being having more very much many such own same each few own here where why ' +
    'before while through during under between both against once again ever never always often ' +
    'every another around down off above below near across behind along without within among since ' +
    'until upon toward towards should must might may shall ought need dare used able ' +
    'thing things man woman child children student students teacher school learn learning read ' +
    'write written writing word words language model models data set sets train trained training ' +
    'text answer answers question questions program programs system systems page pages note notes ' +
    'report reports meeting meetings email emails draft drafts team teams staff community project ' +
    'projects grant funder funding budget plan plans goal goals result results source sources ' +
    'number numbers name names date dates list lists file files link links site sites ' +
    'computer machine learning network networks token tokens context window sample samples ' +
    'ocean water land island islands fish bird tree trees sun moon star stars sky sea reef ' +
    'swim swam walk walked run ran sit sat stand stood open opened close closed start started ' +
    'help helps helped please thank thanks hello welcome today tomorrow yesterday morning night ' +
    'home house family friend friends group groups place places world life story stories ' +
    'everyone everything something anything someone nothing somewhere anywhere everywhere ' +
    'together important different following understand understanding information example ' +
    'examples available support supports process processes practice change changes continue ' +
    'include includes provide provides consider however therefore gather gathering run running ' +
    'give given going made making getting taking coming looking working saying knowing'
  ).split(' ');
  var TOK_SET = Object.create(null);
  TOK_VOCAB.forEach(function (w) { if (w) TOK_SET[w] = 1; });

  // Endings frequent enough to be their own token when peeled off a known stem.
  var TOK_SUFFIX = ['ing', 'tion', 'ment', 'ness', 'able', 'ible', 'ed', 'ly', 'es', 'er', 'est', 's'];

  var TOK_WORDCH = /[A-Za-z0-9ʻ‘’'À-ɏ]/;
  var TOK_SPLIT  = /[A-Za-z0-9ʻ‘’'À-ɏ]+|[^A-Za-z0-9ʻ‘’'À-ɏ]/g;
  var TOK_ASCII  = /^[A-Za-z0-9']+$/;

  function inVocab(word) { return TOK_SET[word.toLowerCase()] === 1; }

  /* Break a word the vocabulary has no entry for. Non-ASCII characters come
     away on their own (multi-byte and rare); the rest goes in short pieces. */
  function chopUnknown(word) {
    var out = [], run = '';
    function flushRun() {
      if (!run) return;
      if (inVocab(run)) { out.push(run); run = ''; return; }
      var at = 0;
      while (at < run.length) { out.push(run.slice(at, at + 3)); at += 3; }
      run = '';
    }
    for (var i = 0; i < word.length; i++) {
      var ch = word.charAt(i);
      if (TOK_ASCII.test(ch)) { run += ch; }
      else { flushRun(); out.push(ch); }     // ʻokina, kahakō, accented vowels
    }
    flushRun();
    return out;
  }

  function chopWord(word) {
    if (inVocab(word)) return [word];
    // a known stem plus a frequent ending is two tokens, not a shattering
    for (var i = 0; i < TOK_SUFFIX.length; i++) {
      var suf = TOK_SUFFIX[i];
      if (word.length > suf.length + 2 && word.slice(-suf.length).toLowerCase() === suf) {
        var stem = word.slice(0, -suf.length);
        if (inVocab(stem)) return [stem, word.slice(-suf.length)];
        // "running" -> run + ning: the doubled consonant belongs to the ending
        var undoubled = stem.slice(0, -1);
        if (stem.length > 2 && stem.slice(-1) === stem.slice(-2, -1) && inVocab(undoubled)) {
          return [undoubled, word.slice(undoubled.length)];
        }
      }
    }
    return chopUnknown(word);
  }

  function chopTokens(text) {
    var out = [];
    var re = /(\s*)(\S+)/g, m;
    while ((m = re.exec(text)) !== null) {
      var lead = m[1], parts = m[2].match(TOK_SPLIT) || [m[2]];
      parts.forEach(function (part, idx) {
        var pre = idx === 0 ? lead : '';
        if (!TOK_WORDCH.test(part)) { out.push(pre + part); return; }   // punctuation
        var pieces = chopWord(part);
        pieces.forEach(function (p, n) { out.push((n === 0 ? pre : '') + p); });
      });
    }
    return out;
  }
  function buildTokens(host, cfg) {
    host.innerHTML =
      '<textarea class="tok-field" spellcheck="false" aria-label="Text to chop into tokens"></textarea>' +
      '<div class="tok-out" aria-live="polite"></div>' +
      '<p class="tok-stats">' +
        '<span class="tok-stat"><strong data-n-tok>0</strong> tokens</span>' +
        '<span class="tok-stat"><strong data-n-chr>0</strong> characters</span>' +
        '<span class="tok-stat"><strong data-n-avg>0</strong> characters per token</span>' +
      '</p>';

    var field = $('.tok-field', host);
    var out = $('.tok-out', host);

    function paint() {
      var text = field.value;
      var toks = chopTokens(text);
      out.innerHTML = toks.length
        ? toks.map(function (t, i) { return '<span class="tok tok-' + (i % 4) + '">' + esc(t) + '</span>'; }).join('')
        : '<span class="practice-note">Type something above.</span>';
      $('[data-n-tok]', host).textContent = toks.length;
      $('[data-n-chr]', host).textContent = text.length;
      $('[data-n-avg]', host).textContent = toks.length ? (text.length / toks.length).toFixed(1) : '0';
    }

    field.addEventListener('input', paint);
    field.value = cfg.sample || '';
    paint();
  }

  /* ---------- Roll the dice ---------- */
  function tempered(options, t) {
    var raised = options.map(function (o) { return Math.pow(o.p / 100, 1 / t); });
    var sum = raised.reduce(function (a, b) { return a + b; }, 0) || 1;
    return raised.map(function (r) { return r / sum; });
  }
  function sampleFrom(probs) {
    var r = Math.random(), acc = 0;
    for (var i = 0; i < probs.length; i++) {
      acc += probs[i];
      if (r <= acc) return i;
    }
    return probs.length - 1;
  }

  function buildPredict(host, cfg) {
    var rounds = cfg.rounds || [];
    if (!rounds.length) return;
    var ri = 0, temp = 1, pick = null, rolled = null;

    function draw() {
      var r = rounds[ri];
      pick = null; rolled = null;
      host.innerHTML =
        '<p class="dice-stem">' + esc(r.stem) + ' <span class="caret">▍</span></p>' +
        '<ul class="dice-options">' +
          r.options.map(function (o, n) {
            return '<li><button class="dice-option" type="button" data-n="' + n + '">' +
                     '<span class="fill"></span>' +
                     '<span class="word">' + esc(o.word) + '</span>' +
                     '<span class="pct"></span>' +
                   '</button></li>';
          }).join('') +
        '</ul>' +
        '<div class="dice-controls">' +
          '<span class="dice-temp">' +
            '<label for="temp-' + esc(cfg.id) + '">Temperature</label>' +
            '<input id="temp-' + esc(cfg.id) + '" type="range" min="0.2" max="1.8" step="0.1" value="' + temp + '">' +
            '<span class="val">' + temp.toFixed(1) + '</span>' +
          '</span>' +
          '<button class="btn btn-primary btn-small" type="button" data-roll>Roll once</button>' +
          '<button class="btn btn-ghost btn-small" type="button" data-roll20>Roll 20 ×</button>' +
          (rounds.length > 1 ? '<button class="btn btn-ghost btn-small" type="button" data-stem>New sentence</button>' : '') +
        '</div>' +
        '<p class="dice-result">Pick the word you think comes next, then roll.</p>' +
        '<p class="dice-tally"></p>';

      $$('.dice-option', host).forEach(function (btn) {
        btn.addEventListener('click', function () {
          pick = Number(btn.getAttribute('data-n'));
          paint();
        });
      });
      $('.dice-temp input', host).addEventListener('input', function (e) {
        temp = Number(e.target.value);
        $('.dice-temp .val', host).textContent = temp.toFixed(1);
        paint();
      });
      $('[data-roll]', host).addEventListener('click', function () { roll(1); });
      $('[data-roll20]', host).addEventListener('click', function () { roll(20); });
      var stemBtn = $('[data-stem]', host);
      if (stemBtn) stemBtn.addEventListener('click', function () {
        ri = (ri + 1) % rounds.length;
        draw();
      });

      paint();
    }

    function paint() {
      var r = rounds[ri];
      var probs = tempered(r.options, temp);
      $$('.dice-option', host).forEach(function (btn, n) {
        var pct = probs[n] * 100;
        $('.fill', btn).style.width = pct.toFixed(1) + '%';
        $('.pct', btn).textContent = pct.toFixed(0) + '%';
        btn.classList.toggle('is-picked', pick === n);
        btn.classList.toggle('is-rolled', rolled === n);
      });
    }

    function roll(times) {
      var r = rounds[ri];
      var probs = tempered(r.options, temp);
      var counts = r.options.map(function () { return 0; });
      var last = 0;
      for (var i = 0; i < times; i++) { last = sampleFrom(probs); counts[last]++; }
      rolled = times === 1 ? last : null;
      paint();

      var res = $('.dice-result', host);
      var tally = $('.dice-tally', host);
      if (times === 1) {
        var word = r.options[last].word;
        res.innerHTML = pick === null
          ? 'The model wrote <strong>' + esc(word) + '</strong>. Roll again — same prompt, same odds, possibly a different word.'
          : (pick === last
              ? 'You said <strong>' + esc(r.options[pick].word) + '</strong> and so did the model. That will not happen every time.'
              : 'You said <strong>' + esc(r.options[pick].word) + '</strong>. The model wrote <strong>' + esc(word) + '</strong>.');
        tally.textContent = '';
      } else {
        res.innerHTML = '<strong>' + times + ' rolls</strong> at temperature ' + temp.toFixed(1) +
                        ' — same prompt every time.';
        tally.textContent = counts.map(function (c, n) {
          return r.options[n].word + ' ×' + c;
        }).join('  ·  ');
      }
    }

    draw();
  }

  /* ---------- Term match (built from the glossary) ---------- */
  function matchItems(n) {
    var terms = (S.glossary || []).slice();
    if (terms.length < 4) return [];
    shuffle(terms);
    return terms.slice(0, Math.min(n, terms.length)).map(function (g) {
      var others = shuffle(terms.filter(function (t) { return t !== g; })).slice(0, 3);
      var opts = shuffle(others.map(function (t) { return t.term; }).concat([g.term]));
      return {
        q: g.def,
        options: opts,
        answer: opts.indexOf(g.term),
        why: 'The term is “' + g.term + '”. Every one of these is in the glossary further down the page.'
      };
    });
  }
  function buildMatch(host, cfg) {
    var make = function () { return matchItems(cfg.rounds || 6); };
    renderQuiz(host, make(), { restart: make });
  }

  /* ---------- Would you send it? ---------- */
  function buildScenarios(host, cfg) {
    var items = cfg.items || [];
    renderQuiz(host, items.slice(), { restart: function () { return items.slice(); } });
  }

  /* ---------- Spot the real one ----------
     The earlier version only ever showed fabricated citations, so "you cannot
     tell by looking" was something the card asserted and the reader took on
     trust. Showing one real paper beside three fakes, in identical formatting,
     proves it instead — and the reveal links to the real one so it can be
     checked. Fakes are stamped only after the answer is given, never before. */
  function buildCite(host, cfg) {
    var reals = cfg.real || [], parts = cfg.fake || {};
    if (!reals.length || !parts.authors) return;
    var round = null, picked = null, rounds = 0;

    function pick(list, not) {
      var pool = not ? list.filter(function (x) { return not.indexOf(x) < 0; }) : list;
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function makeFake(usedTitles) {
      var a = pick(parts.authors);
      var b = pick(parts.authors, [a]);
      var t = pick(parts.titles, usedTitles);
      usedTitles.push(t);
      var page = 40 + Math.floor(Math.random() * 380);
      return {
        fake: true,
        authors: a + ', K. & ' + b + ', M.',
        year: 2018 + Math.floor(Math.random() * 8),
        title: t,
        venue: pick(parts.venues),
        pages: page + '–' + (page + 12 + Math.floor(Math.random() * 10))
      };
    }

    function newRound() {
      var used = [];
      var list = [reals[Math.floor(Math.random() * reals.length)]];
      while (list.length < 4) list.push(makeFake(used));
      shuffle(list);
      round = list;
      picked = null;
      rounds++;
      draw();
    }

    function refHtml(r) {
      return '<span class="ref-authors">' + esc(r.authors) + '</span> (' + r.year + '). ' +
             esc(r.title) + '. <em>' + esc(r.venue) + '</em>, ' + esc(r.pages) + '.';
    }

    function draw() {
      var answered = picked !== null;
      host.innerHTML =
        '<ul class="ref-list" role="list">' +
          round.map(function (r, n) {
            var state = '';
            if (answered) state = r.fake ? ' is-fake' : ' is-real';
            if (answered && n === picked) state += ' is-picked';
            return '<li><button class="ref' + state + '" type="button" data-n="' + n + '"' +
                     (answered ? ' disabled' : '') + '>' +
                     '<span class="ref-mark">' + String.fromCharCode(65 + n) + '</span>' +
                     '<span class="ref-body">' + refHtml(r) +
                       (answered
                         ? '<span class="ref-verdict">' + (r.fake ? 'Invented just now' : 'Real paper') + '</span>'
                         : '') +
                     '</span>' +
                   '</button></li>';
          }).join('') +
        '</ul>' +
        '<p class="dice-result">' + verdict() + '</p>' +
        (answered
          ? '<div class="dice-controls">' +
              '<a class="btn btn-ghost btn-small" href="' + esc(realOne().url) + '" target="_blank" rel="noopener">Open the real paper</a>' +
              '<button class="btn btn-primary btn-small" type="button" data-again>Another round</button>' +
            '</div>'
          : '');

      $$('.ref', host).forEach(function (b) {
        b.addEventListener('click', function () { picked = Number(b.getAttribute('data-n')); draw(); });
      });
      var again = $('[data-again]', host);
      if (again) again.addEventListener('click', newRound);
    }

    function realOne() {
      for (var i = 0; i < round.length; i++) if (!round[i].fake) return round[i];
      return round[0];
    }

    function verdict() {
      if (picked === null) return 'One of these four is a real paper. The other three did not exist sixty seconds ago.';
      var right = !round[picked].fake;
      return (right
        ? '<strong>Right.</strong> Now notice what that took — you had to already know the paper. '
        : '<strong>That one was invented.</strong> It was assembled from a list of plausible parts, the same way a model does it. ') +
        'Nothing on the page distinguished them: same formatting, same specificity, same confidence. ' +
        'The only thing that separates a real citation from a fabricated one is going and checking.';
    }

    newRound();
  }

  /* ---------- How much did it read? ----------
     All rows visible at once, because the point is a PATTERN across the six —
     coverage collapses, certainty does not follow it down. Showing one at a
     time asked the reader to hold five numbers in their head and take the
     conclusion on trust.

     Both series are percentages on one shared 0–100 axis, so they belong on
     one chart. Colours are the validated categorical pair (see the comment
     on --viz-read / --viz-sure in styles.css); identity is carried by a
     legend and by direct value labels, never by colour alone. */
  function buildCorpus(host, cfg) {
    var qs = cfg.questions || [];
    if (!qs.length) return;
    var open = 0;

    // Computed, never assumed: reordering or inserting a question stays honest.
    function span(key) {
      var vals = qs.map(function (q) { return q[key]; });
      return { hi: Math.max.apply(null, vals), lo: Math.min.apply(null, vals) };
    }

    function row(q, n) {
      return '<tr class="cq-row' + (n === open ? ' is-open' : '') + '" data-n="' + n + '">' +
        '<th scope="row"><button type="button" data-n="' + n + '">' + esc(q.q) + '</button></th>' +
        '<td>' +
          '<div class="cq-bars">' +
            '<span class="cq-bar"><span class="cq-fill cq-read" style="width:' + q.coverage + '%"></span></span>' +
            '<span class="cq-bar"><span class="cq-fill cq-sure" style="width:' + q.confidence + '%"></span></span>' +
          '</div>' +
        '</td>' +
        '<td class="cq-nums"><span class="cq-n cq-n-read">' + q.coverage + '%</span>' +
        '<span class="cq-n cq-n-sure">' + q.confidence + '%</span></td>' +
      '</tr>';
    }

    function draw() {
      var cov = span('coverage'), con = span('confidence');
      host.innerHTML =
        '<div class="cq-legend">' +
          '<span><i class="cq-key cq-read"></i>How much it read on this</span>' +
          '<span><i class="cq-key cq-sure"></i>How certain it sounds</span>' +
        '</div>' +
        '<table class="cq-table"><caption class="sr-only">' +
          'Training coverage and stated confidence, as a percentage, for six questions' +
        '</caption><tbody>' + qs.map(row).join('') + '</tbody></table>' +
        '<p class="dice-result">' + esc(qs[open].verdict) + '</p>' +
        '<p class="corpus-punch">Read across the rows. Coverage falls from ' + cov.hi + '% to ' + cov.lo +
          '% — a ' + (cov.hi - cov.lo) + '-point collapse. Certainty moves ' + (con.hi - con.lo) +
          ' points. It does not get less sure when it knows less, and that gap is the whole problem.</p>';

      $$('.cq-row [data-n]', host).forEach(function (b) {
        b.addEventListener('click', function () { open = Number(b.getAttribute('data-n')); draw(); });
      });
    }

    draw();
  }

  var PRACTICE_ENGINES = {
    tokens:    buildTokens,
    predict:   buildPredict,
    match:     buildMatch,
    scenarios: buildScenarios,
    cite:      buildCite,
    corpus:    buildCorpus
  };

  (function renderPractice() {
    var grid = $('#practiceGrid');
    if (!grid) return;
    var items = (S.practice || []).filter(function (p) { return PRACTICE_ENGINES[p.type]; });
    if (!items.length) { $('#practice').hidden = true; return; }

    function card(p) {
      var foot = '';
      if (p.note || p.link) {
        foot = '<div class="practice-foot">' +
          (p.note ? '<p class="practice-note">' + esc(p.note) + '</p>' : '') +
          (p.link ? '<a href="' + esc(p.link.url) + '" target="_blank" rel="noopener">' + esc(p.link.label) + ' →</a>' : '') +
          '</div>';
      }
      return '<article class="practice-card reveal" data-practice="' + esc(p.id) + '">' +
        (p.tag ? '<span class="practice-tag">' + esc(p.tag) + '</span>' : '') +
        '<h3>' + esc(p.title) + '</h3>' +
        '<p class="practice-blurb">' + esc(p.blurb) + '</p>' +
        '<div class="practice-body"></div>' + foot +
      '</article>';
    }

    /* Demos and quizzes teach differently, so they do not sit in one grid.
       Anything without a group falls in with the demos. */
    var GROUPS = [
      { id: 'demo', title: 'Try it',        sub: 'Move something and watch what the machinery does.' },
      { id: 'quiz', title: 'Check yourself', sub: 'Answer, then find out why. Nothing is scored anywhere but here.' }
    ];
    grid.innerHTML = GROUPS.map(function (g) {
      var mine = items.filter(function (p) { return (p.group || 'demo') === g.id; });
      if (!mine.length) return '';
      return '<section class="practice-group">' +
        '<header class="practice-group-head">' +
          '<h3>' + esc(g.title) + '</h3><p>' + esc(g.sub) + '</p>' +
        '</header>' +
        '<div class="practice-grid-inner">' + mine.map(card).join('') + '</div>' +
      '</section>';
    }).join('');

    items.forEach(function (p) {
      var card = grid.querySelector('[data-practice="' + p.id + '"]');
      if (card) PRACTICE_ENGINES[p.type]($('.practice-body', card), p);
    });
    observeReveals(grid);
  })();

  /* =====================================================
     GLOSSARY
     ===================================================== */
  function renderGlossary(q) {
    q = (q || '').trim().toLowerCase();
    var items = (S.glossary || []).filter(function (g) {
      return !q || (g.term + ' ' + g.def).toLowerCase().indexOf(q) > -1;
    });
    $('#glossaryGrid').innerHTML = items.length
      ? items.map(function (g) {
          return '<dl class="term-card"><dt>' + highlight(g.term, q) + '</dt>' +
                 '<dd>' + highlight(g.def, q) + '</dd></dl>';
        }).join('')
      : '<p class="empty-state">No term matches that. Try a shorter word.</p>';
  }
  function highlight(text, q) {
    var safe = esc(text);
    if (!q) return safe;
    try {
      var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
      return safe.replace(re, '<mark>$1</mark>');
    } catch (e) { return safe; }
  }
  $('#glossarySearch').addEventListener('input', function (e) { renderGlossary(e.target.value); });
  renderGlossary('');

  /* =====================================================
     FAQ
     ===================================================== */
  $('#faqList').innerHTML = (S.faq || []).map(function (f) {
    return '<details class="faq-item reveal"><summary>' + esc(f.q) + '</summary>' +
           '<div class="faq-answer">' + esc(f.a) + '</div></details>';
  }).join('');
  observeReveals($('#faqList'));

  /* =====================================================
     RESOURCES + FOOTER
     ===================================================== */
  /* An item marked `pending: true` is announced but not linked. Better an
     honest "not up yet" than a link that 404s — same idea as the missing-video
     placeholder. Delete the flag the moment the file lands. */
  function resourceItem(it) {
    var inner = icon(it.pending ? 'clock' : 'link') +
                '<span><strong>' + esc(it.label) + '</strong>' +
                (it.desc ? '<span>' + esc(it.desc) + '</span>' : '') + '</span>';
    if (it.pending) {
      return '<li><span class="resource-link is-pending">' + inner +
             '<span class="pending-badge">Not up yet</span></span></li>';
    }
    var ext = /^https?:/.test(it.url || '');
    return '<li><a class="resource-link" href="' + esc(it.url || '#') + '"' +
           (ext ? ' target="_blank" rel="noopener"' : '') + '>' + inner + '</a></li>';
  }

  $('#resourceGrid').innerHTML = (S.resources || []).map(function (g) {
    return '<div class="resource-group reveal"><h3>' + esc(g.group) + '</h3><ul>' +
      (g.items || []).map(resourceItem).join('') + '</ul></div>';
  }).join('');
  observeReveals($('#resourceGrid'));

  $('#footerLinks').innerHTML = ((S.footer || {}).links || []).map(function (l) {
    var ext = /^https?:/.test(l.url || '');
    return '<a href="' + esc(l.url || '#') + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + esc(l.label) + '</a>';
  }).join('');

  /* =====================================================
     SEARCH PALETTE
     ===================================================== */
  var index = [];
  /* Rebuilt whenever the audience changes, because the run of show does too. */
  function buildIndex() {
    index = [];
    lessons.forEach(function (l) {
      index.push({ kind: 'Lesson', title: l.title, sub: l.duration || '', body: l.summary + ' ' + (l.takeaways || []).join(' '), open: function () { closePalette(); openLesson(l.id); } });
    });
    (S.practice || []).forEach(function (p) {
      index.push({ kind: 'Practice', title: p.title, sub: p.tag || '', body: p.blurb || '', open: function () { closePalette(); goTo('#practice'); } });
    });
    (S.prompts || []).forEach(function (p) {
      index.push({ kind: 'Prompt', title: p.title, sub: '', body: p.use + ' ' + p.text, open: function () { closePalette(); goTo('#prompts'); } });
    });
    (S.glossary || []).forEach(function (g) {
      index.push({ kind: 'Term', title: g.term, sub: '', body: g.def, open: function () { closePalette(); $('#glossarySearch').value = g.term; renderGlossary(g.term); goTo('#glossary'); } });
    });
    (S.faq || []).forEach(function (f) {
      index.push({ kind: 'Question', title: f.q, sub: '', body: f.a, open: function () { closePalette(); goTo('#faq'); } });
    });
    (audienceView().agenda || []).forEach(function (a) {
      index.push({ kind: 'Agenda', title: a.title, sub: a.time, body: a.detail, open: function () { closePalette(); goTo('#agenda'); } });
    });
  }

  var backdrop = $('#paletteBackdrop');
  var pInput = $('#paletteInput');
  var pResults = $('#paletteResults');
  var pActive = 0;
  var pCurrent = [];

  function goTo(hash) {
    var el = document.querySelector(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function openPalette() {
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    pInput.value = '';
    runPalette('');
    pInput.focus();
  }
  function closePalette() {
    backdrop.hidden = true;
    document.body.style.overflow = '';
  }
  function runPalette(q) {
    q = q.trim().toLowerCase();
    pCurrent = q
      ? index.filter(function (it) { return (it.title + ' ' + it.body + ' ' + it.kind).toLowerCase().indexOf(q) > -1; }).slice(0, 12)
      : index.filter(function (it) { return it.kind === 'Lesson'; }).slice(0, 8);
    pActive = 0;
    if (!pCurrent.length) {
      pResults.innerHTML = '<li class="palette-empty">Nothing found for “' + esc(q) + '”.</li>';
      return;
    }
    pResults.innerHTML = pCurrent.map(function (it, i) {
      return '<li' + (i === 0 ? ' class="active"' : '') + '><button type="button" data-i="' + i + '">' +
        '<span class="r-kind">' + esc(it.kind) + '</span>' +
        '<span class="r-title">' + esc(it.title) + '</span>' +
        (it.sub ? '<span class="r-sub">' + esc(it.sub) + '</span>' : '') +
      '</button></li>';
    }).join('');
    $$('button[data-i]', pResults).forEach(function (b) {
      b.addEventListener('click', function () { pCurrent[Number(b.getAttribute('data-i'))].open(); });
    });
  }
  function movePalette(delta) {
    if (!pCurrent.length) return;
    pActive = (pActive + delta + pCurrent.length) % pCurrent.length;
    $$('li', pResults).forEach(function (li, i) { li.classList.toggle('active', i === pActive); });
    var el = pResults.children[pActive];
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }

  $('#searchTrigger').addEventListener('click', openPalette);
  pInput.addEventListener('input', function (e) { runPalette(e.target.value); });
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closePalette(); });
  pInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); movePalette(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); movePalette(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (pCurrent[pActive]) pCurrent[pActive].open(); }
  });

  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === 'Escape') {
      if (!backdrop.hidden) closePalette();
      return;
    }
    if (typing) return;
    if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault(); openPalette();
    }
  });

  /* =====================================================
     HEADER: menu, scroll state, scrollspy, progress bar
     ===================================================== */
  var nav = $('.site-nav');
  var menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  $$('.site-nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  var header = $('#siteHeader');
  var bar = $('#scrollProgress');
  var ticking = false;
  function onScroll() {
    header.classList.toggle('is-stuck', window.scrollY > 6);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    revealInView();
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  $('#toTop').addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  if ('IntersectionObserver' in window) {
    var navLinks = {};
    $$('.site-nav a').forEach(function (a) { navLinks[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var link = navLinks[en.target.id];
        if (!link) return;
        $$('.site-nav a').forEach(function (a) { a.classList.remove('active'); });
        link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(navLinks).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- reveal on scroll (observer set up near the top) ---------- */

  function observeReveals(root) {
    var els = $$('.reveal', root || document).filter(function (el) { return !el.classList.contains('in'); });
    if (!revealObserver) { els.forEach(function (e) { e.classList.add('in'); }); return; }

    els.forEach(function (el, i) {
      // Anything already on screen shows straight away — never wait on the observer.
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.style.transitionDelay = Math.min(i, 6) * 45 + 'ms';
        el.classList.add('in');
        return;
      }
      el.style.transitionDelay = Math.min(i, 6) * 45 + 'ms';
      revealObserver.observe(el);
    });

  }

  // Backstop: if the observer is ever throttled or fails to fire, scrolling
  // still reveals anything that has come into view. Content never stays blank.
  function revealInView() {
    $$('.reveal').forEach(function (el) {
      if (el.classList.contains('in')) return;
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
    });
  }
  observeReveals(document);

  /* ---------- toast ---------- */
  var toastEl = $('#toast');
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  /* =====================================================
     AUDIENCE SWITCHER
     Everything above renders from audienceView(); this is what
     decides which audience that is and repaints on a change.
     ===================================================== */
  function paintAudienceBar() {
    var bar = $('#audienceBar');
    if (!bar) return;
    $('#audienceChips').innerHTML = AUDIENCES.map(function (a) {
      return '<button type="button" class="audience-chip" data-aud="' + esc(a.id) + '" aria-pressed="' +
             (audience && a.id === audience.id) + '">' + esc(a.label) + '</button>';
    }).join('');
    $$('#audienceChips .audience-chip').forEach(function (btn) {
      btn.addEventListener('click', function () { applyAudience(btn.getAttribute('data-aud')); });
    });
    $('#audienceBlurb').textContent = (audience && audience.blurb) || '';
  }

  function audienceUrl(id) {
    var url = new URL(location.href);
    url.hash = '';
    if (AUDIENCES.length && id === AUDIENCES[0].id) url.searchParams.delete('for');
    else url.searchParams.set('for', id);
    return url.toString();
  }

  function applyAudience(id, initial) {
    var next = audienceById(id) || AUDIENCES[0] || null;
    if (!next) return;
    audience = next;

    orderLessons();
    activeTrack = 'all';
    renderHero();
    renderPathways();
    renderFilters();
    renderLessons();
    paintProgress();
    renderAgenda();
    buildIndex();
    paintAudienceBar();

    try { localStorage.setItem(AKEY, audience.id); } catch (e) {}
    try { history.replaceState(null, '', audienceUrl(audience.id) + location.hash); } catch (e) {}
    if (!initial) toast('Now showing the ' + audience.label.toLowerCase() + ' version');
  }

  (function initAudience() {
    var bar = $('#audienceBar');
    if (!AUDIENCES.length) {            // no audiences defined: plain page, no switcher
      orderLessons(); renderHero(); renderPathways(); renderFilters();
      renderLessons(); paintProgress(); renderAgenda(); buildIndex();
      return;
    }
    if (bar) bar.hidden = AUDIENCES.length < 2;

    var param = null, saved = null;
    try { param = new URL(location.href).searchParams.get('for'); } catch (e) {}
    try { saved = localStorage.getItem(AKEY); } catch (e) {}

    // A link wins over what this browser last chose — that is the point of the link.
    var id = (param && audienceById(param) && param) ||
             (saved && audienceById(saved) && saved) ||
             AUDIENCES[0].id;
    applyAudience(id, true);

    var share = $('#audienceShare');
    if (share) share.addEventListener('click', function () {
      copyText(audienceUrl(audience.id), function (ok) {
        toast(ok ? 'Link copied — it opens on the ' + audience.label.toLowerCase() + ' version'
                 : 'Could not copy. The address bar already has the link.');
      });
    });
  })();

  /* ---------- deep link: #lesson-l3 opens that lesson ---------- */
  if (/^#lesson-/.test(location.hash)) {
    openLesson(location.hash.replace('#lesson-', ''));
  }
})();
