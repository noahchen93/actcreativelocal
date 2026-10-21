import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeEmailFirstAnchor } from './lib/contact-routing.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const routes = JSON.parse(await fs.readFile(path.join(root, 'src/data/site-navigation.json'), 'utf8'));
const pages = ['custom-props-singapore', 'event-fabrication-singapore', 'booth-design-build-singapore', 'custom-food-truck-rental-singapore'];
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const menu = `<details class="core-service-menu"><summary>Solutions</summary><div class="core-service-links">${routes.map(item => `<a href="${item.href}">${escape(item.en)}</a>`).join('')}<a href="/frp-sculpture-fabrication-singapore/">Sculpture &amp; art installations</a><a href="/holiday-decorations-singapore/">Seasonal decorations</a><a href="/#products">More production formats</a></div></details><a href="/case-studies/">Projects</a><a href="/about/">About</a><a class="core-brief" href="/#contact">Plan your brief</a>`;
for (const slug of pages) {
  const file = path.join(root, 'public', slug, 'index.html');
  let html = await fs.readFile(file, 'utf8');
  if ((html.match(/<header\b/g) || []).length !== 1) throw new Error(`Expected one header: ${slug}`);
  const header = `<header class="core-header"><div class="core-header-inner"><a class="core-brand" href="/" aria-label="ACT Creative home"><img src="/favicon-192.png" alt="" width="36" height="36" /><span>ACT Creative</span></a><nav class="core-desktop" aria-label="Primary navigation">${menu}</nav><a class="core-language" href="/zh/${slug}/" lang="zh-Hans">中文</a><details class="core-mobile"><summary>Menu</summary><nav aria-label="Mobile navigation">${menu}</nav></details></div></header>`;
  html = html.replace(/<header\b[\s\S]*?<\/header>/, header);
  html = html.replace(/<footer\b[\s\S]*?<\/footer>/, '<footer class="core-footer"><span>© 2026 ACT Creative Pte. Ltd. — Singapore</span><a href="/case-studies/">Projects</a><a href="/about/">About ACT Creative</a><a href="/#contact">Plan your brief</a><a href="mailto:contact@actcreative.net">Email us</a></footer>');
  if (!html.includes('href="/core-navigation.css"')) html = html.replace('</head>', '  <link rel="stylesheet" href="/core-navigation.css" />\n  </head>');
  html = html.replace(/<body(?:\s[^>]*)?>/, '<body data-contact-routing="explicit">');
  // Preserve the existing email-first policy as real HTML, not runtime text inference.
  html = html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, normalizeEmailFirstAnchor);
  await fs.writeFile(file, html);
  console.log(`Synced core navigation: ${slug}`);
}
