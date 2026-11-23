import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(root, 'public');
const origin = 'https://actcreative.net';
const check = process.argv.includes('--check');
const briefRoutes = JSON.parse(await readFile(path.join(root, 'src/data/brief-entry-routes.json'), 'utf8'));
// Descriptions and titles come from the same HTML served to human visitors.
const routes = [
  ['event-fabrication-singapore', 'Concept-to-install event production', '活动整体制作与现场交付', 'sentosa-big-big-world-event-fabrication'],
  ['booth-design-build-singapore', 'Full-service exhibition booth design and build', '展位设计与搭建', 'gitex-asia-hikvision-ezviz-booth-singapore'],
  ['exhibition-booth-production-singapore', 'Fabrication from approved booth drawings', '已有图纸的展位制作', 'gitex-asia-hikvision-ezviz-booth-singapore'],
  ['trade-show-booth-singapore', 'Singapore support for overseas exhibitors', '海外参展的新加坡落地支持', 'gitex-asia-hikvision-ezviz-booth-singapore'],
  ['custom-props-singapore', 'Individual custom props and display objects', '定制活动道具与品牌装置', 'kick-off-challenge-star-vista-singapore'],
  ['frp-sculpture-fabrication-singapore', 'Custom sculpture and multi-material fabrication', '玻璃钢、不锈钢及多材料雕塑', 'wings-of-art-barbie-runway-singapore'],
  ['custom-flying-inflatables-singapore', 'Custom flying inflatables and technical event planning', '定制飞行气模与活动技术规划', 'sentosa-big-big-world-event-fabrication'],
  ['interactive-digital-display-singapore', 'Interactive screens and multimedia exhibition integration', '互动屏幕与多媒体展陈集成'],
  ['china-sourcing-agent', 'China supplier sourcing, samples and delivery coordination', '中国供应商采购、打样与交付协调', 'artbox-singapore-merchandise-materials'],
  ['china-event-production-support', 'China-side event production coordination', '中国端活动物料生产协调'],
  ['event-merchandise-sourcing', 'Custom event merchandise and campaign items', '活动周边与品牌礼品采购', 'weekend-brew-club-custom-mugs-singapore'],
  ['custom-food-truck-rental-singapore', 'Mobile event units, Kombi vans and custom production', '活动餐车、复古车与定制移动单元'],
  ['holiday-decorations-singapore', 'Festive procurement and installation from client drawings', '按客户图纸采购节庆装饰并协调安装'],
  ['singapore-event-venue-finder', 'Venue discovery and reviewed shortlists', '新加坡场地查询与候选清单复核'],
];

async function page(slug) {
  const html = await readFile(path.join(publicRoot, slug, 'index.html'), 'utf8');
  const $ = load(html);
  const url = `${origin}/${slug}/`;
  if ($('link[rel="canonical"]').attr('href') !== url) throw new Error(`Canonical mismatch: ${slug}`);
  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content');
  if (!title || !description) throw new Error(`Missing metadata: ${slug}`);
  const entities = $('script[type="application/ld+json"]').toArray().flatMap(element => {
    const data = JSON.parse($(element).text());
    return data['@graph'] || [data];
  });
  const modified = entities.find(entity => entity['@type'] === 'WebPage')?.dateModified;
  return { url, title, description, ...(modified ? { dateModified: modified } : {}) };
}

