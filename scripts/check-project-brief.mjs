import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { formatProjectBrief, projectBriefSubject, projectBriefMailto } from '../src/lib/projectBrief.ts';

const brief = {
  projectType: 'Food truck / mobile activation', location: 'Singapore',
  timeline: '', budget: 'Need advice', stage: 'Exploring / need advice',
  scope: [], specifications: '', notes: '',
};
assert.match(formatProjectBrief(brief), /Required date: To be confirmed/);
assert.match(formatProjectBrief(brief), /Scope: Need advice/);
assert.match(projectBriefSubject(brief), /Food truck.*Singapore.*Date TBC/);
const special = { ...brief, timeline: '12 Dec\nBcc: example', notes: '中文 & + # ?\nSecond line', specifications: '2 × 1.5m' };
const mail = new URL(projectBriefMailto(special, '\n---\nWebsite source\nSource: google'));
assert.equal(mail.pathname, 'contact@actcreative.net');
assert.deepEqual([...mail.searchParams.keys()], ['subject', 'body']);
assert.ok(!mail.searchParams.get('subject').includes('\n'));
assert.match(mail.searchParams.get('body'), /中文 & \+ # \?/);
assert.match(mail.searchParams.get('body'), /Source: google/);
assert.ok(!mail.searchParams.get('subject').includes(special.notes));

// Exercise the shipped attribution script with DOM stubs. Do not send analytics.
const handlers = new Map();
const hrefs = ['/#contact', '#contact', '/custom-food-truck-rental-singapore/', '/china-sourcing-agent/', '/holiday-decorations-singapore/'];
const links = hrefs.map(href => ({
  dataset: {}, textContent: 'Test link', getAttribute: key => key === 'href' ? href : '',
  matches: () => false, addEventListener: (name, fn) => handlers.set(href, fn),
}));
const events = [];
let ready;
vm.runInNewContext(readFileSync(new URL('../public/inquiry-attribution.js', import.meta.url), 'utf8'), {
  URL, URLSearchParams, Date,
  CustomEvent: class { constructor(name, options) { this.name = name; this.detail = options.detail; } },
  MutationObserver: class { observe() {} },
  window: {
    location: { href: 'https://actcreative.net/', origin: 'https://actcreative.net', hostname: 'actcreative.net', pathname: '/', search: '', hash: '' },
    sessionStorage: { getItem: () => null, setItem() {} },
    va: (_kind, event) => events.push(event), dispatchEvent() {}, setTimeout() {}, addEventListener() {},
  },
  document: {
    referrer: '', title: 'Test', readyState: 'loading', documentElement: { lang: 'en' },
    body: { dataset: { contactRouting: 'explicit' } }, getElementById: () => ({}),
    querySelector: () => ({}), querySelectorAll: () => links,
    addEventListener: (_name, fn) => { ready = fn; },
  },
});
ready();
for (const href of hrefs) handlers.get(href)();
assert.deepEqual(events.map(event => event.name), ['Brief entry opened', 'Brief entry opened', 'Service explored', 'Service explored', 'Service explored']);
assert.ok(events.every(event => !('notes' in event.data)));
console.log('Project brief checks passed: empty fields, structured subjects, Unicode, safe mailto encoding and core funnel events.');
