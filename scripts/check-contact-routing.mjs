import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { normalizeEmailFirstAnchor } from './lib/contact-routing.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const directory = path.join(root, process.argv.includes('--build') ? 'build' : 'public');
const original = '<a class="button primary" data-act-label="food_whatsapp" href="https://wa.me/6584515268?text=Hello%20%26%20thanks">Contact us on WhatsApp</a>';
const normalized = normalizeEmailFirstAnchor(original);
assert.match(normalized, />Contact us by email<\/a>/);
assert.match(normalized, /data-act-label="food_email"/);
assert.equal(load(normalized)('a').attr('href').startsWith('mailto:'), true);
assert.equal(new URL(load(normalized)('a').attr('href')).searchParams.get('body'), 'Hello & thanks');
assert.equal(normalizeEmailFirstAnchor(normalized), normalized, 'Sync must be idempotent');
const preserved = original.replace('class=', 'data-act-whatsapp-preserve="true" class=');
assert.equal(normalizeEmailFirstAnchor(preserved), preserved);
const plain = '<a href="https://wa.me/6584515268">WhatsApp</a>';
assert.equal(normalizeEmailFirstAnchor(plain), plain);
const stale = '<a class="button" href="mailto:contact@actcreative.net"><span>WhatsApp ACT Creative</span></a>';
assert.match(normalizeEmailFirstAnchor(stale), /<span>Email ACT Creative<\/span>/);
assert.equal(normalizeEmailFirstAnchor('<a class="button" href="/case-studies/">Projects</a>'), '<a class="button" href="/case-studies/">Projects</a>');

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}
const errors = [];
const files = htmlFiles(directory);
let contacts = 0;
for (const file of files) {
  const $ = load(fs.readFileSync(file, 'utf8'));
  const fail = message => errors.push(`${path.relative(root, file)}: ${message}`);
  for (const element of $('a[href]').toArray()) {
    const link = $(element);
    const href = link.attr('href').trim();
    const label = `${link.text()} ${link.attr('aria-label') || ''}`;
    if (/^(?:\.{0,2}\/)+(?:mailto|tel):/i.test(href) || /^https?:\/\/actcreative\.net\/(?:mailto|tel):/i.test(href)) {
      fail(`Contact protocol incorrectly used as a website path: ${href}`);
    }
    if (/^mailto:/i.test(href)) {
      contacts++;
      if (/whatsapp/i.test(label)) fail(`Email link labelled WhatsApp: ${label.trim()}`);
      if (/whatsapp/i.test(link.attr('data-act-label') || '')) fail('Email link has stale WhatsApp event label');
      if (!/^mailto:[^?\s@]+@[^?\s@]+(?:\?|$)/i.test(href)) fail(`Invalid email address in link: ${href}`);
    }
    if (/^https:\/\/wa\.me\//i.test(href)) {
      contacts++;
      if (!/^https:\/\/wa\.me\/\d+(?:\?|$)/.test(href)) fail(`Invalid WhatsApp destination: ${href}`);
    }
  }
}
assert.equal(errors.length, 0, errors.join('\n'));
console.log(`Contact routing checks passed: ${files.length} HTML files, ${contacts} contact links; protocol, wording, event-label and generator regression checks.`);