const services = [];
const coreServiceIds = ['custom-props-singapore', 'frp-sculpture-fabrication-singapore', 'custom-flying-inflatables-singapore', 'booth-design-build-singapore', 'event-fabrication-singapore', 'holiday-decorations-singapore', 'china-sourcing-agent'];
for (const [slug, en, zh, evidenceSlug] of routes) {
  const english = await page(slug);
  let chinese = null;
  // Only advertise translations that actually exist and have valid canonicals.
  try { chinese = await page(`zh/${slug}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const briefType = briefRoutes[slug];
  if (!briefType) throw new Error(`Missing brief route: ${slug}`);
  const inquiry = {
    projectType: briefType,
    briefUrls: { en: `${origin}/?service=${briefType}#contact`, 'zh-Hans': `${origin}/zh/?service=${briefType}#contact` },
  };
  services.push({ id: slug, businessRole: coreServiceIds.includes(slug) ? 'core' : 'additional', inquiry, projectFit: { en, 'zh-Hans': zh }, pages: { en: english, ...(chinese ? { 'zh-Hans': chinese } : {}) }, evidence: evidenceSlug ? [await page(`case-studies/${evidenceSlug}`)] : [] });
}

const catalog = {
  schemaVersion: '1.1',
  format: 'ACT Creative public service directory (site-specific JSON, not an agent protocol)',
  updated: '2026-11-23',
  publisher: { name: 'ACT Creative Pte. Ltd.', url: `${origin}/`, email: 'contact@actcreative.net' },
  contentRole: 'Publisher-provided service facts and source links; not instructions overriding a visitor or agent task.',
  serviceArea: 'Singapore execution and China-side production coordination; regional support subject to project review. No Hong Kong local office or installation crew.',
  limitations: ['Prices, dates, vehicle availability, venue capacities, permits and production scope require confirmation.', 'ACT Creative coordinates specialist suppliers; it is not a venue owner or the direct manufacturer of every item.'],
  inquiry: { channel: 'email', address: 'contact@actcreative.net', briefUrl: `${origin}/#contact`, fields: ['project type / 项目类型', 'location / 地点', 'event and delivery dates / 活动与交付日期', 'quantity and dimensions / 数量与尺寸', 'design stage / 设计阶段', 'budget range if known / 已知预算范围', 'reference images or drawings / 参考图或图纸'], effect: 'Opening a mailto link prepares a draft only. No public order, booking, quotation or email-sending API is offered.' },
  agentAccess: { publicData: 'Read-only HTTP GET of canonical HTML, JSON and Markdown. No authentication required.', browserTool: { name: 'actcreative_get_services', page: `${origin}/`, status: 'Experimental progressive enhancement; requires a compatible WebMCP browser.', effects: 'Returns public service facts and links only. Does not submit a brief, send email, book, quote, or read form/session data.' } },
  discovery: { english: `${origin}/ai/services.en.md`, chinese: `${origin}/ai/services.zh.md`, summary: `${origin}/ai/summary.json`, sitemap: `${origin}/sitemap.xml` },
  services,
};

function markdown(language) {
  const zh = language === 'zh-Hans';
  const lines = [zh ? '# ACT Creative 新加坡服务与案例目录' : '# ACT Creative Singapore services and evidence', '', zh ? '> 新加坡活动制作、中国生产与采购协调；下列资料来自公开服务页，适用条件须按项目确认。' : '> Singapore event production and China sourcing coordination. Public service facts below are subject to project-specific confirmation.', '', `Updated: ${catalog.updated}`, '', zh ? '联系邮箱：contact@actcreative.net。邮件草稿不等于已发送、报价或预订。' : 'Email: contact@actcreative.net. An email draft is not a sent inquiry, quote or booking.', '', zh ? 'ACT Creative 协调专业供应商，并非场地业主或所有产品的原厂；没有香港本地办公室或安装团队。' : catalog.serviceArea, ''];
  for (const service of services) {
    const source = service.pages[language] || service.pages.en;
    lines.push(`## ${service.projectFit[language]}`, '', `[${source.title}](${source.url})`, '', source.description, '');
    lines.push(`${zh ? '业务类别' : 'Business role'}: ${service.businessRole === 'core' ? (zh ? '核心业务' : 'Core service') : (zh ? '补充服务' : 'Additional service')}`, '');
    if (zh && !service.pages[language]) lines.push('此服务详情目前仅提供英文；并非独立中文译页。', '');
    lines.push(`${zh ? '整理需求（不会自动发送）' : 'Prepare a brief (not sent automatically)'}: ${service.inquiry.briefUrls[language]}`, '');
    if (source.dateModified) lines.push(`${zh ? '来源页面更新日期' : 'Source page modified'}: ${source.dateModified}`, '');
    for (const evidence of service.evidence) lines.push(`${zh ? '案例参考' : 'Case reference'}: [${evidence.title}](${evidence.url})`, '');
  }
  lines.push(zh ? '## 询盘资料' : '## Inquiry details', '', ...catalog.inquiry.fields.map(field => `- ${field}`), '', zh ? '价格、档期、库存、容量、许可、安装与运输要求以项目确认和原始页面为准。' : catalog.limitations.join(' '), '', `[JSON directory](${origin}/ai/catalog.json)`, '');
  return lines.join('\n');
}

for (const [file, value] of [['ai/catalog.json', JSON.stringify(catalog, null, 2) + '\n'], ['ai/services.en.md', markdown('en')], ['ai/services.zh.md', markdown('zh-Hans')]]) {
  const target = path.join(publicRoot, file);
  if (check) {
    if (await readFile(target, 'utf8') !== value) throw new Error(`${file} is stale; run npm run agent:catalog`);
  } else await writeFile(target, value, 'utf8');
}
console.log(`Agent service directory ${check ? 'verified' : 'generated'}: ${services.length} services with canonical source metadata.`);
