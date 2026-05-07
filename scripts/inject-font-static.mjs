import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

const FONT_BLOCK = `    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" />`;

const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name === 'index.html') files.push(full);
  }
};
walk(publicDir);

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('fonts.googleapis.com/css2?family=Inter')) {
    console.log('SKIP (already has Inter):', path.relative(root, file));
    continue;
  }
  // Insert before the seo-service-page.css <link>
  html = html.replace(
    /(<link rel="stylesheet" href="\/seo-service-page\.css" \/>)/,
    `${FONT_BLOCK}\n    $1`
  );
  fs.writeFileSync(file, html, 'utf8');
  console.log('✔', path.relative(root, file));
}
console.log('Done.');
