/**
 * Generate app icons from branding/ice-code-logo.svg
 * Requires: npm i sharp
 * Usage: node tools/generate-icons.js
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'branding', 'ice-code-logo.svg');
const OUT = path.join(__dirname, '..', 'assets');

const targets = [
  { w:48,  h:48,  p:'android/mipmap-mdpi/ic_launcher.png' },
  { w:72,  h:72,  p:'android/mipmap-hdpi/ic_launcher.png' },
  { w:96,  h:96,  p:'android/mipmap-xhdpi/ic_launcher.png' },
  { w:144, h:144, p:'android/mipmap-xxhdpi/ic_launcher.png' },
  { w:192, h:192, p:'android/mipmap-xxxhdpi/ic_launcher.png' },
  { w:1024,h:1024,p:'ios/AppIcon.appiconset/Icon-App-1024x1024@1x.png' },
];

(async () => {
  for (const t of targets) {
    const dst = path.join(OUT, t.p);
    fs.mkdirSync(path.dirname(dst), {recursive:true});
    await sharp(SRC).resize(t.w, t.h, { fit:'contain', background:'#e30613' }).png().toFile(dst);
    console.log('✓', t.p);
  }
  console.log('Done. Copy generated files into your native projects if needed.');
})();