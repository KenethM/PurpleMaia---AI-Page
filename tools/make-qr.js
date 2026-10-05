/* Regenerates assets/qr.svg, assets/qr.png and assets/qr-slide.png.
 *
 * The QR encodes SITE_URL below. If the canonical URL ever moves — most
 * likely to ai.purplemaia.org — change it here and re-run, because a QR is
 * the one asset that cannot be redirected after it is printed on something.
 *
 *   cd tools && npm install qrcode && node make-qr.js
 *
 * The two PNGs are rendered by headless Chrome so they can carry the logo and
 * the kāpala texture; the command is printed at the end. Error correction is
 * level H (30% recoverable), which is what buys room for a logo in the middle
 * without breaking the read. Always rescan after changing anything here —
 * tools/check-qr.js round-trips the PNGs back to text.
 */
const QR = require('qrcode');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://ai-page.sandbox.purplemaia.org/';
const PURPLE = '#1a002d';
const ASSETS = path.join(__dirname, '..', 'assets');
const A = ASSETS.split(String.fromCharCode(92)).join('/');

(async () => {
  await QR.toFile(path.join(ASSETS, 'qr.svg'), SITE_URL, {
    errorCorrectionLevel: 'H', margin: 2, type: 'svg', width: 1024,
    color: { dark: PURPLE, light: '#ffffff' }
  });

  const dark = await QR.toString(SITE_URL, { errorCorrectionLevel: 'H', margin: 2,
    type: 'svg', width: 1000, color: { dark: PURPLE, light: '#ffffff' } });
  fs.writeFileSync(path.join(__dirname, 'qr-card.html'),
`<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}html,body{margin:0;background:#fff}
.wrap{position:relative;width:1000px;height:1000px}.wrap svg{display:block;width:1000px;height:1000px}
.pad{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:196px;height:196px;
     background:#fff;border-radius:26px;display:grid;place-items:center}
.pad img{width:140px;display:block}
</style></head><body><div class="wrap">${dark}<div class="pad">
<img src="file:///${A}/pm-mark.png"></div></div></body></html>`);

  const light = await QR.toString(SITE_URL, { errorCorrectionLevel: 'H', margin: 1,
    type: 'svg', width: 560, color: { dark: '#ffffff', light: PURPLE } });
  fs.writeFileSync(path.join(__dirname, 'qr-slide.html'),
`<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Inter:wght@400;500;600&display=swap">
<style>
*{box-sizing:border-box}html,body{margin:0}
.s{position:relative;width:1600px;height:900px;background:${PURPLE};color:#fff;font-family:Inter,sans-serif;
   -webkit-font-smoothing:antialiased;display:flex;align-items:center;gap:90px;padding:90px 110px;overflow:hidden}
.tex{position:absolute;inset:0;opacity:.10;
  background-image:url('file:///${A}/stamp.png'),url('file:///${A}/stamp.png');
  background-repeat:no-repeat;background-size:560px,420px;
  background-position:right -150px top -160px, left -140px bottom -180px}
.qr{position:relative;flex:0 0 auto}.qr svg{display:block;width:560px;height:560px}
.pad{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:116px;height:116px;
     background:${PURPLE};border-radius:16px;display:grid;place-items:center}
.pad img{width:84px;display:block}
.r{position:relative;flex:1}.r img.lk{height:40px;margin-bottom:46px;display:block}
h1{font-family:Montserrat,sans-serif;font-weight:700;font-size:82px;line-height:1.03;letter-spacing:-.035em;margin:0 0 24px}
.u{font-family:ui-monospace,Consolas,monospace;font-size:27px;color:#d9c9e8;margin:0 0 34px;word-break:break-all}
.strip{display:flex;height:9px;width:330px;border-radius:99px;overflow:hidden}.strip i{flex:1}
</style></head><body><div class="s"><div class="tex"></div>
<div class="qr">${light}<div class="pad"><img src="file:///${A}/pm-mark-white.png"></div></div>
<div class="r"><img class="lk" src="file:///${A}/pm-lockup-white.png">
<h1>Scan to open<br>LLM/NLP 101</h1>
<p class="u">${SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')}</p>
<div class="strip"><i style="background:#081659"></i><i style="background:#faaf40"></i>
<i style="background:#006838"></i><i style="background:#c3996b"></i><i style="background:#ec1c24"></i>
<i style="background:#3b2314"></i><i style="background:#8bc53f"></i><i style="background:#00adee"></i></div>
</div></div></body></html>`);

  const m = QR.create(SITE_URL, { errorCorrectionLevel: 'H' });
  console.log('encodes : ' + SITE_URL);
  console.log('version : ' + m.version + '  (' + m.modules.size + 'x' + m.modules.size + ' modules, EC level H)');
  console.log('');
  console.log('assets/qr.svg written. Now render the two PNGs, from the repo root:');
  console.log('');
  console.log('  chrome --headless --disable-gpu --disable-lcd-text --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=6000 --window-size=1000,1000 --screenshot=assets/qr.png tools/qr-card.html');
  console.log('  chrome --headless --disable-gpu --disable-lcd-text --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=6000 --window-size=1600,900 --screenshot=assets/qr-slide.png tools/qr-slide.html');
  console.log('');
  console.log('Then rescan them, always:  node tools/check-qr.js assets/qr.png assets/qr-slide.png');
})();
