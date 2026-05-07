import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const originalsDir = path.join(root, '_originals');
fs.mkdirSync(originalsDir, { recursive: true });

const backup = (absPath) => {
  const rel = path.relative(root, absPath).replace(/[\\/]/g, '__');
  const dest = path.join(originalsDir, rel);
  if (!fs.existsSync(dest)) fs.copyFileSync(absPath, dest);
};

const fmt = (n) => (n / 1024).toFixed(0) + ' KB';

const optimizePng = async (absPath, maxDim) => {
  if (!fs.existsSync(absPath)) { console.log('SKIP missing:', absPath); return; }
  const before = fs.statSync(absPath).size;
  backup(absPath);
  const buf = fs.readFileSync(absPath);
  const img = sharp(buf);
  const meta = await img.metadata();
  const longer = Math.max(meta.width || 0, maxDim);
  const out = await sharp(buf)
    .resize({
      width: meta.width > meta.height ? Math.min(meta.width, maxDim) : null,
      height: meta.height >= meta.width ? Math.min(meta.height, maxDim) : null,
      withoutEnlargement: true,
      fit: 'inside',
    })
    .png({ palette: true, quality: 82, compressionLevel: 9, effort: 10 })
    .toBuffer();
  fs.writeFileSync(absPath, out);
  const after = fs.statSync(absPath).size;
  console.log(`${path.relative(root, absPath)}  ${fmt(before)} -> ${fmt(after)}  (${((1 - after / before) * 100).toFixed(0)}% off)`);
};

// Big PNGs in src/assets used by components
const srcAssets = path.join(root, 'src', 'assets');
const bigImages = fs.readdirSync(srcAssets)
  .filter((f) => f.toLowerCase().endsWith('.png'))
  .map((f) => path.join(srcAssets, f))
  .filter((p) => fs.statSync(p).size > 400 * 1024);

console.log(`\n=== Compressing ${bigImages.length} large src/assets PNGs ===`);
for (const p of bigImages) {
  // Logo: keep crisper, use smaller max-dim since it has text/lines
  const isLogo = p.endsWith('9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png');
  await optimizePng(p, isLogo ? 800 : 1400);
}

// og-default.png in public — should be 1200x630 for social
console.log('\n=== Optimizing og-default.png ===');
const ogPath = path.join(root, 'public', 'og-default.png');
if (fs.existsSync(ogPath)) {
  const before = fs.statSync(ogPath).size;
  backup(ogPath);
  const out = await sharp(ogPath)
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'center' })
    .png({ palette: true, quality: 85, compressionLevel: 9, effort: 10 })
    .toBuffer();
  fs.writeFileSync(ogPath, out);
  console.log(`og-default.png  ${fmt(before)} -> ${fmt(fs.statSync(ogPath).size)}`);
}

// Generate favicons from the logo (the source logo is the biggest figma:asset PNG)
console.log('\n=== Generating favicons from logo ===');
const logoSrc = path.join(root, '_originals', 'src__assets__9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png');
const logoFallback = path.join(root, 'src', 'assets', '9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png');
const logoFile = fs.existsSync(logoSrc) ? logoSrc : logoFallback;

const publicDir = path.join(root, 'public');
// Crop center square of logo (the logo image has 'ACT' centered with padding)
// Output favicon variants
const variants = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-48.png', size: 48 },
  { name: 'favicon-192.png', size: 192 },
  { name: 'favicon-512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
];
// Also output a 32x32 favicon.png to match what index.html currently references
variants.push({ name: 'favicon.png', size: 32 });

// Crop tighter: target only the "ACT + arrow" mark, drop the tagline at the bottom.
// Logo image is roughly square with ACT centered around y=42%, arrow extends to y=58%.
const logoMeta = await sharp(logoFile).metadata();
const W = logoMeta.width, H = logoMeta.height;
// Capture the ACT mark region: roughly y=28%..60%, horizontally centered, width ~50%.
const cropH = Math.round(H * 0.32);
const cropW = Math.round(W * 0.55);
const cropTop = Math.round(H * 0.30);
const cropLeft = Math.round((W - cropW) / 2);
// Make it a square by extending vertically (pad with black later when resizing)
const sideLen = Math.max(cropW, cropH);
const padY = Math.round((sideLen - cropH) / 2);
const padX = Math.round((sideLen - cropW) / 2);
const croppedLogo = await sharp(logoFile)
  .extract({ left: cropLeft, top: cropTop, width: cropW, height: cropH })
  .extend({ top: padY, bottom: sideLen - cropH - padY, left: padX, right: sideLen - cropW - padX, background: '#000000' })
  .toBuffer();

for (const v of variants) {
  const out = path.join(publicDir, v.name);
  await sharp(croppedLogo)
    .resize(v.size, v.size, { fit: 'contain', background: '#000000' })
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(out);
  console.log(`${v.name}  (${v.size}x${v.size})  ${fmt(fs.statSync(out).size)}`);
}

console.log('\nDone.');
