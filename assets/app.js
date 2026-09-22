/* =============================================================
   app.js — renders the page from content.js and wires up
   filtering, search, progress, theme and the lesson dialog.
   No dependencies, no build step.
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
    return path.split('.').reduce(function (o, k) { return o && o[k]; }, S);
  }
  $$('[data-bind]').forEach(function (el) {
    var v = valueAt(el.getAttribute('data-bind'));
    if (v != null && v !== '') el.textContent = v;
  });

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
  (function renderHero() {
    var ev = S.event || {};
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
  })();

  /* =====================================================
     PATHWAYS
     ===================================================== */
  $('#pathways').innerHTML = (S.pathways || []).map(function (p) {
    return '<article class="pathway reveal">' +
             '<div class="pathway-icon">' + icon(p.icon) + '</div>' +
             '<h3>' + esc(p.title) + '</h3>' +
             '<p>' + esc(p.body) + '</p>' +
             (p.action ? '<button type="button" data-goto-track="' + esc(p.action.filter) + '">' +
                          esc(p.action.label) + '</button>' : '') +
           '</article>';
  }).join('');

  $$('[data-goto-track]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setTrack(btn.getAttribute('data-goto-track'));
      document.getElementById('lessons').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

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

  var CIRC = 2 * Math.PI * 52;
  function paintProgress() {
    var total = (S.lessons || []).length;
    var n = (S.lessons || []).filter(function (l) { return done.has(l.id); }).length;
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
    done.clear(); saveProgress(); paintProgress();
    $$('.lesson-card').forEach(function (c) { c.classList.remove('is-done'); });
    $$('.done-toggle').forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.querySelector('.label').textContent = 'Mark done';
    });
    toast('Progress cleared');
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
  var lessons = S.lessons || [];
  var trackLabel = {};
  (S.tracks || []).forEach(function (t) { trackLabel[t.id] = t.label; });

  var activeTrack = 'all';
  var lessonQuery = '';

  (function renderFilters() {
    var counts = { all: lessons.length };
    lessons.forEach(function (l) { counts[l.track] = (counts[l.track] || 0) + 1; });
    var chips = [{ id: 'all', label: 'All lessons' }].concat(S.tracks || []);
    $('#trackFilters').innerHTML = chips.map(function (c) {
      return '<button type="button" class="chip" data-track="' + esc(c.id) + '" aria-pressed="' +
             (c.id === 'all') + '">' + esc(c.label) +
             '<span class="chip-count">' + (counts[c.id] || 0) + '</span></button>';
    }).join('');
    $$('#trackFilters .chip').forEach(function (chip) {
      chip.addEventListener('click', function () { setTrack(chip.getAttribute('data-track')); });
    });
  })();

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
      if (activeTrack !== 'all' && l.track !== activeTrack) return false;
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

  /* ---------- lesson dialog ---------- */
  var dlg = $('#lessonDialog');
  var dlgScroll = $('#dialogScroll');

  function openLesson(id) {
    var l = lessons.filter(function (x) { return x.id === id; })[0];
    if (!l) return;
    var isDone = done.has(l.id);
    var n = lessons.indexOf(l) + 1;

    var res = (l.resources || []).map(function (r) {
      return '<li><a class="resource-link" href="' + esc(r.url || '#') + '"' +
             (/^https?:/.test(r.url || '') ? ' target="_blank" rel="noopener"' : '') + '>' +
             icon('link') + '<span><strong>' + esc(r.label) + '</strong></span></a></li>';
    }).join('');

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
        (res ? '<h3>Handouts &amp; links</h3><ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px">' + res + '</ul>' : '') +
        '<div class="dialog-actions">' +
          '<button class="btn btn-primary btn-small" type="button" data-dlg-done="' + esc(l.id) + '">' +
            (isDone ? 'Marked as done ✓' : 'Mark as done') + '</button>' +
          (l.slides ? '<a class="btn btn-ghost btn-small" href="' + esc(l.slides) + '" target="_blank" rel="noopener">Open slides</a>' : '') +
          (n < lessons.length ? '<button class="btn btn-ghost btn-small" type="button" data-next="' + esc(lessons[n].id) + '">Next lesson →</button>' : '') +
        '</div>' +
      '</div>';

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

  renderLessons();
  paintProgress();

  /* =====================================================
     AGENDA
     ===================================================== */
  (function renderAgenda() {
    var ev = S.event || {};
    var sub = $('#agendaSub');
    sub.textContent = [ev.date, ev.time, ev.location].filter(Boolean).join(' · ');
    $('#timeline').innerHTML = (S.agenda || []).map(function (a) {
      return '<li class="reveal">' +
        '<span class="t-time">' + esc(a.time) + '</span>' +
        '<div class="t-body">' +
          '<h3>' + esc(a.title) + (a.tag ? '<span class="t-tag">' + esc(a.tag) + '</span>' : '') + '</h3>' +
          '<p>' + esc(a.detail) + '</p>' +
        '</div></li>';
    }).join('');
    observeReveals($('#timeline'));
  })();

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
  $('#resourceGrid').innerHTML = (S.resources || []).map(function (g) {
    return '<div class="resource-group reveal"><h3>' + esc(g.group) + '</h3><ul>' +
      (g.items || []).map(function (it) {
        var ext = /^https?:/.test(it.url || '');
        return '<li><a class="resource-link" href="' + esc(it.url || '#') + '"' +
               (ext ? ' target="_blank" rel="noopener"' : '') + '>' + icon('link') +
               '<span><strong>' + esc(it.label) + '</strong>' +
               (it.desc ? '<span>' + esc(it.desc) + '</span>' : '') + '</span></a></li>';
      }).join('') + '</ul></div>';
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
  lessons.forEach(function (l, i) {
    index.push({ kind: 'Lesson', title: l.title, sub: l.duration || '', body: l.summary + ' ' + (l.takeaways || []).join(' '), open: function () { closePalette(); openLesson(l.id); } });
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
  (S.agenda || []).forEach(function (a) {
    index.push({ kind: 'Agenda', title: a.title, sub: a.time, body: a.detail, open: function () { closePalette(); goTo('#agenda'); } });
  });

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

  /* ---------- deep link: #lesson-l3 opens that lesson ---------- */
  if (/^#lesson-/.test(location.hash)) {
    openLesson(location.hash.replace('#lesson-', ''));
  }
})();
