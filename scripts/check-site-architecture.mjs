import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const routes = JSON.parse(read('src/data/site-navigation.json'));
assert.equal(new Set(routes.map(route => route.href)).size, routes.length);
for (const route of routes) for (const href of [route.href, route.hrefZh]) {
  assert.ok(fs.existsSync(path.join(root, 'public', href, 'index.html')), `Missing navigation target: ${href}`);
}
for (const slug of ['custom-props-singapore', 'event-fabrication-singapore', 'booth-design-build-singapore', 'custom-food-truck-rental-singapore']) {
  const $ = load(read(`public/${slug}/index.html`));
  assert.equal($('header.core-header').length, 1, `${slug}: shared header`);
  assert.equal($('footer.core-footer').length, 1, `${slug}: shared footer`);
  assert.equal($('body').attr('data-contact-routing'), 'explicit', `${slug}: contact policy`);
  assert.equal($('header .core-brief[href="/#contact"]').length, 2, `${slug}: brief route`);
  assert.equal($('link[href="/core-navigation.css"]').length, 1);
  assert.equal($('h1').length, 1);
  for (const route of routes) assert.equal($(`header a[href="${route.href}"]`).length, 2, `${slug}: stale service menu`);
  for (const image of $('main img').toArray()) {
    const src = $(image).attr('src');
    if (!src || !src.startsWith('/')) continue;
    assert.ok(fs.existsSync(path.join(root, 'public', src)), `${slug}: missing image ${src}`);
  }
}
const config = JSON.parse(read('vercel.json'));
assert.ok(config.rewrites.filter(rule => rule.destination === '/index.html').every(rule => rule.source === '/'), 'Only the homepage may use the homepage rewrite');
const errorPage = load(read('public/404.html'));
assert.equal(errorPage('meta[name="robots"]').attr('content'), 'noindex');
assert.ok(!read('public/sitemap.xml').includes('<loc>https://actcreative.net/404'));
const zhDescription = read('vite.config.ts').match(/const zhDescription\s*=\s*'([^']+)'/)?.[1];
assert.ok(zhDescription && !zhDescription.includes('香港'), 'Do not restore Hong Kong service claims in generated metadata');
console.log('Architecture checks passed: six bilingual service routes, four shared core pages, explicit contact destinations, error routing and service-area boundary.');
