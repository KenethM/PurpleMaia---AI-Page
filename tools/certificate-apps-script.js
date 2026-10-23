/* =============================================================
   certificate-apps-script.js

   Server side of the certificate. Like the feedback collector, this
   does NOT run on the website: it lives in Google Apps Script,
   attached to a Sheet in Purple Maiʻa's own Drive, and is kept in the
   repo so the whole system is readable in one place.

   It does two things:
     doPost({action:'request'})  emails a one-time sign-in link
     doGet(?t=TOKEN)             checks the link, records the
                                 completion, sends the learner back
                                 to the site with their certificate

   WHY A SEPARATE PROJECT FROM THE FEEDBACK SCRIPT
   An Apps Script project can only have one doPost, so this cannot be
   pasted into the feedback project without merging the two handlers.
   Two small deployments are easier to reason about than one that does
   everything, and it means revoking one does not take out the other.

   ---------------------------------------------------------------
   SETUP, about five minutes, once
   ---------------------------------------------------------------
   1.  sheets.new while signed in as keneth@purplemaia.org.
       Name it "LLM/NLP 101 certificates".

   2.  Extensions -> Apps Script. Paste this whole file in. Save.

   3.  Edit ALLOWED_ORIGINS below so it lists exactly the addresses
       the site is served from. Read the note above it first: this is
       the one setting that matters for security.

   4.  Run -> setup -> Run. Approve the permissions. This writes the
       headers and the signing secret. Running it twice is safe and
       will NOT rotate the secret.

   5.  Deploy -> New deployment -> Web app.
         Execute as:     Me
         Who has access: ANYONE
       Deploy, approve, copy the Web app URL (/exec).

   6.  Paste that URL into content.js:
         certificate: { endpoint: "https://script.google.com/.../exec", ... }

   7.  Finish the lessons on the live site, ask for a certificate, and
       confirm you get the mail and land back on the page. Unlike the
       feedback widget this one DOES tell you when it failed, because
       the mail either arrives or it does not.

   ---------------------------------------------------------------
   WHAT IS STORED
       requests : email, name, token, lesson counts, expiry, used-at
       issued   : the completion record and its verification code
   Nothing is written while somebody works through the lessons. The
   first write happens when they ask for a certificate.

   KILL SWITCH: clear certificate.endpoint in content.js and deploy.
   The button disappears and the page stops asking for anything.
   ============================================================= */

/* The redirect target is taken from the request, so it MUST be checked
   against this list. Without that check anybody could call this script
   with their own origin and use Purple Maiʻa's domain as a redirector
   to send people to a site of their choosing, which is a phishing tool
   with your name on it. Compare in full, never with indexOf. */
var ALLOWED_ORIGINS = [
  'https://ai-page.sandbox.purplemaia.org/',
  'https://kenethm.github.io/PurpleMaia---AI-Page/',
  'http://127.0.0.1:8777/'          // local testing; drop before launch
];

var SHEET_REQ   = 'requests';
var SHEET_ISS   = 'issued';
var TOKEN_TTL   = 15 * 60 * 1000;   // the emailed link's life, 15 minutes
var MAX_PER_HR  = 40;
var FROM_NAME   = 'Purple Maiʻa';

var REQ_HEADERS = ['asked', 'email', 'name', 'token', 'n', 'total', 'course', 'origin', 'expires', 'used'];
var ISS_HEADERS = ['issued', 'code', 'email', 'name', 'n', 'total', 'course'];

/* ---------- 1. the learner asks for a certificate ---------- */

function doPost(e) {
  try {
    var p = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (p.action !== 'request') return _json({ status: 'ignored' });

    var email = String(p.email || '').trim();
    var name  = String(p.name  || '').trim();
    if (!name) return _json({ status: 'no-name' });
    if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) return _json({ status: 'bad-email' });

    var origin = _allowedOrigin(p.origin);
    if (!origin) return _json({ status: 'bad-origin' });

    var sheet = _sheet(SHEET_REQ, REQ_HEADERS);
    if (_recent(sheet) > MAX_PER_HR) return _json({ status: 'throttled' });

    var token = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().slice(0, 8);
    var expires = new Date(new Date().getTime() + TOKEN_TTL);

    sheet.appendRow([
      new Date(), _cell(email, 160), _cell(name, 80), token,
      Number(p.n) || 0, Number(p.total) || 0, _cell(p.course, 80), origin, expires, ''
    ]);

    var link = ScriptApp.getService().getUrl() + '?t=' + encodeURIComponent(token);
    MailApp.sendEmail({
      to: email,
      name: FROM_NAME,
      subject: 'Your ' + (p.course || 'Purple Maiʻa') + ' certificate',
      htmlBody:
        '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.65">' +
        '<p>Aloha ' + _esc(name) + ',</p>' +
        '<p>Here is the link to your certificate. It works once, and it expires in 15 minutes.</p>' +
        '<p><a href="' + link + '" style="display:inline-block;padding:11px 20px;background:#6b2f96;' +
        'color:#fff;border-radius:999px;text-decoration:none;font-weight:600">Open my certificate</a></p>' +
        '<p style="color:#776c82;font-size:13px">If you did not ask for this, ignore it. ' +
        'Nothing has been recorded against your name and the link will expire on its own.</p>' +
        '</div>',
      body: 'Aloha ' + name + ',\n\nYour certificate link (works once, expires in 15 minutes):\n' +
            link + '\n\nIf you did not ask for this, ignore it.\n'
    });

    return _json({ status: 'sent' });
  } catch (err) {
    return _json({ status: 'error', detail: String(err) });
  }
}

