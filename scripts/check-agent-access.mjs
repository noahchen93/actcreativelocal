import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import { load } from 'cheerio';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = file => readFileSync(path.join(root, file), 'utf8');
const catalog = JSON.parse(read('public/ai/catalog.json'));
const routes = JSON.parse(read('src/data/brief-entry-routes.json'));
const source = read('public/agent-services.js');
const build = process.argv.includes('--build');
const contact = read('src/components/Contact.tsx').split('const projectTypes: BriefOption[] = [')[1].split('];')[0];
const allowed = [...contact.matchAll(/id: "([a-z-]+)"/g)].map(match => match[1]);
assert.equal(catalog.services.filter(service => service.businessRole === 'core').length, 7);
const inflatable = catalog.services.find(service => service.id === 'custom-flying-inflatables-singapore');
assert.ok(inflatable, 'Core inflatable service must be discoverable');
assert.equal(inflatable.businessRole, 'core');
assert.ok(inflatable.evidence.some(page => page.url.includes('sentosa-big-big-world')));
for (const slug of ['custom-props-singapore', 'frp-sculpture-fabrication-singapore', 'custom-flying-inflatables-singapore', 'booth-design-build-singapore', 'event-fabrication-singapore', 'holiday-decorations-singapore', 'china-sourcing-agent']) {
  assert.equal(catalog.services.find(service => service.id === slug)?.businessRole, 'core', `Missing core service: ${slug}`);
}
assert.equal(catalog.services.find(service => service.id === 'custom-food-truck-rental-singapore').businessRole, 'additional');
const summary = JSON.parse(read('public/ai/summary.json'));
const serviceSummary = JSON.parse(read('public/ai/service.json'));
for (const slug of catalog.services.filter(service => service.businessRole === 'core').map(service => service.id)) {
  assert.ok(serviceSummary.canonicalServicePages.includes(`https://actcreative.net/${slug}/`), `Missing service summary: ${slug}`);
}
assert.ok(summary.primaryTopics.some(topic => topic.includes('inflatables')));
assert.ok(summary.primaryTopics.some(topic => topic.includes('Christmas')));
for (const service of catalog.services) {
  assert.ok(allowed.includes(service.inquiry.projectType), `${service.id}: invalid form option`);
  assert.equal(service.inquiry.projectType, routes[service.id]);
  for (const language of ['en','zh-Hans']) {
    const brief = new URL(service.inquiry.briefUrls[language]);
    assert.equal(brief.origin, 'https://actcreative.net');
    assert.equal(brief.pathname, language === 'en' ? '/' : '/zh/');
    assert.equal(brief.searchParams.get('service'), routes[service.id]);
    assert.equal(brief.hash, '#contact');
  }
  for (const page of [...Object.values(service.pages), ...service.evidence]) {
    const url = new URL(page.url);
    const $ = load(read(`public${url.pathname}index.html`));
    assert.equal($('link[rel="canonical"]').attr('href'), page.url);
    assert.equal($('meta[name="description"]').attr('content'), page.description);
  }
}

function host({ api = 'document', lang = 'en', fail = false, registration = 'ok' } = {}) {
  const calls = []; let tool;
  const context = { registerTool(value) { tool = value; if (registration === 'throw') throw Error('Unavailable'); if (registration === 'reject') return Promise.reject(Error('Permission denied')); } };
  const document = { documentElement: { lang }, querySelector() { throw Error('Must not read user form data'); }, ...(api === 'document' ? { modelContext: context } : {}) };
  vm.runInNewContext(source, {
    document, navigator: api === 'navigator' ? { modelContext: context } : {},
    fetch: async (url, options) => { calls.push({url,options}); if (fail) { fail = false; throw Error('Offline'); } return { ok: true, json: async () => catalog }; },
  });
  return { get tool() { return tool; }, calls };
}
const absent = host({ api: 'none' });
assert.equal(absent.tool, undefined); assert.equal(absent.calls.length, 0);
for (const api of ['document','navigator']) {
  const instance = host({ api, lang: 'zh-Hans-SG' });
  assert.equal(instance.calls.length, 0, 'No eager directory download');
  assert.equal(instance.tool.annotations.readOnlyHint, true);
  assert.equal((await instance.tool.execute({ notes: 'private customer text' })).isError, true);
  assert.equal(instance.calls.length, 0, 'Unexpected fields must not be fetched/transmitted');
  const result = JSON.parse((await instance.tool.execute()).content[0].text);
  assert.equal(result.services.length, catalog.services.length); assert.equal(result.language, 'zh-Hans');
  const food = JSON.parse((await instance.tool.execute({ serviceId: 'custom-food-truck-rental-singapore', language: 'en' })).content[0].text);
  assert.equal(food.services.length, 1);
  assert.match(food.services[0].briefUrl, /service=food-truck#contact$/);
  assert.equal(food.services[0].url, catalog.services.find(s=>s.id==='custom-food-truck-rental-singapore').pages.en.url);
  assert.equal(instance.calls.length, 1, 'Repeated lookups reuse public directory');
  assert.equal(instance.calls[0].url, '/ai/catalog.json');
  assert.equal(instance.calls[0].options.credentials, 'omit');
  const flight = JSON.parse((await instance.tool.execute({ serviceId: 'custom-flying-inflatables-singapore', language: 'zh-Hans' })).content[0].text).services[0];
  assert.equal(flight.businessRole, 'core');
  assert.equal(flight.url, inflatable.pages.en.url, 'Do not fabricate a Chinese translation');
  assert.match(flight.briefUrl, /service=custom-props#contact$/);
  assert.ok(flight.evidence.length > 0);
  for (const input of [null, [], { serviceId: '../private' }, { language: 'unknown' }, { serviceId: 'missing-service' }]) assert.equal((await instance.tool.execute(input)).isError, true);
}
const offline = host({ fail: true });
assert.equal((await offline.tool.execute()).isError, true);
assert.equal(JSON.parse((await offline.tool.execute()).content[0].text).services.length, catalog.services.length);
assert.equal(offline.calls.length, 2, 'Recover after transient fetch failure');
host({ registration: 'throw' }); host({ registration: 'reject' });
await new Promise(resolve => setTimeout(resolve, 0));

const sourceZh = load(read('src/data/home-fallback.zh.html'));
assert.ok(sourceZh('h1').text().includes('新加坡'));
assert.equal(sourceZh('h1').length, 1);
assert.ok(sourceZh('main').text().match(/[\u3400-\u9fff]/g).length > 200);
for (const anchor of sourceZh('a[href^="/"]').toArray()) {
  const pathname = sourceZh(anchor).attr('href');
  const file = path.extname(pathname) ? `public${pathname}` : `public${pathname}index.html`;
  assert.ok(pathname === '/' || existsSync(path.join(root,file)), `Missing fallback target: ${pathname}`);
}
if (build) {
  const zh = load(read('build/zh/index.html'));
  assert.equal(zh('html').attr('lang'), 'zh-Hans-SG');
  assert.equal(zh('.seo-fallback h1').text(), sourceZh('h1').text());
  assert.equal(zh('link[rel="canonical"]').attr('href'), 'https://actcreative.net/zh/');
  for (const language of ['', 'zh/']) {
    const html = load(read(`build/${language}index.html`));
    assert.equal(html('script[src="/agent-services.js"]').length, 1);
  }
  assert.equal(read('build/agent-services.js'), source);
}
console.log(`Agent access checks passed (${build ? 'build' : 'source'}): ${catalog.services.length} contextual routes, seven core services, canonical sources, bilingual no-JS content, both WebMCP host shapes, read-only lookup, validation, cache and recovery.`);
