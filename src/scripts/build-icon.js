/*
  Build multi-size Windows ICO from SVG source using sharp + png-to-ico.
  Usage:
    node scripts/build-icon.js
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const pngToIco = require('png-to-ico');

(async function () {
  try {
    const srcSvg = path.resolve(__dirname, '..', 'assets', 'icon.svg');
    const outDir = path.resolve(__dirname, '..', 'assets');
    const sizes = [16, 24, 32, 48, 64, 128, 256];

    if (!fs.existsSync(srcSvg)) {
      throw new Error(`Source SVG not found at ${srcSvg}`);
    }
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // Render PNGs
    const pngPaths = [];
    for (const size of sizes) {
      const outPng = path.join(outDir, `icon-${size}.png`);
      await sharp(srcSvg)
        .resize(size, size, { fit: 'contain' })
        .png({ compressionLevel: 9 })
        .toFile(outPng);
      pngPaths.push(outPng);
    }

    // Create ICO
    const icoBuffer = await pngToIco(pngPaths);
    const outIco = path.join(outDir, 'icon.ico');
    fs.writeFileSync(outIco, icoBuffer);
    console.log(`Created ${outIco}`);
  } catch (err) {
    console.error('Icon build failed:', err);
    process.exit(1);
  }
})();