/* ---------- 2. the learner clicks the emailed link ---------- */

function doGet(e) {
  var token = (e && e.parameter && e.parameter.t) || '';
  if (!token) return _page('This link is incomplete. Ask for a new certificate from the site.');

  var sheet = _sheet(SHEET_REQ, REQ_HEADERS);
  var rows  = sheet.getDataRange().getValues();
  var head  = rows[0];
  var cT = head.indexOf('token'), cU = head.indexOf('used'), cX = head.indexOf('expires');

  for (var r = 1; r < rows.length; r++) {
    if (String(rows[r][cT]) !== token) continue;

    if (rows[r][cU]) return _page('That link has already been used. Ask the site for a new one.');
    var exp = rows[r][cX];
    if (exp instanceof Date && exp.getTime() < new Date().getTime()) {
      return _page('That link has expired. Ask the site for a new one.');
    }

    var get = function (k) { return rows[r][head.indexOf(k)]; };
    var origin = _allowedOrigin(get('origin'));
    if (!origin) return _page('This certificate was requested from an address we do not recognise.');

    sheet.getRange(r + 1, cU + 1).setValue(new Date());    // burn the token

    var code = _code();
    var when = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'd MMMM yyyy');
    _sheet(SHEET_ISS, ISS_HEADERS).appendRow([
      new Date(), code, _cell(get('email'), 160), _cell(get('name'), 80),
      get('n'), get('total'), _cell(get('course'), 80)
    ]);

    var payload = _b64url(JSON.stringify({
      name: String(get('name')), course: String(get('course')),
      n: get('n'), total: get('total'), code: code, date: when
    }));
    return _redirect(origin + '#cert=' + payload);
  }
  return _page('We could not find that link. It may have expired, or been used already.');
}

/* ---------- plumbing ---------- */

function setup() {
  _sheet(SHEET_REQ, REQ_HEADERS);
  _sheet(SHEET_ISS, ISS_HEADERS);
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('secret')) props.setProperty('secret', Utilities.getUuid());
  Logger.log('Ready. Sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl());
  Logger.log('Deploy as a web app, then paste the /exec URL into content.js.');
}

/* Exact match against the allow-list. An origin that merely CONTAINS one of
   ours is not good enough: https://ai-page.sandbox.purplemaia.org.evil.test/
   contains it too. */
function _allowedOrigin(o) {
  var s = String(o || '').trim();
  if (s && s.charAt(s.length - 1) !== '/') s += '/';
  for (var i = 0; i < ALLOWED_ORIGINS.length; i++) {
    if (s === ALLOWED_ORIGINS[i]) return s;
  }
  return null;
}

function _sheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sh.getLastRow() === 0) {
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function _recent(sheet) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var n = Math.min(last - 1, MAX_PER_HR + 5);
  var cut = new Date().getTime() - 3600000;
  return sheet.getRange(last - n + 1, 1, n, 1).getValues()
    .filter(function (t) { return t[0] instanceof Date && t[0].getTime() > cut; }).length;
}

/* Same spreadsheet formula-injection defence as the feedback collector: a
   value beginning = + - @ is run as a formula when the sheet is opened. */
function _cell(v, max) {
  var s = String(v == null ? '' : v).slice(0, max || 200);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function _code() {
  var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';      // no I/O/0/1, they get misread aloud
  var out = '';
  for (var i = 0; i < 6; i++) out += a.charAt(Math.floor(Math.random() * a.length));
  return 'PM-' + out;
}

function _b64url(s) {
  return Utilities.base64EncodeWebSafe(Utilities.newBlob(s).getBytes()).replace(/=+$/, '');
}

/* An Apps Script web app renders inside an iframe, so the navigation has to
   be aimed at the top window or the site loads inside Google's frame. */
function _redirect(url) {
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta charset="utf-8"><title>Opening your certificate</title>' +
    '<p style="font-family:system-ui,sans-serif">Opening your certificate…</p>' +
    '<script>window.top.location.href=' + JSON.stringify(url) + ';<\/script>'
  );
}

function _page(msg) {
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta charset="utf-8"><title>Certificate</title>' +
    '<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:34em;' +
    'margin:12vh auto;padding:0 20px;font-size:16px;line-height:1.6;color:#15031f">' +
    '<p>' + _esc(msg) + '</p></div>'
  );
}

function _esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function _json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
