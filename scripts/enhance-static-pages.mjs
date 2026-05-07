import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

const FAVICON_LINKS = `    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="shortcut icon" href="/favicon.png" />`;

const META_THEME = `    <meta name="theme-color" content="#000000" />`;

// Walk all index.html files inside public/ recursively
const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name === 'index.html') files.push(full);
  }
};
walk(publicDir);

console.log(`Found ${files.length} static index.html files`);

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1) Inject favicon + theme-color before </head> if not present
  if (!html.includes('apple-touch-icon')) {
    html = html.replace(
      /<link rel="stylesheet" href="\/seo-service-page\.css" \/>/,
      `<link rel="stylesheet" href="/seo-service-page.css" />\n${META_THEME}\n${FAVICON_LINKS}`
    );
    changed = true;
  }

  // 2) Upgrade brand link: add the ACT mark image before "ACT Creative" text
  if (html.includes('<a class="brand" href="/">ACT Creative</a>')) {
    html = html.replace(
      '<a class="brand" href="/">ACT Creative</a>',
      '<a class="brand" href="/"><img class="brand-mark" src="/favicon-192.png" alt="ACT Creative logo" width="32" height="32" /><span>ACT Creative</span></a>'
    );
    changed = true;
  }

  // 3) Upgrade footer: 2-column layout with home link
  html = html.replace(
    /<footer>([^<]+)<\/footer>/,
    (m, txt) => {
      const yr = new Date().getFullYear();
      return `<footer><span>&copy; ${yr} ACT Creative Pte. Ltd. — Singapore</span><span><a href="/">Back to home</a> &middot; <a href="mailto:contact@actcreative.net">contact@actcreative.net</a></span></footer>`;
    }
  );

  // Apply only if changed differently
  fs.writeFileSync(file, html, 'utf8');
  console.log(`✔ ${path.relative(root, file)}`);
}

console.log('Done.');
