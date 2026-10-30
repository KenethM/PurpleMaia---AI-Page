/* =============================================================
   app.js — renders the page from content.js and wires up the
   module articles, search, progress, theme and feedback.
   No dependencies, no build step.

   Three pieces to know about:
     audienceView()  merges SITE.event with the active audience's overrides;
                     everything that renders copy reads through it
     renderQuiz()    the one quiz component, used by each module's practice
                     and by two of the practice activities
     PRACTICE_ENGINES  type -> builder for the hands-on activities
     route()         shows the home view or a module article, from the hash
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
  /* Everything that fades up into place as it scrolls into view. Navigation
     (the header, "In this module") never moves; it has to be there to use. */
  var REVEAL_SEL = [
    // already marked in their templates: run of show, prompts, FAQ, downloads
    '.reveal',
    // home
    '#homeView .hero h1', '#homeView .lede', '.overall', '.module-card', '.ref-link',
    '#homeView .section-head',
    // a module page: the header, then every block of the article
    '.art-num', '.art-head-copy > *',
    '.art-section:not(.art-practice) > *:not(.art-part)', '.art-part > *',
    '.art-practice', '.art-prev', '.art-next', '.art-sources',
    // Reference
    '.ref-head .crumb', '.ref-head h1', '.ref-jump', '#referenceView .section-head',
    '#referenceView .filter-input', '.term-card'
  ].join(', ');

  var revealObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver(function (entries, obs) {
        var arriving = entries.filter(function (en) { return en.isIntersecting; })
                              .map(function (en) { return en.target; });
        arriving.forEach(function (el) { obs.unobserve(el); });
        showReveals(arriving);
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.01 })
    : null;

  /* Blocks that arrive together cascade, 60ms apart and never more than five
     steps, so nothing waits long. Once a block has settled it drops the
     reveal classes and gets its own transitions (card hovers) back. */
  function showReveals(els) {
    els.forEach(function (el, n) {
      el.style.transitionDelay = Math.min(n, 5) * 60 + 'ms';
      el.classList.add('in');
      var finished = false;
      var settle = function () {
        if (finished) return;
        finished = true;
        el.removeEventListener('transitionend', onEnd);
        el.classList.remove('reveal', 'in');
        el.style.transitionDelay = '';
      };
      var onEnd = function (e) { if (e.target === el && e.propertyName === 'transform') settle(); };
      el.addEventListener('transitionend', onEnd);
      setTimeout(settle, 1500);
    });
  }

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
     ANALYTICS — Google Analytics 4 and/or Umami, off unless configured
     SITE.analytics.ga4 is a GA4 measurement ID ("G-…");
     SITE.analytics.umami is { script, website } for the self-hosted
     Umami on Purple Maiʻa's Dokku box. Either can be on alone. Both
     empty means no script loads and track() does nothing, which is how
     the staff edition runs; community.js sets the IDs for its own site.

     Also off from file://, localhost, and for anyone whose browser
     sends Do Not Track or Global Privacy Control. What is sent is
     which page and which step: never quiz answers or scores, search
     text, or anything typed into a form. The page is one document
     routed by its hash, so page views are sent by hand from route()
     with the hash turned into a path (#/module/m2 -> /module/m2).
     ===================================================== */
  var AN = S.analytics || {};
  var GA_ID = String(AN.ga4 || '').trim();
  var UM = AN.umami || {};
  var UM_SRC = String(UM.script || '').trim(), UM_ID = String(UM.website || '').trim();
  var trackable = /^https?:$/.test(location.protocol) &&
    !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) &&
    !(navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true);
  var useGa = trackable && !!GA_ID;
  var useUmami = trackable && !!UM_SRC && !!UM_ID;
  var tracking = useGa || useUmami;
  if (useGa) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(gaScript);
  }
  /* Umami's own page views are off: route() sends them, like GA4's. Calls
     made before its script arrives (the first page view always is) wait
     in umamiQueue. Every call carries the path-style url, or Umami would
     file events under the raw #/… address. */
  var umamiQueue = [], umamiPath = '/';
  if (useUmami) {
    var umScript = document.createElement('script');
    umScript.defer = true;
    umScript.src = UM_SRC;
    umScript.setAttribute('data-website-id', UM_ID);
    umScript.setAttribute('data-auto-pageview', 'false');
    umScript.setAttribute('data-do-not-track', 'true');
    if (UM.domains) umScript.setAttribute('data-domains', UM.domains);
    umScript.onload = function () {
      umamiQueue.forEach(function (f) { f(); });
      umamiQueue = null;
    };
    umScript.onerror = function () { umamiQueue = null; };   // blocked: drop, don't pile up
    document.head.appendChild(umScript);
  }
  function toUmami(name, params) {
    var url = umamiPath;
    var send = function () {
      if (!window.umami) return;
      window.umami.track(function (props) {
        var p = Object.assign({}, props, { url: url });
        if (name === 'page_view') p.title = params.page_title;
        else { p.name = name; if (params && Object.keys(params).length) p.data = params; }
        return p;
      });
    };
    if (umamiQueue) umamiQueue.push(send); else send();
  }
  function track(name, params) {
    if (!tracking) return;
    if (useGa) { try { window.gtag('event', name, params || {}); } catch (e) {} }
    if (useUmami) { try { toUmami(name, params || {}); } catch (e) {} }
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
    // An empty badge would leave a bare pill with a dot in it.
    var eyebrow = $('.hero .eyebrow');
    if (eyebrow) eyebrow.hidden = !ev.badge;

    var meta = [];
    if (ev.date)     meta.push({ i: 'calendar', t: ev.date });
    if (ev.time)     meta.push({ i: 'clock',    t: ev.time });
    if (ev.location) meta.push({ i: 'pin',      t: ev.location });
    $('#heroMeta').innerHTML = meta.map(function (m) {
      return '<li>' + icon(m.i) + '<span>' + esc(m.t) + '</span></li>';
    }).join('');

  }

  /* =====================================================
     PLACEMENT — three questions that point at a module
     Under the module cards, for anyone not sure where to
     start. Each answer votes for a module; the result
     opens it. Nothing is stored: the answers live in this
     closure.
     ===================================================== */
  function renderPlacement() {
    var P = S.placement;
    var host = $('#placement');
    if (!host || !P || !(P.questions || []).length) { if (host) host.hidden = true; return; }
    host.hidden = false;

    var total = P.questions.length;
    var i = 0, votes = {};

    function closed(moveFocus) {
      host.innerHTML =
        '<div class="placement-open">' +
          '<p>' + esc(P.prompt || 'Not sure where to start?') + '</p>' +
          '<button class="btn btn-ghost btn-small" type="button" data-begin>' + esc(P.cta || 'Answer three questions') + '</button>' +
        '</div>';
      var begin = $('[data-begin]', host);
      begin.addEventListener('click', function () { i = 0; votes = {}; question(true); });
      if (moveFocus) begin.focus();
    }

    function steps(at) {
      var bars = '';
      for (var n = 0; n < total; n++) bars += '<i' + (n <= at ? ' class="on"' : '') + '></i>';
      return '<span class="hq-bars" aria-hidden="true">' + bars + '</span>';
    }

    function question(moveFocus) {
      var q = P.questions[i];
      var order = q.options.map(function (_, n) { return n; });
      shuffle(order);
      host.innerHTML =
        '<div class="hq-card">' +
          '<div class="hq-head">' +
            '<span class="hq-step">Question ' + (i + 1) + ' of ' + total + '</span>' + steps(i) +
          '</div>' +
          '<h3 class="hq-q" id="placementHeading" tabindex="-1">' + esc(q.q) + '</h3>' +
          '<ul class="hq-options">' +
            order.map(function (n) {
              return '<li><button class="hq-option" type="button" data-track="' + esc(q.options[n].track) + '">' +
                       '<span class="hq-mark" aria-hidden="true"></span><span>' + esc(q.options[n].label) + '</span></button></li>';
            }).join('') +
          '</ul>' +
          '<div class="hq-foot">' +
            (i > 0
              ? '<button class="linklike" type="button" data-restart>' + esc(P.restart || 'Start over') + '</button>'
              : '<button class="linklike" type="button" data-close>Close</button>') +
            (P.note ? '<span class="hq-note">' + esc(P.note) + '</span>' : '') +
          '</div>' +
        '</div>';
      $$('.hq-option', host).forEach(function (b) {
        b.addEventListener('click', function () {
          var t = b.getAttribute('data-track');
          votes[t] = (votes[t] || 0) + 1;
          i++;
          if (i < total) question(true); else result();
        });
      });
      var r = $('[data-restart]', host);
      if (r) r.addEventListener('click', restart);
      var c = $('[data-close]', host);
      if (c) c.addEventListener('click', function () { closed(true); });
      // Keep keyboard and screen-reader users on the new question.
      if (moveFocus) $('#placementHeading').focus();
    }

    function restart() { i = 0; votes = {}; question(true); }

    // Ties fall to the earlier module — nobody gets sent in over their head.
    function winner() {
      var order = (S.tracks || []).map(function (t) { return t.id; });
      var best = order[0], bestN = -1;
      order.forEach(function (id) {
        var n = votes[id] || 0;
        if (n > bestN) { best = id; bestN = n; }
      });
      return best;
    }

    function result() {
      var id = winner();
      var r = (P.results || {})[id] || {};
      var m = moduleForTrack(id);
      track('placement_result', { track: id });
      host.innerHTML =
        '<div class="hq-card hq-result">' +
          '<div class="hq-head">' +
            '<span class="hq-step">Your starting point</span>' + steps(total) +
          '</div>' +
          '<h3 class="hq-q" id="placementHeading" tabindex="-1">' + esc(r.title || 'Start here') + '</h3>' +
          '<p class="hq-body">' + esc(r.body || '') + '</p>' +
          '<div class="hq-actions">' +
            (m ? '<a class="btn btn-primary" href="' + moduleHref(m) + '">' + esc(r.label || 'Take me there') + '</a>' : '') +
            '<button class="btn btn-ghost" type="button" data-restart>' + esc(P.restart || 'Start over') + '</button>' +
          '</div>' +
        '</div>';
      $('[data-restart]', host).addEventListener('click', restart);
      $('#placementHeading').focus();
    }

    closed(false);
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

  /* Sections read, by section id. Reading a section also marks the lessons it
     carries as done in `done` above, which is how progress from the old
     lesson cards carries over: a section whose lessons were all ticked off
     there already counts as read. */
  var RKEY = 'aihub:read';
  var readSet = (function () {
    try { return new Set(JSON.parse(localStorage.getItem(RKEY) || '[]')); }
    catch (e) { return new Set(); }
  })();
  function saveRead() {
    try { localStorage.setItem(RKEY, JSON.stringify(Array.from(readSet))); } catch (e) {}
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

  /* =====================================================
     VIDEO HELPERS
     ===================================================== */
  function parseVideo(v) {
    if (!v) return null;
    var i = v.indexOf(':');
    if (i < 0) return null;
    return { kind: v.slice(0, i), ref: v.slice(i + 1) };
  }
  /* `deeper` carries a watch URL, not a bare id, because that is the form a
     person pastes in and the form every one of the 19 was checked in against
     oEmbed. Parse it at render time rather than storing a second copy. */
  function ytId(url) {
    var m = /[?&]v=([\w-]{6,})/.exec(url || '') || /youtu\.be\/([\w-]{6,})/.exec(url || '');
    return m ? m[1] : '';
  }
  function thumbFor(v) {
    var p = parseVideo(v);
    if (p && p.kind === 'youtube') return 'https://i.ytimg.com/vi/' + encodeURIComponent(p.ref) + '/hqdefault.jpg';
    /* Our own videos ship a poster frame beside them: same name, .jpg. Without
       this a lesson that has its real video still says "Video coming soon". */
    if (p && p.kind === 'file') return p.ref.replace(/\.[^./]+$/, '.jpg');
    return null;
  }
  /* Every embed on the page is still an outside explainer standing in for a
     Purple Maiʻa animation that has not been made yet. The notice is keyed to
     the video *kind*, not to a flag someone has to remember to clear: the
     in-house animations will arrive as `file:`, so the moment a lesson
     switches over, its stand-in notice disappears on its own. */
  var STANDIN_NOTE =
    '<p class="video-standin">' +
    '<strong>Standing in until ours is made.</strong> An outside explainer, ' +
    'picked for this topic and for how well it has been received. Purple Maiʻa’s ' +
    'own animation will replace it right here.</p>';

  /* `aspect` is a lesson's videoAspect, set only on films shot vertically.
     Those were exported onto a 16:9 canvas with black bars either side, so
     the frame is given their real shape and the video fills it: `cover`
     then crops exactly the bars away, with no re-encoding of the file. */
  /* `noStandin` is for the follow-on explainers: the stand-in notice says
     ours has not been made yet, and on a `deeper` video ours is the one
     playing right above it. */
  function embedFor(v, title, aspect, noStandin) {
    var p = parseVideo(v);
    if (!p) return '';
    var shape = aspect ? ' class="video-frame is-portrait" style="aspect-ratio:' + esc(aspect) + '"'
                       : ' class="video-frame"';
    if (p.kind === 'youtube') {
      return '<div' + shape + '><iframe src="https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(p.ref) + '?autoplay=1&rel=0" title="' + esc(title) +
        '" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe></div>' +
        (noStandin ? '' : STANDIN_NOTE);
    }
    if (p.kind === 'vimeo') {
      return '<div' + shape + '><iframe src="https://player.vimeo.com/video/' +
        encodeURIComponent(p.ref) + '?autoplay=1" title="' + esc(title) +
        '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>' +
        (noStandin ? '' : STANDIN_NOTE);
    }
    if (p.kind === 'file') {
      return '<div' + shape + '><video src="' + esc(p.ref) + '" poster="' + esc(thumbFor(v)) +
        '" controls autoplay playsinline preload="metadata"></video></div>';
    }
    return '';
  }
  /* =====================================================
     LESSONS — each one is a video and a quiz now, carried
     by a section of a module (see MODULES below)
     ===================================================== */
  var lessons = (S.lessons || []).slice();
  var trackLabel = {};
  (S.tracks || []).forEach(function (t) { trackLabel[t.id] = t.label; });

  function trackById(id) {
    var list = S.tracks || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function lessonById(id) {
    for (var i = 0; i < lessons.length; i++) if (lessons[i].id === id) return lessons[i];
    return null;
  }

  /* =====================================================
     SOUND
     Synthesised in the browser, so there are no audio files to load. A right
     answer is a soft bell that climbs a pentatonic step with every answer in
     a streak; a miss is a low, muted pair of notes; a sealed result plays a
     short arpeggio. On by default and quiet. The speaker button on every
     quiz turns it off, and the choice is remembered in this browser.
     The AudioContext is only made on the first answer, which is always a
     click, so no browser blocks it.
     ===================================================== */
  var SKEY = 'aihub:sound';
  var sfx = (function () {
    var on = true, ctx = null;
    try { on = localStorage.getItem(SKEY) !== 'off'; } catch (e) {}
    // C major pentatonic from C5: every step up sounds like progress, none clash.
    var SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];

    function audio() {
      if (!ctx) {
        var A = window.AudioContext || window.webkitAudioContext;
        if (!A) return null;
        try { ctx = new A(); } catch (e) { return null; }
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    function tone(freq, at, dur, vol, type) {
      var c = audio();
      if (!c) return;
      var t = c.currentTime + at;
      var o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + dur + 0.05);
    }
    // A sine with a quiet octave above it reads as a bell rather than a beep.
    function bell(freq, at, vol) { tone(freq, at, 0.6, vol); tone(freq * 2, at, 0.3, vol * 0.22); }

    return {
      isOn: function () { return on; },
      set: function (v) {
        on = !!v;
        try { localStorage.setItem(SKEY, on ? 'on' : 'off'); } catch (e) {}
      },
      right: function (streak) {
        if (!on) return;
        bell(SCALE[Math.min(Math.max(streak, 1), SCALE.length) - 1], 0, 0.07);
      },
      wrong: function () {
        if (!on) return;
        tone(196, 0, 0.22, 0.045, 'triangle');
        tone(174.61, 0.09, 0.3, 0.035, 'triangle');
      },
      // Neutral: a guess recorded, a pair settled after a slip.
      tap: function () {
        if (!on) return;
        tone(659.25, 0, 0.18, 0.03);
      },
      sealed: function (perfect) {
        if (!on) return;
        var run = perfect ? [0, 2, 3, 5, 7] : [0, 2, 3];
        run.forEach(function (k, n) { bell(SCALE[k], n * 0.11, 0.06); });
      }
    };
  })();

  var SOUND_ON  = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a7.8 7.8 0 0 1 0 11"/></svg>';
  var SOUND_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>';
  function soundButton() {
    var on = sfx.isOn();
    return '<button class="quiz-sound" type="button" data-sound aria-pressed="' + on + '" ' +
             'aria-label="Sound effects" title="' + (on ? 'Sound on' : 'Sound off') + '">' +
             (on ? SOUND_ON : SOUND_OFF) + '</button>';
  }
  // One switch for the whole page: flipping it on any quiz flips them all.
  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('[data-sound]');
    if (!btn) return;
    var home = btn.closest('.quiz') || document;     // before the button is replaced
    sfx.set(!sfx.isOn());
    $$('[data-sound]').forEach(function (b) { b.outerHTML = soundButton(); });
    if (sfx.isOn()) sfx.tap();
    var again = $('[data-sound]', home);
    if (again) again.focus();
  });

  /* =====================================================
     QUIZ ENGINE
     One component, three homes: the checks inside each module,
     Term match, and Would you send it? Give it a host element and
     a list of items. Each item has a `type`:

       choice     (the default) { q, options, answer, why, fixed? }
       truefalse  { q: a statement, answer: true | false, why }
       order      { q, steps: [in the right order], why }
       match      { q, pairs: [[term, meaning], …], why? }
       sort       { q, buckets: [labels], cards: [{ text, bucket, why }], why? }

     Scoring is in points, not screens: a choice, a true/false or an order
     is one point, a match board one per pair, a sort one per card. That way
     a board of five pairs is worth what five questions were.

     opts.onFinish(score, total)  — called once, at the end
     opts.restart()               — return fresh items for "Try again"
     opts.previous()              — the best run so far, for "New best"
     opts.next()                  — { href, label } for the onward button
     ===================================================== */
  function renderQuiz(host, items, opts) {
    opts = opts || {};
    var i = 0, streak = 0, marks = [];
    var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
    var CROSS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>';

    /* Shuffle at render time so the answer is never reliably in one place,
       and content authors can write the correct option first, which is the
       natural way to write one. A choice with `fixed: true` keeps its order,
       for the rare case where the options only make sense in sequence. */
    function prepare(list) {
      return (list || []).map(function (it) {
        var type = it.type || 'choice';
        if (type === 'truefalse') {
          return { type: 'choice', q: it.q, options: ['True', 'False'], answer: it.answer ? 0 : 1, why: it.why, tf: true };
        }
        if (type === 'order') {
          var start = it.steps.map(function (_, n) { return n; });
          // Never start in the right order: that would be a free point.
          do { shuffle(start); } while (start.length > 1 && start.every(function (k, n) { return k === n; }));
          return { type: 'order', q: it.q, steps: it.steps, start: start, why: it.why };
        }
        if (type === 'match') {
          return { type: 'match', q: it.q, pairs: shuffle(it.pairs.slice()),
                   defs: shuffle(it.pairs.map(function (_, n) { return n; })), why: it.why };
        }
        if (type === 'sort') {
          return { type: 'sort', q: it.q, buckets: it.buckets, cards: shuffle(it.cards.slice()), why: it.why };
        }
        if (it.fixed) return { type: 'choice', q: it.q, options: it.options, answer: it.answer, why: it.why };
        var order = it.options.map(function (_, n) { return n; });
        shuffle(order);
        return {
          type: 'choice',
          q: it.q,
          options: order.map(function (n) { return it.options[n]; }),
          answer: order.indexOf(it.answer),
          why: it.why
        };
      });
    }
    items = prepare(items);

    function head(it, kicker) {
      return '<div class="quiz-head">' +
          '<p class="quiz-q">' + (kicker ? '<span class="quiz-kicker">' + esc(kicker) + '</span>' : '') + esc(it.q) + '</p>' +
          '<span class="quiz-meta">' +
            '<span class="quiz-streak" data-streak' + (streak >= 2 ? '' : ' hidden') + '>' + streak + ' in a row</span>' +
            (items.length > 1 ? '<span class="quiz-step">' + (i + 1) + ' / ' + items.length + '</span>' : '') +
            soundButton() +
          '</span>' +
        '</div>';
    }

    /* Every point goes through here: it is what keeps the streak, the sound
       and the tally in step whatever kind of question earned it. */
    function mark(ok) {
      marks.push(ok);
      if (ok) { streak++; sfx.right(streak); } else { streak = 0; sfx.wrong(); }
      paintStreak();
    }
    function paintStreak() {
      var el = $('[data-streak]', host);
      if (!el) return;
      el.hidden = streak < 2;
      if (streak >= 2) {
        el.textContent = streak + ' in a row';
        el.classList.remove('bump');
        void el.offsetWidth;          // restart the bump animation
        el.classList.add('bump');
      }
    }

    /* The explanation and the way on, shared by every type. */
    function settle(right, whyHtml, after, extraHtml) {
      var last = i === items.length - 1;
      var why = document.createElement('p');
      why.className = 'quiz-why' + (right ? ' is-right' : '');
      why.setAttribute('role', 'status');
      why.innerHTML = '<strong>' + (right ? 'Yes.' : 'Not quite.') + '</strong> ' + whyHtml;
      after.insertAdjacentElement('afterend', why);
      if (extraHtml) why.insertAdjacentHTML('afterend', extraHtml);

      var foot = $('[data-foot]', host);
      foot.hidden = false;
      foot.innerHTML = '<button class="btn btn-primary btn-small" type="button" data-next>' +
                       (last ? 'See how you did' : 'Next question') + '</button>';
      var next = $('[data-next]', foot);
      next.addEventListener('click', function () {
        if (last) { drawDone(); return; }
        i++; drawQuestion();
      });
      // Whatever was pressed is now disabled, so hand keyboard focus on.
      try { next.focus({ preventScroll: true }); } catch (e) { next.focus(); }
    }

    function drawQuestion() {
      var it = items[i];
      if (it.type === 'order') return drawOrder(it);
      if (it.type === 'match') return drawMatch(it);
      if (it.type === 'sort') return drawSort(it);
      drawChoice(it);
    }

    /* ---------- choice, and true/false, which is a choice of two ---------- */
    function drawChoice(it) {
      host.innerHTML =
        '<div class="quiz">' +
          head(it, it.tf ? 'True or false?' : '') +
          '<ul class="quiz-options' + (it.tf ? ' is-tf' : '') + '">' +
            it.options.map(function (o, n) {
              return '<li><button class="quiz-option" type="button" data-n="' + n + '">' +
                       // True/False needs no letter; its mark waits for the tick or cross.
                       '<span class="mark">' + (it.tf ? '' : String.fromCharCode(65 + n)) + '</span>' +
                       '<span>' + esc(o) + '</span>' +
                     '</button></li>';
            }).join('') +
          '</ul>' +
          '<div class="quiz-foot" data-foot hidden></div>' +
        '</div>';

      $$('.quiz-option', host).forEach(function (btn) {
        btn.addEventListener('click', function () { answerChoice(it, Number(btn.getAttribute('data-n'))); });
      });
    }
    function answerChoice(it, n) {
      var right = n === it.answer;
      /* A right pick gets stamped: the row presses down, violet floods out
         from its mark and the tick inks in (CSS: .just-stamped). The answer
         revealed after a wrong pick gets the tick without the ceremony. */
      $$('.quiz-option', host).forEach(function (btn, idx) {
        btn.disabled = true;
        var m = btn.querySelector('.mark');
        if (idx === it.answer) {
          btn.classList.add('is-correct');
          m.innerHTML = TICK + (right ? '<i class="ink" aria-hidden="true"></i>' : '');
          if (right) btn.classList.add('just-stamped');
        } else if (idx === n) {
          btn.classList.add('is-wrong');
          m.innerHTML = CROSS;
        }
      });
      mark(right);
      settle(right, esc(it.why), $('.quiz-options', host));
    }

    /* ---------- put in order ----------
       Arrows rather than dragging: they work the same with a mouse, a thumb,
       a keyboard and a screen reader, and nothing can be dropped by accident. */
    function drawOrder(it) {
      var at = it.start.slice();
      host.innerHTML =
        '<div class="quiz">' +
          head(it, 'Put in order') +
          '<ol class="quiz-order" data-list></ol>' +
          '<p class="sr-only" aria-live="polite" data-said></p>' +
          '<div class="quiz-foot" data-foot><button class="btn btn-primary btn-small" type="button" data-order-done>Check the order</button></div>' +
        '</div>';
      var list = $('[data-list]', host);

      function paint(focusKey, focusDir) {
        list.innerHTML = at.map(function (k, pos) {
          var text = esc(it.steps[k]);
          return '<li class="order-row" data-k="' + k + '">' +
              '<span class="order-n" aria-hidden="true">' + (pos + 1) + '</span>' +
              '<span class="order-text">' + text + '</span>' +
              '<span class="order-move">' +
                '<button type="button" data-move="-1" aria-label="Move up: ' + text + '"' + (pos === 0 ? ' disabled' : '') + '>' +
                  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button>' +
                '<button type="button" data-move="1" aria-label="Move down: ' + text + '"' + (pos === at.length - 1 ? ' disabled' : '') + '>' +
                  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>' +
              '</span>' +
            '</li>';
        }).join('');
        if (focusKey != null) {
          var row = $('[data-k="' + focusKey + '"]', list);
          var btn = row && ($('[data-move="' + focusDir + '"]:not(:disabled)', row) || $('[data-move]:not(:disabled)', row));
          if (btn) btn.focus();
        }
      }
      paint();

      list.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-move]');
        if (!btn || btn.disabled) return;
        var k = Number(btn.closest('[data-k]').getAttribute('data-k'));
        var dir = Number(btn.getAttribute('data-move'));
        var pos = at.indexOf(k), to = pos + dir;
        if (to < 0 || to >= at.length) return;
        at[pos] = at[to]; at[to] = k;
        paint(k, dir);
        $('[data-said]', host).textContent = 'Now step ' + (to + 1) + ' of ' + at.length + '.';
      });

      $('[data-order-done]', host).addEventListener('click', function () {
        var right = at.every(function (k, pos) { return k === pos; });
        $$('.order-row', list).forEach(function (row, pos) {
          var ok = at[pos] === pos;
          row.classList.add(ok ? 'is-correct' : 'is-wrong');
          $('.order-n', row).innerHTML = ok ? TICK : CROSS;
        });
        $$('[data-move]', list).forEach(function (b) { b.disabled = true; });
        mark(right);
        settle(right, esc(it.why), list, right ? '' :
          '<ol class="order-answer" aria-label="The right order">' +
            it.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>');
      });
    }

    /* ---------- match board ----------
       Pick a term, then the meaning that goes with it (or the other way
       round). A pair matched with no slip on that term is a point; a slip
       costs the point but the pair still has to be found, so the board
       always ends complete. */
    function drawMatch(it) {
      var selT = null, selD = null, slipped = {}, matched = 0;
      host.innerHTML =
        '<div class="quiz">' +
          head(it, 'Match them up') +
          '<div class="match-board">' +
            '<ul class="match-terms">' +
              it.pairs.map(function (p, k) {
                return '<li><button class="match-term" type="button" data-t="' + k + '" aria-pressed="false">' + esc(p[0]) + '</button></li>';
              }).join('') +
            '</ul>' +
            '<ul class="match-defs">' +
              it.defs.map(function (k) {
                return '<li><button class="match-def" type="button" data-d="' + k + '" aria-pressed="false">' +
                         '<span class="match-badge" aria-hidden="true"></span><span>' + esc(it.pairs[k][1]) + '</span></button></li>';
              }).join('') +
            '</ul>' +
          '</div>' +
          '<p class="sr-only" aria-live="polite" data-said></p>' +
          '<div class="quiz-foot" data-foot hidden></div>' +
        '</div>';
      var said = $('[data-said]', host);

      function press(sel, attr, k) {
        $$('[' + attr + ']', host).forEach(function (b) {
          var on = k != null && b.getAttribute(attr) === String(k);
          b.classList.toggle('is-picked', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      }
      function tryPair() {
        if (selT == null || selD == null) return;
        var t = $('[data-t="' + selT + '"]', host), d = $('[data-d="' + selD + '"]', host);
        if (selT === selD) {
          matched++;
          var clean = !slipped[selT];
          [t, d].forEach(function (b) { b.classList.remove('is-picked'); b.classList.add('is-matched'); b.disabled = true; });
          $('.match-badge', d).textContent = it.pairs[selT][0];
          marks.push(clean);
          if (clean) { streak++; sfx.right(streak); } else sfx.tap();
          paintStreak();
          said.textContent = 'Matched: ' + it.pairs[selT][0] + '.';
        } else {
          slipped[selT] = true;
          if (streak) { streak = 0; paintStreak(); }
          sfx.wrong();
          [t, d].forEach(function (b) {
            b.classList.remove('is-picked', 'is-slip');
            void b.offsetWidth;
            b.classList.add('is-slip');
          });
          said.textContent = 'Not those two. Try another meaning.';
        }
        selT = selD = null;
        press(null, 'data-t'); press(null, 'data-d');
        if (matched === it.pairs.length) {
          var clean = it.pairs.length - Object.keys(slipped).length;
          var right = clean === it.pairs.length;
          var line = right ? 'All ' + clean + ' matched first time.'
                           : clean + ' of ' + it.pairs.length + ' matched first time.';
          settle(right, esc(line + (it.why ? ' ' + it.why : '')), $('.match-board', host));
        }
      }
      $$('.match-term', host).forEach(function (b) {
        b.addEventListener('click', function () {
          var k = Number(b.getAttribute('data-t'));
          selT = selT === k ? null : k;
          press(null, 'data-t'); if (selT != null) press(null, 'data-t', selT);
          tryPair();
        });
      });
      $$('.match-def', host).forEach(function (b) {
        b.addEventListener('click', function () {
          var k = Number(b.getAttribute('data-d'));
          selD = selD === k ? null : k;
          press(null, 'data-d'); if (selD != null) press(null, 'data-d', selD);
          tryPair();
        });
      });
    }

    /* ---------- sort into buckets ----------
       One card at a time. A right call moves on by itself after a beat; a
       wrong one stops and explains, because that is the card worth reading. */
    function drawSort(it) {
      var c = 0, got = 0;
      var filed = it.buckets.map(function () { return 0; });
      host.innerHTML =
        '<div class="quiz">' +
          head(it, 'Sort them') +
          '<div class="sort" data-sort></div>' +
          '<div class="quiz-foot" data-foot hidden></div>' +
        '</div>';
      var box = $('[data-sort]', host);

      function card() {
        var cd = it.cards[c];
        box.innerHTML =
          '<p class="sort-count">Example ' + (c + 1) + ' of ' + it.cards.length + '</p>' +
          '<p class="sort-card" tabindex="-1">' + esc(cd.text) + '</p>' +
          '<ul class="sort-buckets">' +
            it.buckets.map(function (b, n) {
              return '<li><button class="sort-bucket" type="button" data-b="' + n + '">' +
                       '<span>' + esc(b) + '</span><span class="sort-filed" aria-hidden="true">' + filed[n] + '</span>' +
                     '</button></li>';
            }).join('') +
          '</ul>' +
          '<div class="sort-after" data-after></div>';
        $$('.sort-bucket', box).forEach(function (b) {
          b.addEventListener('click', function () { pick(Number(b.getAttribute('data-b'))); });
        });
      }
      function pick(n) {
        var cd = it.cards[c];
        var ok = n === cd.bucket;
        if (ok) got++;
        filed[cd.bucket]++;
        $$('.sort-bucket', box).forEach(function (b, idx) {
          b.disabled = true;
          if (idx === cd.bucket) { b.classList.add('is-correct'); $('.sort-filed', b).textContent = filed[idx]; }
          else if (idx === n) b.classList.add('is-wrong');
        });
        mark(ok);
        var last = c === it.cards.length - 1;
        var after = $('[data-after]', box);
        if (ok && !last) {
          after.innerHTML = '<p class="sort-note is-right" role="status"><strong>Yes.</strong> ' + esc(cd.why) + '</p>';
          setTimeout(function () { c++; card(); $('.sort-card', box).focus({ preventScroll: true }); }, calm() ? 1600 : 1300);
          return;
        }
        if (!ok) {
          after.innerHTML = '<p class="sort-note" role="status"><strong>Not quite.</strong> ' + esc(cd.why) + '</p>';
        }
        if (last) {
          var right = got === it.cards.length;
          var line = (right ? 'All ' + got : got + ' of ' + it.cards.length) + ' sorted right.';
          if (ok) after.innerHTML = '';
          settle(right, esc(line + (it.why ? ' ' + it.why : '')), box);
          return;
        }
        after.innerHTML += '<button class="btn btn-primary btn-small" type="button" data-on>Next example</button>';
        var on = $('[data-on]', after);
        on.addEventListener('click', function () { c++; card(); $('.sort-card', box).focus({ preventScroll: true }); });
        try { on.focus({ preventScroll: true }); } catch (e) { on.focus(); }
      }
      card();
    }

    function drawDone() {
      var total = marks.length;
      var score = marks.filter(Boolean).length;
      var note = score === total ? 'all of them. You can explain this to somebody else now.'
               : score >= total - 1 ? 'close. The one you missed is worth a re-read.'
               : 'worth another pass through the takeaways above.';
      var pct = Math.round(score / total * 100);
      var prev = opts.previous ? opts.previous() : null;
      var again = '<button class="btn btn-ghost btn-small" type="button" data-again>Try again</button>';

      if (pct >= 80) drawSealed(score, total, pct, note, prev, again);
      else {
        host.innerHTML =
          '<div class="quiz">' +
            '<p class="quiz-score"><strong>' + score + ' of ' + total + '</strong> — ' + esc(note) + '</p>' +
            '<div class="quiz-foot">' + again + '</div>' +
          '</div>';
      }
      $('[data-again]', host).addEventListener('click', function () {
        items = prepare(opts.restart ? opts.restart() : items);   // reshuffle on every run
        i = 0; streak = 0; marks = []; drawQuestion();
      });
      if (opts.onFinish) opts.onFinish(score, total);
    }

    /* 80% or better: the page gets sealed. One pip per point fills in
       order while the score counts up with it, then the seal stamps down.
       The finished state is in the markup; the motion only replays it. */
    function drawSealed(score, total, pct, note, prev, again) {
      var still = calm();
      var step = Math.min(70, Math.round(700 / total));      // the tally never takes more than ~0.7s
      var landAt = total * step + 120;
      var best = prev && prev.total === total && score > prev.score;
      var next = opts.next ? opts.next() : null;

      host.innerHTML =
        '<div class="quiz quiz-sealed' + (score === total ? ' is-perfect' : '') + '" style="--land:' + landAt + 'ms">' +
          '<div class="seal" aria-hidden="true">' + TICK + '<i class="ink"></i></div>' +
          '<div class="sealed-body">' +
            '<p class="sealed-score" tabindex="-1">' +
              '<span class="sr-only">' + score + ' of ' + total + ' right</span>' +
              '<span aria-hidden="true"><b data-count>' + (still ? score : 0) + '</b> of ' + total + '</span>' +
              '<span class="sealed-pct">' + pct + '%</span>' +
              (best ? '<span class="sealed-best">New best</span>' : '') +
            '</p>' +
            '<p class="sealed-note">' + esc(note.charAt(0).toUpperCase() + note.slice(1)) + '</p>' +
            '<ol class="tally" aria-hidden="true">' +
              marks.map(function (ok, n) {
                return '<li class="' + (ok ? 'is-right' : 'is-miss') + '" style="--d:' + (n * step) + 'ms"></li>';
              }).join('') +
            '</ol>' +
            '<div class="quiz-foot">' +
              (next ? '<a class="btn btn-primary btn-small" href="' + next.href + '">' + esc(next.label) + '</a>' : '') +
              again +
            '</div>' +
          '</div>' +
        '</div>';

      var headEl = $('.sealed-score', host);
      try { headEl.focus({ preventScroll: true }); } catch (e) {}
      // The arpeggio lands with the seal.
      setTimeout(function () { sfx.sealed(score === total); }, still ? 0 : landAt);
      if (still) return;
      var count = $('[data-count]', host), shown = 0;
      marks.forEach(function (ok, n) {
        if (ok) setTimeout(function () { count.textContent = ++shown; }, n * step + 180);
      });
    }

    if (!items || !items.length) { host.innerHTML = ''; return; }
    drawQuestion();
  }

  /* =====================================================
     AGENDA
     ===================================================== */
  function renderAgenda() {
    var ev = audienceView();

    // One flag in content.js takes the section, its nav link and its search
    // entries together. The data is left alone so the next session only has
    // to flip it back.
    var sec = $('#agenda');
    var nav = $('.site-nav a[href="#agenda"]');
    if (S.agendaHidden) {
      if (sec) sec.hidden = true;
      if (nav) nav.remove();
      return;
    }
    if (sec) sec.hidden = false;

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
          track('prompt_copy', { prompt: S.prompts[Number(btn.getAttribute('data-copy'))].title });
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

  /* ---------- Term match (a board built from the glossary) ----------
     `terms` names the glossary entries to draw from, which is how a board
     avoids re-asking a term a lesson question already covers. Without it,
     the draw is every term whose `module` is the entry's track. `rounds` is
     how many pairs go on the board, picked fresh on every run. Each meaning
     is the definition's first sentence: the board is for recognising a
     term, and the glossary under Reference has the rest. */
  function matchBoard(cfg) {
    var pool = (S.glossary || []).filter(function (g) {
      if (cfg.terms) return cfg.terms.indexOf(g.term) >= 0;
      return !cfg.module || cfg.module === 'all' || g.module === cfg.module;
    });
    if (pool.length < 3) return null;
    shuffle(pool);
    var pairs = pool.slice(0, Math.min(cfg.rounds || 5, pool.length)).map(function (g) {
      var first = /^.*?[.!?](?=\s|$)/.exec(g.def);
      return [g.term, first ? first[0] : g.def];
    });
    return { type: 'match', q: cfg.prompt || 'Match each term to what it means.', pairs: pairs, why: cfg.why };
  }
  function buildMatch(host, cfg) {
    var make = function () { var b = matchBoard(cfg); return b ? [b] : []; };
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

  function practiceCard(p) {
    var foot = '';
    if (p.note || p.link) {
      foot = '<div class="practice-foot">' +
        (p.note ? '<p class="practice-note">' + esc(p.note) + '</p>' : '') +
        (p.link ? '<a href="' + esc(p.link.url) + '" target="_blank" rel="noopener">' + esc(p.link.label) + ' →</a>' : '') +
        '</div>';
    }
    var kind = (p.group || 'demo') === 'quiz'
      ? '<span class="practice-kind is-quiz">Check yourself</span>'
      : '<span class="practice-kind is-demo">Try it</span>';
    return '<article class="practice-card" data-practice="' + esc(p.id) + '">' +
      '<div class="practice-tags">' + kind +
        (p.tag ? '<span class="practice-tag">' + esc(p.tag) + '</span>' : '') +
      '</div>' +
      '<h4>' + esc(p.title) + '</h4>' +
      '<p class="practice-blurb">' + esc(p.blurb) + '</p>' +
      '<div class="practice-body"></div>' + foot +
    '</article>';
  }
  // Each engine gets its card's body element and its entry from content.js.
  function mountPractice(root, items) {
    items.forEach(function (p) {
      var card = root.querySelector('[data-practice="' + p.id + '"]');
      if (!card) return;
      PRACTICE_ENGINES[p.type]($('.practice-body', card), p);
      // Counted once per visit to the module, on the first click or keystroke.
      var used = false;
      var onUse = function () {
        if (used) return;
        used = true;
        track('practice_use', { activity: p.id, type: p.type });
      };
      card.addEventListener('click', onUse);
      card.addEventListener('input', onUse);
    });
  }

  /* =====================================================
     MODULES — the cards on the home page and the article
     pages they open. One article per module, built from
     SITE.modules; the address decides which view shows:
       #/module/<id>             that module, from the top
       #/module/<id>/<section>   scrolled to a section
       #/module/<id>/practice    scrolled to its practice
       #lesson-<id>              redirected to the section
                                 that carries that lesson
       anything else             the home view
     ===================================================== */
  var MODULES = S.modules || [];
  var homeView = $('#homeView');
  var moduleView = $('#moduleView');
  var referenceView = $('#referenceView');
  var shownModule = null;
  var homeTitle = document.title;

  function moduleById(id) {
    for (var i = 0; i < MODULES.length; i++) if (MODULES[i].id === id) return MODULES[i];
    return null;
  }
  function moduleForTrack(track) {
    for (var i = 0; i < MODULES.length; i++) if (MODULES[i].track === track) return MODULES[i];
    return null;
  }
  function moduleHref(m, sec) { return '#/module/' + m.id + (sec ? '/' + sec : ''); }

  // Sections and their sub-parts, flattened, in reading order.
  function moduleParts(m) {
    var out = [];
    m.sections.forEach(function (s) {
      out.push(s);
      (s.parts || []).forEach(function (p) { out.push(p); });
    });
    return out;
  }
  function moduleLessonIds(m) {
    return moduleParts(m).map(function (p) { return p.lesson; }).filter(Boolean);
  }
  function sectionForLesson(lessonId) {
    for (var i = 0; i < MODULES.length; i++) {
      var parts = moduleParts(MODULES[i]);
      for (var j = 0; j < parts.length; j++) {
        if (parts[j].lesson === lessonId) return { m: MODULES[i], sec: parts[j].id };
      }
    }
    return null;
  }

  /* Plain text of a block list, for the word count and the search index. */
  function blocksText(blocks) {
    return (blocks || []).map(function (b) {
      if (typeof b === 'string') return b;
      if (b.list || b.steps) return (b.list || b.steps).join(' ');
      if (b.table) return [].concat(b.table.head, [].concat.apply([], b.table.rows)).join(' ');
      return '';
    }).join(' ').replace(/\*\*/g, '');
  }
  function partText(p) { return blocksText(p.body) + ' ' + (p.takeaway || ''); }

  /* Read time is counted from the words on the page at ~200 a minute, so it
     cannot drift from the content. Video runtime is not included. */
  function moduleStats(m) {
    var words = 0, videos = 0;
    moduleParts(m).forEach(function (p) {
      words += partText(p).split(/\s+/).filter(Boolean).length;
      var l = lessonById(p.lesson);
      if (l && l.video) videos++;
    });
    return { sections: m.sections.length, videos: videos, minutes: Math.max(1, Math.round(words / 200)) };
  }

  // **bold** is the one piece of inline markup content.js uses.
  function inline(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'); }
  function blockHtml(b) {
    if (typeof b === 'string') return '<p>' + inline(b) + '</p>';
    if (b.list)  return '<ul class="art-list">' + b.list.map(function (x) { return '<li>' + inline(x) + '</li>'; }).join('') + '</ul>';
    if (b.steps) return '<ol class="art-steps">' + b.steps.map(function (x) { return '<li>' + inline(x) + '</li>'; }).join('') + '</ol>';
    if (b.table) {
      return '<div class="art-table"><table><thead><tr>' +
        b.table.head.map(function (h) { return '<th scope="col">' + inline(h) + '</th>'; }).join('') +
        '</tr></thead><tbody>' +
        b.table.rows.map(function (r) {
          return '<tr>' + r.map(function (c, n) {
            return n === 0 ? '<th scope="row">' + inline(c) + '</th>' : '<td>' + inline(c) + '</td>';
          }).join('') + '</tr>';
        }).join('') +
        '</tbody></table></div>';
    }
    return '';
  }

  /* "Ji et al. (2023)" from a full APA entry: an organisation keeps its name,
     two authors are joined with &, three or more become "et al." */
  function sourceShort(src) {
    var head = src.text.split(' (')[0].replace(/\.$/, '');
    var year = (src.text.match(/\((\d{4}|n\.d\.)/) || [])[1] || '';
    var names = head.match(/[^\s,&]+, [A-Z]\./g) || [];
    var label = !names.length ? head
      : names.length === 1 ? names[0].split(',')[0]
      : names.length === 2 ? names[0].split(',')[0] + ' & ' + names[1].split(',')[0]
      : names[0].split(',')[0] + ' et al.';
    return label + (year ? ' (' + year + ')' : '');
  }
  function sourceLink(id, full) {
    var src = (S.sources || {})[id];
    if (!src) return '';
    var text = full ? esc(src.text) : esc(sourceShort(src));
    return src.url ? '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + text + '</a>' : text;
  }
  function moduleSources(m) {
    var seen = [];
    moduleParts(m).forEach(function (p) {
      (p.sources || []).forEach(function (id) { if (seen.indexOf(id) < 0) seen.push(id); });
    });
    return seen;
  }

  /* A poster with a play button; the player only loads when it is pressed,
     so opening a module never pulls in a third-party embed on its own. */
  function videoHtml(lessonId) {
    var l = lessonById(lessonId);
    if (!l || !l.video) return '';
    var p = parseVideo(l.video);
    var thumb = thumbFor(l.video);
    var tracked = p && p.kind === 'file';
    return '<figure class="art-video"' + (tracked ? ' data-lesson="' + esc(l.id) + '"' : '') + '>' +
      '<div class="art-player">' +
        '<button class="art-poster' + (l.videoAspect ? ' is-portrait" style="aspect-ratio:' + esc(l.videoAspect) : '') +
          '" type="button" data-play="' + esc(l.id) + '" aria-label="Play video: ' + esc(l.title) + '">' +
          (thumb ? '<img src="' + esc(thumb) + '" alt="" loading="lazy">' : '') +
          '<span class="play">' + icon('play') + '</span>' +
        '</button>' +
      '</div>' +
      '<figcaption><span><strong>Video:</strong> ' + esc(l.title) +
        (tracked ? ' <span class="art-watched"' + (watchedSet.has(l.id) ? '' : ' hidden') + '>Watched</span>' : '') +
        '</span>' +
        '<span>' + (p && p.kind === 'file' ? 'Purple Maiʻa' : 'Outside explainer') + '</span></figcaption>' +
      /* Ours is the lesson; this is the long version standing behind it. A
         real player and not a link, because depth is what separates this
         edition from the community one: "a mile wide and an inch deep" is
         that edition's brief, not this one's, and a link in the margin is not
         a depth layer. It ships folded shut, so the page still loads no
         third-party anything until someone asks for it - the YouTube
         thumbnail is built on first open, the iframe only on the click after
         that. `community.js` deletes `deeper`, so none of this reaches it. */
      (l.deeper
        ? '<details class="art-deeper" data-deeper="' + esc(l.id) + '">' +
            '<summary><span class="art-deeper-tag">Go deeper</span>' +
            'Outside explainer, ' + esc(l.deeper.length) + '</summary>' +
            '<div class="art-deeper-slot"></div>' +
          '</details>'
        : '') +
    '</figure>';
  }

  function citeLine(p) {
    var sources = (p.sources || []).map(function (id) { return sourceLink(id); }).filter(Boolean);
    return sources.length ? '<p class="art-cite">Sources: ' + sources.join('; ') + '</p>' : '';
  }
  // `withSources` is false for a section with parts: its sources go after them.
  function partHtml(p, tag, withSources) {
    return '<' + tag + '>' + esc(p.heading) + '</' + tag + '>' +
      (p.body || []).map(blockHtml).join('') +
      videoHtml(p.lesson) +
      demosFor(p.id).map(function (d) { return '<div class="art-demo">' + practiceCard(d) + '</div>'; }).join('') +
      (p.takeaway
        ? '<aside class="takeaway"><p class="takeaway-label">Key takeaway</p><p>' + inline(p.takeaway) + '</p></aside>'
        : '') +
      (withSources === false ? '' : citeLine(p));
  }

  /* Question activities (group "quiz") join their module's "Check your
     understanding"; ones that span every module close out the last module. */
  function quizActivitiesFor(m) {
    var last = MODULES[MODULES.length - 1] === m;
    return (S.practice || []).filter(function (p) {
      if (p.group !== 'quiz') return false;
      var mod = p.module || 'all';
      return mod === m.track || (last && mod === 'all');
    });
  }
  /* A module's practice, as one or more checks.

     Without `checks` in content.js a module has one, at the end, holding
     every lesson's questions and every question activity: the shape this
     page always had. With `checks`, each one names its lessons and its
     activities and sits right after the section in `after`, so a long
     module is tested in the stretch it covers rather than all at the end.

     The last check keeps the key "module:<id>" and the section "practice",
     so a result saved before checks existed still counts, and old
     #/module/<id>/practice links still land on it. */
  function checksFor(m) {
    var acts = quizActivitiesFor(m);
    if (!m.checks || !m.checks.length) {
      return [{ key: 'module:' + m.id, sec: 'practice', title: m.title, lessons: moduleLessonIds(m), acts: acts, last: true }];
    }
    return m.checks.map(function (c, k) {
      var last = k === m.checks.length - 1;
      return {
        key: last ? 'module:' + m.id : 'module:' + m.id + ':' + c.id,
        sec: last ? 'practice' : 'check-' + c.id,
        title: c.title,
        after: last ? null : c.after,
        lessons: c.lessons || [],
        acts: acts.filter(function (p) { return (c.practice || []).indexOf(p.id) >= 0; }),
        last: last
      };
    });
  }
  /* One check's items: its lessons' questions, then its activities. Term
     match deals a fresh board on every call, so "Try again" gets new pairs. */
  function checkItems(c) {
    var items = c.lessons.reduce(function (all, id) {
      return all.concat(((S.quizzes || {})[id]) || []);
    }, []);
    c.acts.forEach(function (p) {
      if (p.type === 'match') { var b = matchBoard(p); if (b) items.push(b); }
      else if (p.type === 'sort') items.push({ type: 'sort', q: p.prompt, buckets: p.buckets, cards: p.cards, why: p.note });
      else items = items.concat(p.items || []);
    });
    return items;
  }
  function liveChecks(m) {
    return checksFor(m).filter(function (c) { return checkItems(c).length > 0; });
  }
  /* Hands-on demos (group "demo") sit inside the section they illustrate. */
  function demosFor(partId) {
    return (S.practice || []).filter(function (p) {
      return p.group !== 'quiz' && p.section === partId && PRACTICE_ENGINES[p.type];
    });
  }

  /* ---------- progress ----------
     A module is its sections, its videos and its practice. A section is read
     once you have scrolled to its end; a video is watched once 90% of it has
     actually played (see onVideoProgress); practice is done once the module
     quiz has been answered all the way through. A section only counts as done
     when it is read and its videos are watched. */
  function sectionLessonIds(s) {
    return [s.lesson].concat((s.parts || []).map(function (p) { return p.lesson; })).filter(Boolean);
  }

  /* Videos watched, by lesson id. Only our own files count: an outside embed
     cannot report how much of it played, so it could never be ticked off. */
  var WKEY = 'aihub:watched';
  var watchedSet = (function () {
    try { return new Set(JSON.parse(localStorage.getItem(WKEY) || '[]')); }
    catch (e) { return new Set(); }
  })();
  function saveWatched() {
    try { localStorage.setItem(WKEY, JSON.stringify(Array.from(watchedSet))); } catch (e) {}
  }
  function trackedVideo(id) {
    var l = lessonById(id), p = l && parseVideo(l.video);
    return !!(p && p.kind === 'file');
  }
  function sectionVideoIds(s) { return sectionLessonIds(s).filter(trackedVideo); }
  function sectionDone(s) {
    return isRead(s) && sectionVideoIds(s).every(function (id) { return watchedSet.has(id); });
  }
  function isRead(s) {
    if (readSet.has(s.id)) return true;
    var ids = sectionLessonIds(s);
    return ids.length > 0 && ids.every(function (id) { return done.has(id); });
  }
  function markRead(s) {
    readSet.add(s.id);
    sectionLessonIds(s).forEach(function (id) { done.add(id); });
    saveRead();
    saveProgress();
    track('section_read', { module: shownModule || '', section: s.id });
  }
  function moduleProgress(m) {
    var read = m.sections.filter(isRead).length;
    var total = m.sections.length;
    // Each check is a unit of its own; a module with none counts one, done.
    var checks = liveChecks(m).map(function (c) { return { sec: c.sec, after: c.after, done: !!quizState[c.key] }; });
    var passed = checks.filter(function (c) { return c.done; }).length;
    var practice = passed === checks.length;
    var vids = [];
    m.sections.forEach(function (s) { vids = vids.concat(sectionVideoIds(s)); });
    var watched = vids.filter(function (id) { return watchedSet.has(id); }).length;
    var units = read + watched + (checks.length ? passed : 1), of = total + vids.length + Math.max(checks.length, 1);
    // "Continue" goes to the first thing still undone, in reading order: a
    // section short of a read or a video, or a check sitting after one.
    var next = null;
    for (var i = 0; i < m.sections.length && !next; i++) {
      var s = m.sections[i];
      if (!sectionDone(s)) { next = s.id; break; }
      checks.forEach(function (c) { if (!next && c.after === s.id && !c.done) next = c.sec; });
    }
    if (!next && !practice) next = 'practice';
    return {
      read: read, total: total, practice: practice, checks: checks,
      watched: watched, videos: vids.length,
      units: units, of: of,
      pct: Math.round((units / of) * 100),
      started: units > 0, complete: read === total && watched === vids.length && practice,
      next: next
    };
  }
  function progressLabel(pr) {
    if (pr.complete) return 'Done';
    if (!pr.started) return 'Not started';
    var left = pr.videos - pr.watched;
    var videosLeft = left + ' video' + (left === 1 ? '' : 's') + ' left';
    if (pr.read === pr.total && !left) return 'Practice left';
    if (pr.read === pr.total && pr.practice) return videosLeft;
    // The bar counts videos and practice too, so say so when they are part of the fill.
    return pr.read + ' of ' + pr.total + ' sections read' +
      (pr.videos ? ' · ' + pr.watched + ' of ' + pr.videos + ' videos watched' : '') +
      (pr.practice ? ' · practice done' : '');
  }

  function renderModule(m) {
    var n = MODULES.indexOf(m);
    var next = MODULES[n + 1];
    var before = n > 0 ? MODULES[n - 1] : null;
    var st = moduleStats(m);
    var checks = liveChecks(m);
    var demos = moduleParts(m).reduce(function (all, p) { return all.concat(demosFor(p.id)); }, []);
    var srcs = moduleSources(m);
    // A mid-module check sits after its section; the last one closes the article.
    function checksAfter(secId) {
      return checks.filter(function (c) { return secId ? c.after === secId : !c.after; });
    }
    function checkLabel(c) {
      if (c.last && !m.checks) return 'Practice';
      return (c.last ? 'Practice: ' : 'Quick check: ') + c.title;
    }
    function checkToc(c) {
      return '<li class="art-toc-practice"><a href="' + moduleHref(m, c.sec) + '" data-toc="' + esc(c.sec) + '">' +
               esc(checkLabel(c)) + '<span class="sr-only" data-read-note></span></a></li>';
    }
    function checkHtml(c) {
      var prev = quizState[c.key];
      return '<section class="art-section art-practice' + (c.last ? '' : ' is-midway') + '" id="s-' + esc(c.sec) + '" data-sec="' + esc(c.sec) + '">' +
          '<h2>' + esc(c.last && !m.checks ? 'Practice: ' + m.title : checkLabel(c)) +
            (prev ? ' <span class="quiz-step">best so far: ' + prev.score + ' / ' + prev.total + '</span>' : '') +
          '</h2><div class="art-quiz" data-check="' + esc(c.sec) + '"></div>' +
        '</section>';
    }

    moduleView.innerHTML =
      '<div class="wrap">' +
        '<header class="art-head">' +
          '<span class="art-num" aria-hidden="true">' + (n + 1) + '</span>' +
          '<div class="art-head-copy">' +
            '<p class="crumb"><a href="#/">Modules</a> / Module ' + (n + 1) + ' of ' + MODULES.length + '</p>' +
            '<h1 id="moduleTitle" tabindex="-1">' + esc(m.title) + '</h1>' +
            '<p class="art-lede">' + esc(m.lede || m.summary) + '</p>' +
            '<p class="art-facts">' +
              '<span><strong>' + st.sections + '</strong> sections</span>' +
              '<span><strong>' + st.videos + '</strong> videos</span>' +
              '<span>About <strong>' + st.minutes + '</strong> min read</span>' +
              '<span class="art-status" id="artStatus"></span>' +
            '</p>' +
          '</div>' +
        '</header>' +
        '<div class="art-layout">' +
          // First in the page order so keyboard and screen-reader users meet it
          // before the article; CSS puts it in the right-hand column.
          '<nav class="art-toc" aria-label="In this module"><span class="art-toc-marker" aria-hidden="true"></span><p class="art-toc-title">In this module</p><ol>' +
            m.sections.map(function (s) {
              return '<li><a href="' + moduleHref(m, s.id) + '" data-toc="' + esc(s.id) + '">' + esc(s.heading) +
                '<span class="sr-only" data-read-note></span></a></li>' +
                checksAfter(s.id).map(checkToc).join('');
            }).join('') +
            checksAfter(null).map(checkToc).join('') +
          '</ol></nav>' +
          '<article class="art-body" aria-labelledby="moduleTitle">' +
            (m.warmup ? '<section class="art-warmup" id="s-warmup" aria-labelledby="warmupTitle"></section>' : '') +
            m.sections.map(function (s) {
              return '<section class="art-section" id="s-' + esc(s.id) + '" data-sec="' + esc(s.id) + '">' +
                partHtml(s, 'h2', !(s.parts || []).length) +
                (s.parts || []).map(function (p) {
                  return '<div class="art-part" id="s-' + esc(p.id) + '">' + partHtml(p, 'h3') + '</div>';
                }).join('') +
                ((s.parts || []).length ? citeLine(s) : '') +
              '</section>' +
              checksAfter(s.id).map(checkHtml).join('');
            }).join('') +

            checksAfter(null).map(checkHtml).join('') +

            // Back on the left, onward on the right, the way a book or a
            // docs site pages. Module 1 has nothing before it, so its way back
            // is the list of all modules.
            '<nav class="art-pager" aria-label="Other modules">' +
              (before
                ? '<a class="art-prev" href="' + moduleHref(before) + '">' +
                    '<span class="art-pager-arrow" aria-hidden="true">←</span>' +
                    '<span><small>Previous · Module ' + n + '</small><strong>' + esc(before.title) + '</strong></span></a>'
                : '<a class="art-prev" href="#/">' +
                    '<span class="art-pager-arrow" aria-hidden="true">←</span>' +
                    '<span><small>Back</small><strong>All modules</strong></span></a>') +
              (next
                ? '<a class="art-next" href="' + moduleHref(next) + '">' +
                    '<span><small>Next · Module ' + (n + 2) + ' of ' + MODULES.length + '</small><strong>' + esc(next.title) + '</strong></span>' +
                    '<span class="art-pager-arrow" aria-hidden="true">→</span></a>'
                : '<a class="art-next" href="#/">' +
                    '<span><small>That was the last module</small><strong>All modules</strong></span>' +
                    '<span class="art-pager-arrow" aria-hidden="true">→</span></a>') +
            '</nav>' +

            (srcs.length
              ? '<section class="art-sources" aria-labelledby="srcHeading"><h2 id="srcHeading">Sources for this module</h2><ol>' +
                  srcs.map(function (id) { return '<li>' + sourceLink(id, true) + '</li>'; }).join('') +
                '</ol></section>'
              : '') +
          '</article>' +


        '</div>' +
      '</div>';

    // Pressing a poster swaps in the real player, which starts on its own.
    $$('[data-play]', moduleView).forEach(function (btn) {
      btn.addEventListener('click', function () {
        var l = lessonById(btn.getAttribute('data-play'));
        var holder = btn.parentNode;
        holder.outerHTML = embedFor(l.video, l.title, l.videoAspect);
        track('video_start', { video: l.id, source: (parseVideo(l.video) || {}).kind || '' });
      });
    });

    /* The follow-on explainer, built the first time its fold is opened and
       swapped for the real player on the click after that. Two gates, so a
       lesson nobody opens costs nothing and a fold nobody opens costs no
       request at all. */
    $$('[data-deeper]', moduleView).forEach(function (box) {
      box.addEventListener('toggle', function () {
        if (!box.open || box.getAttribute('data-filled')) return;
        box.setAttribute('data-filled', '1');
        var l = lessonById(box.getAttribute('data-deeper'));
        var slot = $('.art-deeper-slot', box);
        if (!l || !l.deeper || !slot) return;
        var vid = ytId(l.deeper.url);
        slot.innerHTML =
          (vid
            ? '<div class="art-player">' +
                '<button class="art-poster" type="button" aria-label="Play the outside explainer on ' +
                  esc(l.title) + ', ' + esc(l.deeper.length) + '">' +
                  '<img src="https://i.ytimg.com/vi/' + encodeURIComponent(vid) + '/hqdefault.jpg"' +
                  ' alt="" loading="lazy">' +
                  '<span class="play">' + icon('play') + '</span>' +
                '</button>' +
              '</div>'
            : '') +
          '<p class="art-deeper-note">Not ours. Someone else’s explainer on the same ' +
            'topic, kept because it goes further than a minute or two can. ' +
            '<a href="' + esc(l.deeper.url) + '" target="_blank" rel="noopener">' +
            'Watch it on YouTube</a> instead if you would rather.</p>';
        var btn = $('.art-poster', slot);
        if (btn) btn.addEventListener('click', function () {
          btn.parentNode.outerHTML =
            embedFor('youtube:' + vid, 'Outside explainer on ' + l.title, null, true);
          track('video_start', { video: l.id, source: 'deeper' });
        });
      });
    });

    checks.forEach(function (c) {
      // A midway check sends you on to the section after it; the last one on
      // to the next module.
      var resume = null;
      if (!c.last) {
        var at = m.sections.map(function (s) { return s.id; }).indexOf(c.after);
        resume = m.sections[at + 1];
      }
      renderQuiz($('[data-check="' + c.sec + '"]', moduleView), checkItems(c), {
        restart: function () { return checkItems(c); },
        previous: function () { return quizState[c.key] || null; },
        next: function () {
          if (resume) return { href: moduleHref(m, resume.id), label: 'Keep reading' };
          return next ? { href: moduleHref(next), label: 'On to Module ' + (n + 2) }
                      : { href: '#/', label: 'Back to all modules' };
        },
        onFinish: function (score, total) {
          saveQuizResult(c.key, score, total);
          track('quiz_complete', { module: m.id, check: c.sec });   // the score stays here (FAQ)
          paintModuleProgress();
        }
      });
    });
    if (demos.length) mountPractice(moduleView, demos);
    observeReveals(moduleView);
    watchToc();
    seen = {};
    scrolledSinceOpen = false;
    shownModule = m.id;
    warmPainted = null;
    if (m.warmup) paintWarmup(m);
    wasComplete = moduleProgress(m).complete;
    paintModuleProgress();
  }

  /* ---------- Take a guess ----------
     A few questions at the top of a module that nobody can know yet. There
     is no score and nothing counts toward progress: guessing first is what
     makes the answer stick when it turns up, and the not-knowing is what
     pulls you into the section. Each guess is kept in this browser; the
     answer is only shown once the section that teaches it has been read.
     Shape, in content.js: warmup: { title, blurb, items: [{ q, options,
     answer, why, at }] }, where `at` is the section or part that answers. */
  var GKEY = 'aihub:guess';
  var guesses = (function () {
    try { return JSON.parse(localStorage.getItem(GKEY) || '{}') || {}; }
    catch (e) { return {}; }
  })();
  function saveGuesses() {
    try { localStorage.setItem(GKEY, JSON.stringify(guesses)); } catch (e) {}
  }
  // The section that carries a part, so a part's answer waits for its section.
  function sectionOf(m, id) {
    for (var i = 0; i < m.sections.length; i++) {
      var s = m.sections[i];
      if (s.id === id || (s.parts || []).some(function (p) { return p.id === id; })) return s;
    }
    return null;
  }
  function partHeading(m, id) {
    var hit = moduleParts(m).filter(function (p) { return p.id === id; })[0];
    return hit ? hit.heading : '';
  }
  var warmOrder = {}, warmPainted = null;
  function paintWarmup(m) {
    var box = $('#s-warmup', moduleView);
    var w = m.warmup;
    if (!box || !w) return;
    var mine = guesses[m.id] || {};
    // Repaint only when something visible changed, so a section being read
    // while you are mid-guess never pulls the buttons out from under you.
    var state = w.items.map(function (it, k) {
      var s = sectionOf(m, it.at);
      return (k in mine ? 'g' + mine[k] : '-') + (s && isRead(s) ? 'r' : '');
    }).join('|');
    if (warmPainted === m.id + state) return;
    warmPainted = m.id + state;
    // Options are shuffled once per visit, not on every repaint.
    if (!warmOrder[m.id]) {
      warmOrder[m.id] = w.items.map(function (it) { return shuffle(it.options.map(function (_, n) { return n; })); });
    }
    var left = w.items.filter(function (_, k) { return !(k in mine); }).length;

    box.innerHTML =
      '<div class="warmup-head">' +
        '<p class="warmup-kicker">Before you start</p>' +
        '<h2 id="warmupTitle">' + esc(w.title || 'Take a guess') + '</h2>' +
        '<p class="warmup-blurb">' + esc(w.blurb || '') + '</p>' +
      '</div>' +
      '<ol class="warmup-list">' +
        w.items.map(function (it, k) {
          var sec = sectionOf(m, it.at);
          var where = '<a href="' + moduleHref(m, it.at) + '">' + esc(partHeading(m, it.at)) + '</a>';
          var body;
          if (!(k in mine)) {
            body = '<ul class="warmup-options">' +
              warmOrder[m.id][k].map(function (n) {
                return '<li><button class="warmup-option" type="button" data-guess="' + k + ':' + n + '">' + esc(it.options[n]) + '</button></li>';
              }).join('') +
            '</ul>';
          } else if (!(sec && isRead(sec))) {
            body = '<p class="warmup-held"><span>Your guess:</span> ' + esc(it.options[mine[k]]) + '</p>' +
                   '<p class="warmup-where">Find out in ' + where + '.</p>';
          } else {
            var had = mine[k] === it.answer;
            body = '<p class="warmup-held"><span>Your guess:</span> ' + esc(it.options[mine[k]]) + '</p>' +
                   '<p class="warmup-reveal' + (had ? ' is-right' : '') + '"><strong>' +
                     (had ? 'You had it. ' : 'The answer: ') + '</strong>' +
                     (had ? '' : esc(it.options[it.answer]) + '. ') + esc(it.why) + '</p>';
          }
          return '<li class="warmup-item"><p class="warmup-q">' + esc(it.q) + '</p>' + body + '</li>';
        }).join('') +
      '</ol>' +
      (left === 0 && w.items.length
        ? ''
        : '<p class="warmup-foot">No score, and nothing here counts toward finishing. Skip it if you like.</p>');

    $$('[data-guess]', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var kn = b.getAttribute('data-guess').split(':');
        var g = guesses[m.id] = guesses[m.id] || {};
        g[kn[0]] = Number(kn[1]);
        saveGuesses();
        sfx.tap();
        paintWarmup(m);
        // Keep the keyboard in the warm-up: on to the next unanswered question.
        var nextBtn = $('[data-guess]', box) || $('.warmup-where a', box);
        if (nextBtn) try { nextBtn.focus({ preventScroll: true }); } catch (e) {}
      });
    });
  }

  /* Ticks in "In this module", the line under the title, and the bar under
     the header, all from moduleProgress(). */
  var wasComplete = false;
  function paintModuleProgress() {
    var m = shownModule && moduleById(shownModule);
    if (!m) return;
    var pr = moduleProgress(m);
    var byId = {};
    m.sections.forEach(function (s) { byId[s.id] = sectionDone(s); });
    pr.checks.forEach(function (c) { byId[c.sec] = c.done; });
    if (!pr.checks.length) byId.practice = true;
    if (m.warmup) paintWarmup(m);
    $$('.art-toc a', moduleView).forEach(function (a) {
      var on = !!byId[a.getAttribute('data-toc')];
      if (on && !a.classList.contains('is-read') && a.hasAttribute('data-painted')) a.classList.add('just-read');
      a.setAttribute('data-painted', '');
      a.classList.toggle('is-read', on);
      var note = $('[data-read-note]', a);
      if (note) note.textContent = on ? ' (done)' : '';
    });
    var status = $('#artStatus');
    if (status) status.textContent = pr.complete ? 'Done' : pr.started ? progressLabel(pr) : '';
    // A new tick can re-wrap a line in the rail; keep the marker on its link.
    moveMarker($('.art-toc a.is-current', moduleView));
    bar.hidden = false;
    bar.style.width = pr.pct + '%';
    if (pr.complete && !wasComplete) toast('Module ' + (MODULES.indexOf(m) + 1) + ' done');
    wasComplete = pr.complete;
  }

  /* A video counts as watched once 90% of it has actually played. `played`
     holds the stretches that really ran, so dragging the slider to the end
     does not count, while skipping a few seconds of the ending still does.
     Media events do not bubble, so this listens in the capture phase on the
     module view, which outlives every player swapped into it. Partial viewing
     is not carried over if the player is rebuilt (leaving the module). */
  var WATCHED_AT = 0.9;
  function playedFraction(v) {
    if (!v.duration || !isFinite(v.duration)) return 0;
    var t = 0;
    for (var i = 0; i < v.played.length; i++) t += v.played.end(i) - v.played.start(i);
    return t / v.duration;
  }
  function onVideoProgress(e) {
    var v = e.target;
    if (!v || v.tagName !== 'VIDEO') return;
    var fig = v.closest('[data-lesson]');
    if (!fig) return;
    var id = fig.getAttribute('data-lesson');
    if (watchedSet.has(id) || playedFraction(v) < WATCHED_AT) return;
    watchedSet.add(id);
    saveWatched();
    track('video_complete', { video: id });
    var tag = $('.art-watched', fig);
    if (tag) tag.hidden = false;
    paintModuleProgress();
  }
  if (moduleView) {
    moduleView.addEventListener('timeupdate', onVideoProgress, true);
    moduleView.addEventListener('ended', onVideoProgress, true);
  }

  /* Called on scroll while a module is open: a section is read once its end
     is on screen, or once you reach the bottom of the page with it in view.
     It also has to have been on screen at some point, so jumping straight to
     Practice from "In this module" does not tick off everything it skipped. */
  var seen = {};
  var scrolledSinceOpen = false;   // nothing counts as read before the first scroll
  function seenOnScreen() {
    var m = shownModule && moduleById(shownModule);
    if (!m) return;
    var vh = window.innerHeight;
    m.sections.forEach(function (s) {
      var el = document.getElementById('s-' + s.id);
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > visibleTop()) seen[s.id] = true;
    });
  }
  // The first line of the page not covered by the sticky header, plus a margin.
  function visibleTop() { return header.getBoundingClientRect().bottom + 40; }
  function checkRead() {
    var m = shownModule && moduleById(shownModule);
    if (!m || gliding) return;
    var vh = window.innerHeight;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    var changed = false;
    m.sections.forEach(function (s) {
      if (isRead(s)) return;
      var el = document.getElementById('s-' + s.id);
      if (!el) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > visibleTop()) seen[s.id] = true;
      if (scrolledSinceOpen && seen[s.id] && (r.bottom < vh * 0.85 || (atBottom && r.top < vh))) { markRead(s); changed = true; }
    });
    if (changed) paintModuleProgress();
  }

  /* "In this module" marks the section being read. */
  var tocSpy = null;
  function watchToc() {
    if (tocSpy) tocSpy.disconnect();
    if (!('IntersectionObserver' in window)) return;
    tocSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.getAttribute('data-sec');
        var current = null;
        $$('.art-toc a', moduleView).forEach(function (a) {
          var on = a.getAttribute('data-toc') === id;
          a.classList.toggle('is-current', on);
          if (on) { a.setAttribute('aria-current', 'true'); current = a; } else a.removeAttribute('aria-current');
        });
        moveMarker(current);
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('.art-section', moduleView).forEach(function (sec) { tocSpy.observe(sec); });
  }

  /* The violet segment on the rail, sized and placed over the current link. */
  function moveMarker(link) {
    var mk = $('.art-toc-marker', moduleView);
    if (!mk) return;
    if (!link) { mk.style.opacity = '0'; return; }
    var nav = mk.parentNode;
    var top = link.getBoundingClientRect().top - nav.getBoundingClientRect().top;
    mk.style.height = link.offsetHeight + 'px';
    mk.style.transform = 'translateY(' + Math.round(top) + 'px)';
    mk.style.opacity = '1';
  }
  window.addEventListener('resize', function () { moveMarker($('.art-toc a.is-current', moduleView)); });

  /* The clip a module card plays on hover: `preview` if content.js sets one,
     otherwise the video whose poster is the card's image, so long as a lesson
     really uses it. */
  function previewFor(m) {
    if (typeof m.preview === 'string') return m.preview;
    if (!m.image || !/\.jpg$/.test(m.image)) return '';
    var mp4 = m.image.replace(/\.jpg$/, '.mp4');
    var used = (S.lessons || []).some(function (l) { return l.video === 'file:' + mp4; });
    return used ? mp4 : '';
  }

  /* Hover a card and its picture becomes the video, muted and looping;
     leave and it pauses and fades back to the still. Nothing loads until
     the first hover. Only where there is a real hover (mouse or trackpad),
     never with reduce-motion or data saver on. */
  var fineHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');
  function wirePreviews(grid) {
    if (!fineHover || !fineHover.matches || calm()) return;
    if (navigator.connection && navigator.connection.saveData) return;
    $$('.module-card', grid).forEach(function (card) {
      var art = $('.module-art[data-preview]', card);
      if (!art) return;
      var vid = null;
      var start = function () {
        if (!vid) {
          vid = document.createElement('video');
          vid.className = 'module-preview';
          vid.muted = true; vid.loop = true; vid.playsInline = true;
          vid.setAttribute('muted', ''); vid.setAttribute('playsinline', '');
          vid.setAttribute('aria-hidden', 'true'); vid.tabIndex = -1;
          vid.preload = 'auto';
          vid.src = art.getAttribute('data-preview');
          vid.addEventListener('playing', function () { if (art.matches(':hover') || card === document.activeElement) art.classList.add('is-playing'); });
          art.insertBefore(vid, $('.module-num', art));
        }
        var p = vid.play();
        if (p && p.catch) p.catch(function () {});   // a blocked play just leaves the still
      };
      var stop = function () {
        art.classList.remove('is-playing');
        if (vid) vid.pause();
      };
      card.addEventListener('pointerenter', start);
      card.addEventListener('pointerleave', stop);
      card.addEventListener('focus', start);
      card.addEventListener('blur', stop);
    });
  }

  function renderModuleCards() {
    var grid = $('#moduleGrid');
    if (!grid) return;
    grid.innerHTML = MODULES.map(function (m, i) {
      var st = moduleStats(m);
      var pr = moduleProgress(m);
      var cta = pr.complete ? 'Review Module ' + (i + 1) : pr.started ? 'Continue' : 'Start Module ' + (i + 1);
      var href = (pr.started && !pr.complete && pr.next) ? moduleHref(m, pr.next) : moduleHref(m);
      return '<a class="module-card' + (pr.complete ? ' is-complete' : '') + '" href="' + href + '">' +
        '<span class="module-art"' + (previewFor(m) ? ' data-preview="' + esc(previewFor(m)) + '"' : '') + '>' +
          (m.image ? '<img src="' + esc(m.image) + '" alt="" loading="lazy">' : '') +
          '<span class="module-num">Module ' + (i + 1) + '</span>' +
        '</span>' +
        '<span class="module-body">' +
          '<h3 class="module-title">' + esc(m.title) + '</h3>' +
          '<p class="module-summary">' + esc(m.summary) + '</p>' +
          '<span class="module-meta">' + st.sections + ' sections · ' + st.videos + ' videos · about ' + st.minutes + ' min read</span>' +
          '<span class="module-progress">' +
            '<span class="meter" aria-hidden="true"><b style="width:' + pr.pct + '%"></b></span>' +
            '<span class="module-progress-label">' + esc(progressLabel(pr)) + '</span>' +
          '</span>' +
          '<span class="btn btn-primary module-cta">' + esc(cta) + '</span>' +
        '</span>' +
      '</a>';
    }).join('');
    observeReveals(grid);
    wirePreviews(grid);
    paintOverall();
  }

  /* The line under the headline. The bar and the words measure the same
     thing: every section read and every module practice finished, out of all
     of them across the course. It always shows, at 0% before anything is
     done; only the reset link waits until there is something to reset. */
  function paintOverall() {
    var host = $('#overall');
    if (!host) return;
    var prs = MODULES.map(moduleProgress);
    var units = 0, of = 0;
    prs.forEach(function (p) { units += p.units; of += p.of; });
    var pct = of ? Math.round((units / of) * 100) : 0;
    var doneN = prs.filter(function (p) { return p.complete; }).length;
    host.hidden = false;
    $('#overallFill').style.width = pct + '%';
    $('#overallText').textContent =
      units === 0 ? 'Not started yet'
      : doneN === prs.length ? 'All ' + prs.length + ' modules done'
      : pct + '% of the course done · ' + doneN + ' of ' + prs.length + ' modules finished';
    var reset = $('#resetProgress');
    if (reset) reset.hidden = units === 0;
    /* The certificate button lives in this row and appears at 100%. */
    if (typeof certPaintCta === 'function') certPaintCta();
  }
  var resetBtn = $('#resetProgress');
  if (resetBtn) resetBtn.addEventListener('click', function () {
    done.clear(); saveProgress();
    readSet.clear(); saveRead();
    watchedSet.clear(); saveWatched();
    quizState = {};
    try { localStorage.removeItem(QKEY); } catch (e) {}
    guesses = {};
    try { localStorage.removeItem(GKEY); } catch (e) {}
    renderModuleCards();
    // The link hides itself once there is nothing left to reset; keep focus nearby.
    $('#overallText').focus();
    toast('Progress cleared');
  });

  function renderWhy() {
    var w = S.why, sec = $('#why');
    if (!sec || !w) return;
    $('#whyHeading').textContent = w.title || '';
    $('#whyBody').innerHTML = (w.body || []).map(blockHtml).join('');
    sec.hidden = false;
  }

  /* ---------- motion ----------
     Three pieces, all skipped under prefers-reduced-motion:
       - moving between Home, a module and Reference cross-fades, with the
         new page settling up a few pixels (View Transitions, where the
         browser has them; elsewhere the swap is instant, as before);
       - "In this module" links glide to their section instead of jumping;
       - the rail's marker slides to the section being read, and a tick
         draws in when a section is finished. */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  function calm() { return !!(reduceMotion && reduceMotion.matches); }

  // Which page an address shows; a change of page is what gets a transition.
  var shownView = null;
  function viewKey(h) {
    var mm = /^#\/module\/([^\/]+)/.exec(h);
    if (mm && moduleById(mm[1])) return 'module:' + mm[1];
    if (/^#lesson-/.test(h)) return 'lesson';
    if (/^#\/reference/.test(h) || /^#(glossary|prompts|faq|resources)$/.test(h)) return 'reference';
    return 'home';
  }
  function route() {
    var key = viewKey(location.hash || '');
    var changing = shownView !== null && key !== shownView && key !== 'lesson';
    if (key !== 'lesson' && key !== shownView) trackView(key);
    if (key !== 'lesson') shownView = key;
    if (changing && document.startViewTransition && !calm()) {
      document.startViewTransition(routeNow);
    } else {
      routeNow();
    }
  }

  // One page view per page, not per section jump inside it (see ANALYTICS).
  function trackView(key) {
    var m = key.indexOf('module:') === 0 ? moduleById(key.slice(7)) : null;
    var path = m ? '/module/' + m.id : key === 'reference' ? '/reference' : '/';
    umamiPath = path + location.search;
    track('page_view', {
      page_location: location.origin + location.pathname.replace(/\/[^\/]*$/, '') + path + location.search,
      page_title: m ? m.title : key === 'reference' ? 'Reference' : 'Home',
      audience: (audience && audience.id) || ''
    });
  }

  /* While the page scrolls itself to a section, sections it passes are not
     being read; checkRead() ignores them until the glide has stopped. */
  var gliding = false, glideTimer = null;
  function glideTo(el) {
    gliding = true;
    seen = {};   // a jump is not reading: forget what was glimpsed before it
    var stop = function () {
      gliding = false;
      window.removeEventListener('scroll', quiet);
      clearTimeout(glideTimer);
      // Whatever is on screen where the glide ends has been seen.
      seenOnScreen();
    };
    // The glide is over once the page has stopped moving for a moment. This
    // works in every browser and cannot end a long glide early.
    var quiet = function () { clearTimeout(glideTimer); glideTimer = setTimeout(stop, 160); };
    window.addEventListener('scroll', quiet, { passive: true });
    quiet();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function routeNow() {
    var h = location.hash || '';

    // Old lesson links keep working: they land on the section with that video.
    var lm = /^#lesson-(.+)$/.exec(h);
    if (lm) {
      var hit = sectionForLesson(lm[1]);
      if (hit) { location.replace(moduleHref(hit.m, hit.sec)); return; }
    }

    var mm = /^#\/module\/([^\/]+)(?:\/([^\/]+))?$/.exec(h);
    var m = mm && moduleById(mm[1]);
    if (m) {
      var fresh = shownModule !== m.id;
      setTimeout(checkRead, 0);
      if (fresh) renderModule(m);
      homeView.hidden = true;
      if (referenceView) referenceView.hidden = true;
      header.classList.remove('is-glass');
      moduleView.hidden = false;
      document.title = m.title + ' — ' + ((S.event || {}).name || '');
      setNav('modules');
      var target = mm[2] ? document.getElementById('s-' + mm[2]) : null;
      // Arriving on a module jumps; moving within it glides (see glideTo).
      if (target && !fresh && !calm()) glideTo(target);
      else if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
      else if (fresh) window.scrollTo({ top: 0, behavior: 'instant' });
      if (fresh) $('#moduleTitle').focus({ preventScroll: true });
      // Web fonts can arrive after the jump and push the target down; land again.
      if (fresh && target && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          if (shownModule === m.id) target.scrollIntoView({ behavior: 'instant', block: 'start' });
        });
      }
      return;
    }

    // The reference sections used to live on the home page as #glossary,
    // #prompts, #faq and #resources; those links now open the Reference page.
    var legacy = /^#(glossary|prompts|faq|resources)$/.exec(h);
    if (legacy && referenceView) { location.replace('#/reference/' + legacy[1]); return; }

    var wasModule = !moduleView.hidden;
    if (wasModule) {
      moduleView.hidden = true;
      moduleView.innerHTML = '';      // stops any video that was playing
      shownModule = null;
      if (tocSpy) tocSpy.disconnect();
    }
    bar.hidden = true;
    header.classList.remove('is-glass');

    var rm = /^#\/reference(?:\/([^\/]+))?$/.exec(h);
    if (rm && referenceView) {
      var arriving = referenceView.hidden;
      homeView.hidden = true;
      referenceView.hidden = false;
      document.title = 'Reference — ' + ((S.event || {}).name || '');
      setNav(rm[1] || null);
      var head = refHead(rm[1]);
      if (head) head.scrollIntoView({ behavior: (arriving || calm()) ? 'instant' : 'smooth', block: 'start' });
      else if (arriving) window.scrollTo({ top: 0, behavior: 'instant' });
      if (arriving) $('#referenceTitle').focus({ preventScroll: true });
      // Web fonts can arrive after the jump and shift the heading; land again.
      if (arriving && head && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          if (!referenceView.hidden) head.scrollIntoView({ behavior: 'instant', block: 'start' });
        });
      }
      return;
    }

    var arrivingHome = homeView.hidden;
    if (referenceView) referenceView.hidden = true;
    homeView.hidden = false;
    header.classList.add('is-glass');
    document.title = homeTitle;
    if (wasModule) renderModuleCards();
    setNav(null);
    var el = (h.length > 1 && h.charAt(1) !== '/') ? document.getElementById(h.slice(1)) : null;
    if (el) el.scrollIntoView({ behavior: (arrivingHome || calm()) ? 'instant' : 'smooth', block: 'start' });
    else if (arrivingHome) window.scrollTo({ top: 0, behavior: 'instant' });
  }
  window.addEventListener('hashchange', route);

  /* A Reference section's heading block, which is what a jump lands on: the
     heading sits just under the header instead of the section's top padding
     (and the end of the section above) showing first. */
  function refHead(id) {
    var sec = id ? document.getElementById(id) : null;
    return sec ? ($('.section-head', sec) || sec) : null;
  }

  /* Opens a Reference section, even when the address already points at it
     (setting the same hash again fires no hashchange). */
  function openReference(id) {
    var target = '#/reference/' + id;
    if (location.hash === target) {
      var el = refHead(id);
      if (el) el.scrollIntoView({ behavior: calm() ? 'instant' : 'smooth', block: 'start' });
    } else {
      location.hash = target;
    }
  }

  // Marks the header link for the current page. `key` is a data-nav value.
  function setNav(key) {
    $$('.site-nav a').forEach(function (x) {
      var on = !!key && x.getAttribute('data-nav') === key;
      x.classList.toggle('active', on);
      if (on) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current');
    });
  }

  /* =====================================================
     GLOSSARY
     ===================================================== */
  function renderGlossary(q) {
    q = (q || '').trim().toLowerCase();
    // Alphabetical on the page, whatever order content.js keeps them in.
    var items = (S.glossary || []).filter(function (g) {
      return !q || (g.term + ' ' + g.def).toLowerCase().indexOf(q) > -1;
    }).sort(function (a, b) { return a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }); });
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
    MODULES.forEach(function (m, mi) {
      var sub = 'Module ' + (mi + 1);
      index.push({ kind: 'Module', title: m.title, sub: sub, body: m.summary, open: function () { closePalette(); location.hash = moduleHref(m); } });
      moduleParts(m).forEach(function (p) {
        var l = lessonById(p.lesson);
        index.push({ kind: 'Section', title: p.heading, sub: sub, body: partText(p) + (l ? ' ' + l.title + ' ' + l.summary : ''), open: function () { closePalette(); location.hash = moduleHref(m, p.id); } });
      });
    });
    (S.practice || []).forEach(function (p) {
      // A demo opens at its section; question activities live in the module's practice.
      var hit = null;
      if (p.group !== 'quiz' && p.section) {
        MODULES.forEach(function (mod) {
          if (!hit && moduleParts(mod).some(function (x) { return x.id === p.section; })) hit = { m: mod, sec: p.section };
        });
      }
      if (!hit) {
        var mm = moduleForTrack(p.module) || MODULES[MODULES.length - 1];
        // The check that carries it, which may be one midway through.
        var holder = mm && checksFor(mm).filter(function (c) { return c.acts.indexOf(p) >= 0; })[0];
        if (mm) hit = { m: mm, sec: holder ? holder.sec : 'practice' };
      }
      if (!hit) return;
      index.push({ kind: 'Practice', title: p.title, sub: p.tag || '', body: p.blurb || '', open: function () { closePalette(); location.hash = moduleHref(hit.m, hit.sec); } });
    });
    (S.prompts || []).forEach(function (p) {
      index.push({ kind: 'Prompt', title: p.title, sub: '', body: p.use + ' ' + p.text, open: function () { closePalette(); openReference('prompts'); } });
    });
    (S.glossary || []).forEach(function (g) {
      index.push({ kind: 'Term', title: g.term, sub: '', body: g.def, open: function () { closePalette(); $('#glossarySearch').value = g.term; renderGlossary(g.term); openReference('glossary'); } });
    });
    (S.faq || []).forEach(function (f) {
      index.push({ kind: 'Question', title: f.q, sub: '', body: f.a, open: function () { closePalette(); openReference('faq'); } });
    });
    // Skipped while the run of show is hidden: a search hit that scrolls to
    // a section which is not rendered is worse than no hit at all.
    if (!S.agendaHidden) {
      (audienceView().agenda || []).forEach(function (a) {
        index.push({ kind: 'Agenda', title: a.title, sub: a.time, body: a.detail, open: function () { closePalette(); goTo('#agenda'); } });
      });
    }
  }

  var backdrop = $('#paletteBackdrop');
  var pInput = $('#paletteInput');
  var pResults = $('#paletteResults');
  var pActive = 0;
  var pCurrent = [];

  function goTo(hash) {
    if (hash.charAt(1) === '/' || homeView.hidden) { location.hash = hash; return; }
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
      : index.filter(function (it) { return it.kind === 'Module' || it.kind === 'Section'; }).slice(0, 8);
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
    if (shownModule) { scrolledSinceOpen = true; checkRead(); }
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
    // On the Reference page, the header link follows the section in view.
    var navLinks = {};
    $$('.site-nav a[data-nav]').forEach(function (a) { navLinks[a.getAttribute('data-nav')] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || !navLinks[en.target.id]) return;
        setNav(en.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(navLinks).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- reveal on scroll (observer set up near the top) ---------- */

  /* Marks everything under `root` that should reveal, once per element: a
     block that has already faded in never hides again. What is on screen now
     rises in on the next frame; the rest waits for the observer. */
  function observeReveals(root) {
    var fresh = $$(REVEAL_SEL, root || document).filter(function (el) {
      return !el.hasAttribute('data-rv');
    });
    if (!fresh.length) return;
    fresh.forEach(function (el) { el.setAttribute('data-rv', ''); el.classList.add('reveal'); });
    if (!revealObserver) { fresh.forEach(function (el) { el.classList.remove('reveal'); }); return; }

    var vh = window.innerHeight, now = [];
    fresh.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var visible = el.offsetParent !== null && r.top < vh && r.bottom > 0;
      if (visible) now.push(el); else revealObserver.observe(el);
    });
    // Two frames, so the hidden starting state is painted before it moves.
    if (now.length) requestAnimationFrame(function () { requestAnimationFrame(function () { showReveals(now); }); });
  }

  // Backstop: if the observer is ever throttled or fails to fire, scrolling
  // still reveals anything that has come into view. Content never stays blank.
  function revealInView() {
    var late = $$('.reveal:not(.in)').filter(function (el) {
      var r = el.getBoundingClientRect();
      return el.offsetParent !== null && r.top < window.innerHeight && r.bottom > 0;
    });
    if (late.length) {
      late.forEach(function (el) { if (revealObserver) revealObserver.unobserve(el); });
      showReveals(late);
    }
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

    renderHero();
    renderPlacement();
    renderAgenda();
    buildIndex();
    paintAudienceBar();

    try { localStorage.setItem(AKEY, audience.id); } catch (e) {}
    try { history.replaceState(null, '', audienceUrl(audience.id) + location.hash); } catch (e) {}
    if (!initial) {
      toast('Now showing the ' + audience.label.toLowerCase() + ' version');
      track('audience_switch', { audience: audience.id });
    }
  }

  (function initAudience() {
    var bar = $('#audienceBar');
    if (!AUDIENCES.length) {            // no audiences defined: plain page, no switcher
      renderHero(); renderPlacement(); renderAgenda(); buildIndex();
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


  /* =====================================================
     FEEDBACK WIDGET
     The only code on this page that talks to a server. Everything
     else lives in localStorage and never leaves the browser, and the
     copy on the page says so — so this is kept visibly separate: the
     visitor presses a button, sees exactly what will be sent, and
     nothing is collected in the background.

     Transport is a no-cors POST with a text/plain body, the one
     combination Apps Script accepts without a preflight. The cost is
     that we cannot read the response, so a send that reaches the
     network counts as delivered; a send that does not is queued in
     localStorage and retried on the next page load. With no endpoint
     configured the whole thing degrades to a prefilled mailto, so a
     note is never silently dropped.
     ===================================================== */
  var FB = S.feedback || null;

  function fbDevice() {
    var ua = navigator.userAgent || '';
    var browser = /Edg\//.test(ua) ? 'Edge'
                : /OPR\//.test(ua) ? 'Opera'
                : /Chrome\//.test(ua) ? 'Chrome'
                : /Firefox\//.test(ua) ? 'Firefox'
                : /Safari\//.test(ua) ? 'Safari' : 'another browser';
    var os = /Windows/.test(ua) ? 'Windows'
           : /iPhone|iPad|iPod/.test(ua) ? 'iOS'
           : /Mac OS X/.test(ua) ? 'macOS'
           : /Android/.test(ua) ? 'Android'
           : /Linux/.test(ua) ? 'Linux' : 'an unknown system';
    return browser + ' on ' + os + ' · ' + window.innerWidth + '×' + window.innerHeight;
  }

  /* Where the visitor was when they hit the button. This is the field that
     makes the Friday digest actionable: "confusing" is noise, "confusing on
     Embeddings" is a task. */
  function fbWhere() {
    var mod = shownModule && moduleById(shownModule);
    var best = null, bestTop = Infinity;
    $$('section[id]').forEach(function (sec) {
      if (!sec.offsetParent) return;           // inside the view that is hidden
      var top = sec.getBoundingClientRect().top;
      if (top <= 120 && Math.abs(top) < bestTop) { bestTop = Math.abs(top); best = sec; }
    });
    var where = '';
    if (best) {
      var h = best.querySelector('h2, h1');
      where = 'Section: ' + ((h && h.textContent.trim()) || best.id);
    }
    if (mod) return 'Module: ' + mod.title + (where ? ' · ' + where : '');
    return where || 'Top of the page';
  }

  function fbPayload() {
    var checked = $('#fbKinds input:checked');
    return {
      ts: new Date().toISOString(),
      kind: checked ? checked.value : ((FB.kinds[0] && FB.kinds[0].id) || 'note'),
      message: ($('#fbMessage').value || '').trim(),
      name: ($('#fbName').value || '').trim(),
      where: fbWhere(),
      audience: (typeof audience !== 'undefined' && audience && audience.id) || '',
      page: location.pathname + location.search + location.hash,
      device: fbDevice()
    };
  }

  /* ---- queue: notes that could not be sent, retried on the next load ---- */
  var FBQ = 'aihub:feedbackq';
  function fbQueue() {
    try { return JSON.parse(localStorage.getItem(FBQ) || '[]'); } catch (e) { return []; }
  }
  function fbSetQueue(q) {
    try { localStorage.setItem(FBQ, JSON.stringify(q.slice(-25))); } catch (e) {}
  }
  function fbEnqueue(p) { var q = fbQueue(); q.push(p); fbSetQueue(q); }

  function fbSend(payload, done) {
    if (!FB.endpoint) { done(false, 'no-endpoint'); return; }
    if (!window.fetch) { done(false, 'no-fetch'); return; }
    try {
      fetch(FB.endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).then(function () { done(true); }, function () { done(false, 'network'); });
    } catch (e) { done(false, 'threw'); }
  }

  function fbFlushQueue() {
    if (!FB || !FB.endpoint) return;
    var q = fbQueue();
    if (!q.length) return;
    fbSetQueue([]);                       // clear first; a failure re-queues below
    q.forEach(function (p) {
      fbSend(p, function (sent) { if (!sent) fbEnqueue(p); });
    });
  }

  function fbMailto(p) {
    var body = [
      p.message, '',
      '---',
      'Kind:     ' + p.kind,
      'Where:    ' + p.where,
      'Audience: ' + p.audience,
      'Page:     ' + p.page,
      'Device:   ' + p.device,
      'Sent:     ' + p.ts,
      'From:     ' + (p.name || '(anonymous)')
    ].join('\n');
    // Each address encoded on its own, so a comma-separated list stays a list.
    var to = String(FB.mailto || '').split(',').map(function (a) { return encodeURIComponent(a.trim()); })
               .filter(Boolean).join(',');
    return 'mailto:' + to +
           '?subject=' + encodeURIComponent(((S.event || {}).shortName || 'Artificial Intelligence 101') + ' feedback, ' + p.kind) +
           '&body=' + encodeURIComponent(body.slice(0, 1800));
  }

  function fbStatus(msg, cls) {
    var el = $('#fbStatus');
    el.textContent = msg || '';
    el.className = 'fb-status' + (cls ? ' is-' + cls : '');
  }

  (function initFeedback() {
    var fab = $('#fbOpen'), dlg = $('#fbDialog');
    if (!FB || !fab || !dlg) return;

    $('#fbOpenLabel').textContent = FB.button;
    fab.setAttribute('aria-label', FB.title);
    $('#fbTitle').textContent = FB.title;
    $('#fbBlurb').textContent = FB.blurb;
    $('#fbNameLabel').textContent = FB.nameLabel;
    $('#fbName').placeholder = FB.namePlaceholder;
    $('#fbMessage').placeholder = FB.placeholder;
    $('#fbSubmit').textContent = FB.submit;

    $('#fbKinds').innerHTML = (FB.kinds || []).map(function (k, i) {
      return '<label class="fb-kind">' +
               '<input type="radio" name="fbKind" value="' + esc(k.id) + '"' + (i === 0 ? ' checked' : '') + '>' +
               '<span title="' + esc(k.hint || '') + '">' + esc(k.label) + '</span>' +
             '</label>';
    }).join('');

    fab.hidden = false;

    fab.addEventListener('click', function () {
      fbStatus('');
      if (!dlg.open) { dlg.showModal(); track('feedback_open'); }
      setTimeout(function () { $('#fbMessage').focus(); }, 30);
    });
    $('#fbClose').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

    $('#fbMessage').addEventListener('input', function () {
      $('#fbCount').textContent = String(this.value.length);
      this.setAttribute('aria-invalid', 'false');
    });

    // Cmd/Ctrl+Enter sends, the way every other comment box works
    $('#fbMessage').addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if ($('#fbForm').requestSubmit) $('#fbForm').requestSubmit();
      }
    });

    $('#fbForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var p = fbPayload();
      if (!p.message) {
        $('#fbMessage').setAttribute('aria-invalid', 'true');
        $('#fbMessage').focus();
        fbStatus('Write a note first.', 'error');
        return;
      }
      var btn = $('#fbSubmit');
      btn.disabled = true;
      fbStatus('Sending…');
      track('feedback_send', { kind: p.kind });   // the kind, never the note

      fbSend(p, function (sent, why) {
        btn.disabled = false;
        if (sent) {
          dlg.close();
          toast(FB.thanks);
          $('#fbMessage').value = '';
          $('#fbName').value = '';
          $('#fbCount').textContent = '0';
          return;
        }
        // Nothing is thrown away: queue it, and offer mail as the way out.
        fbEnqueue(p);
        if (why === 'no-endpoint' || why === 'no-fetch') {
          window.location.href = fbMailto(p);
          fbStatus('Opening your mail app, press send there.', 'ok');
        } else {
          fbStatus('Could not reach the server. ' + FB.queued, 'ok');
        }
      });
    });

    fbFlushQueue();
  })();


  /* ==============================================

     CERTIFICATE
     The second and last thing on this page that talks to a server,
     and the only one that asks who you are. It stays out of the way
     until every lesson is ticked off, and nothing on the page is
     gated behind it.

     The sign-in is a one-time emailed link, so no password is ever
     created or stored. The round trip avoids CORS entirely: the
     request out is a no-cors POST, exactly like the feedback widget,
     and the answer comes back as an ordinary browser navigation to
     #cert=<payload>, because the Apps Script redirects here after it
     has checked the token. Nothing has to read a cross-origin
     response, which is the part that is usually fragile.

     The payload is display data. The authoritative record is the row
     in Purple Maiʻa's Sheet, which is what the printed code refers to,
     so a forged local certificate fools nobody but its owner.
     ===================================================== */
  var CERT = S.certificate || null;
  var CKEY = 'aihub:cert';

  function certStored() {
    try { return JSON.parse(localStorage.getItem(CKEY) || 'null'); }
    catch (e) { return null; }
  }
  function certStore(c) {
    try { localStorage.setItem(CKEY, JSON.stringify(c)); } catch (e) {}
  }
  function certForget() {
    try { localStorage.removeItem(CKEY); } catch (e) {}
  }

  // base64url -> object. Returns null on anything malformed rather than throwing,
  // because this runs on whatever a stranger pasted into the address bar.
  function certDecode(s) {
    try {
      var b = String(s).replace(/-/g, '+').replace(/_/g, '/');
      while (b.length % 4) b += '=';
      var json = decodeURIComponent(atob(b).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      var o = JSON.parse(json);
      if (!o || typeof o.name !== 'string' || !o.name) return null;
      return o;
    } catch (e) { return null; }
  }

  /* What counts as finished is whatever the progress line under the headline
     counts: every section read, every video watched and every module practice done. Keyed off
     moduleProgress() rather than the lesson list, so the two can never drift
     apart and tell a learner two different things. */
  function certUnits() {
    var units = 0, of = 0;
    MODULES.forEach(function (m) {
      var pr = moduleProgress(m);
      units += pr.units; of += pr.of;
    });
    return { units: units, of: of };
  }

  function certEarned() {
    if (!CERT || !CERT.endpoint) return false;
    var u = certUnits();
    if (!u.of) return false;
    var need = (CERT.requireAll === true || CERT.requireAll == null)
      ? u.of : Math.min(Number(CERT.requireAll) || u.of, u.of);
    return u.units >= need;
  }

  function certPaintCta() {
    var cta = $('#certCta');
    if (!cta || !CERT) return;
    // No endpoint means initCertificate never wired the button, so it must
    // not show at all, even to someone holding a certificate from the
    // community edition on the same address.
    if (!CERT.endpoint) { cta.hidden = true; return; }
    var have = certStored();
    if (have) {
      cta.hidden = false;
      cta.textContent = 'View your certificate';
      return;
    }
    cta.hidden = !certEarned();
    cta.textContent = CERT.cta || 'Get your certificate';
  }

  function certShow(c) {
    var dlg = $('#certViewDialog');
    if (!dlg) return;
    $('#certViewKicker').textContent = (CERT.title || 'Certificate of completion');
    $('#certViewName').textContent = c.name;
    $('#certViewCourse').textContent = c.course || CERT.courseName || '';
    $('#certViewDate').textContent = c.date || '';
    $('#certSigDate').textContent = c.date || '';
    $('#certSigIssuer').textContent = CERT.issuer || 'Purple Maiʻa';
    $('.cert-meta-dot').hidden = !c.date;
    // n and total count sections read, videos watched and each module's practice, the same
    // measure as the progress line, so they are not lessons. A finished run
    // says so in words; a partial one (requireAll set to a number) says how far.
    var all = c.n != null && c.total != null && Number(c.n) >= Number(c.total);
    $('#certViewScore').textContent = all
      ? 'All ' + MODULES.length + ' modules, videos and practice included'
      : (c.n != null && c.total != null ? c.n + ' of ' + c.total + ' sections, videos and practices' : '');
    $('#certViewCode').textContent = c.code ? ('Verification code  ' + c.code) : '';
    $('#certViewVerify').textContent = CERT.verifyNote || '';
    $('#certPrint').textContent = CERT.print || 'Print or save as PDF';
    $('#certForget').textContent = CERT.signedOut || 'Start over';
    if (!dlg.open) dlg.showModal();
  }

  function certStatus(msg, cls) {
    var el = $('#certStatus');
    if (!el) return;
    el.textContent = msg || '';
    el.className = 'fb-status' + (cls ? ' is-' + cls : '');
  }

  (function initCertificate() {
    var cta = $('#certCta'), dlg = $('#certDialog'), view = $('#certViewDialog');
    if (!CERT || !cta || !dlg || !view) return;

    // With no endpoint configured the whole feature stays invisible, so the
    // page behaves exactly as it did before any of this existed.
    if (!CERT.endpoint) { cta.hidden = true; return; }

    $('#certTitle').textContent = CERT.title || '';
    $('#certBlurb').textContent = CERT.blurb || '';
    $('#certNameLabel').textContent = CERT.nameLabel || '';
    $('#certEmailLabel').textContent = CERT.emailLabel || '';
    $('#certName').placeholder = CERT.namePlaceholder || '';
    $('#certEmail').placeholder = CERT.emailPlaceholder || '';
    $('#certSubmit').textContent = CERT.submit || '';
    $('#certDisclosureLabel').textContent = CERT.disclosure || '';
    $('#certDisclosureBody').textContent = CERT.disclosureBody || '';

    /* Coming back from the emailed link. The hash is cleaned off immediately
       so the certificate is not re-issued on every refresh and does not sit
       in the address bar waiting to be pasted somewhere. */
    var m = /[#&]cert=([A-Za-z0-9_\-]+)/.exec(location.hash || '');
    if (m) {
      var payload = certDecode(m[1]);
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
      if (payload) {
        certStore(payload);
        certPaintCta();
        setTimeout(function () { certShow(payload); }, 120);
      } else {
        toast('That certificate link did not look right. Try asking for a new one.');
      }
    }

    cta.addEventListener('click', function () {
      var have = certStored();
      if (have) { certShow(have); return; }
      certStatus('');
      var n = lessons.filter(function (l) { return done.has(l.id); }).length;
      $('#certBlurb').textContent = (CERT.blurb || '') + ' (' + n + ' of ' + lessons.length + ' done.)';
      if (!dlg.open) dlg.showModal();
      setTimeout(function () { $('#certName').focus(); }, 30);
    });

    $('#certClose').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    $('#certViewClose').addEventListener('click', function () { view.close(); });

    $('#certPrint').addEventListener('click', function () { window.print(); });
    $('#certForget').addEventListener('click', function () {
      certForget();
      view.close();
      certPaintCta();
      toast('Certificate cleared from this browser. The record stays with Purple Maiʻa.');
    });

    $('#certForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = ($('#certName').value || '').trim();
      var email = ($('#certEmail').value || '').trim();
      if (!name) { $('#certName').focus(); certStatus(CERT.needName, 'error'); return; }
      if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) {
        $('#certEmail').focus(); certStatus(CERT.needEmail, 'error'); return;
      }

      var btn = $('#certSubmit');
      btn.disabled = true;
      certStatus('Sending…');

      var body = {
        action: 'request',
        name: name,
        email: email,
        n: certUnits().units,
        total: certUnits().of,
        course: CERT.courseName || '',
        origin: location.origin + location.pathname
      };

      if (!window.fetch) { btn.disabled = false; certStatus(CERT.sendFailed, 'error'); return; }
      fetch(CERT.endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body)
      }).then(function () {
        btn.disabled = false;
        certStatus(CERT.sent, 'ok');
        track('certificate_request');   // no name, no email
        $('#certEmail').value = '';
      }, function () {
        btn.disabled = false;
        certStatus(CERT.sendFailed, 'error');
      });
    });

    certPaintCta();
  })();

  /* ---------- first paint of the modules, then whichever view the address asks for ---------- */
  renderModuleCards();
  renderWhy();
  homeTitle = document.title;
  route();
})();
