// Local browser verification. WebKit/Chromium emulation does not replace real devices.
// PLAYWRIGHT_BROWSERS_PATH=/tmp/act-mobile-browsers node scripts/check-mobile-ui.mjs
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium, webkit } from 'playwright';

const base = process.env.MOBILE_UI_URL || 'http://127.0.0.1:3000';
const output = process.env.MOBILE_UI_OUTPUT || '/tmp/act-mobile-ui';
await mkdir(output, { recursive: true });
const profiles = [
  { name: 'reflow', width: 320, height: 568 },
  { name: 'iphone-se', width: 375, height: 667 },
  { name: 'iphone', width: 390, height: 844 },
  { name: 'android-small', width: 360, height: 800 },
  { name: 'android-large', width: 412, height: 915 },
  { name: 'landscape', width: 844, height: 390 },
  { name: 'desktop', width: 1280, height: 900 },
];
const measurements = [];
async function loadSections(page) {
  for (const id of ['cases', 'process', 'contact', 'products']) {
    await page.locator(`#section-${id}`).scrollIntoViewIfNeeded();
    await page.locator(`#${id}`).waitFor();
  }
  await page.locator('.site-shell > div').last().scrollIntoViewIfNeeded();
  await page.locator('footer').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
}
async function checkOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
  assert.ok(dimensions.scroll <= dimensions.width + 1, `${label}: page overflow ${JSON.stringify(dimensions)}`);
}
for (const [engine, type, options] of [['chromium', chromium, { channel: 'chrome' }], ['webkit', webkit, {}]]) {
  const browser = await type.launch({ headless: true, ...options });
  try {
    for (const profile of profiles.filter(p => !process.env.MOBILE_UI_PROFILE || p.name === process.env.MOBILE_UI_PROFILE)) for (const language of ['en', 'zh']) {
      const label = `${engine}-${profile.name}-${language}`;
      const page = await browser.newPage({ viewport: { width: profile.width, height: profile.height }, isMobile: profile.width < 1000, hasTouch: true, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/${language === 'zh' ? 'zh/' : ''}`, { waitUntil: 'domcontentloaded' });
      await loadSections(page);
      await checkOverflow(page, label);
      const metrics = await page.evaluate(() => {
        const lines = selector => {
          const element = document.querySelector(selector);
          return Math.round(element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight));
        };
        return { pageHeight: document.documentElement.scrollHeight, heroLines: lines('h1'), introLines: lines('.hero-description'), headings: [...document.querySelectorAll('h2')].map(e => ({ text: e.innerText, lines: Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight)) })), sections: Object.fromEntries(['home','services','cases','process','contact','products'].map(id => [id, Math.round(document.getElementById(id).getBoundingClientRect().height)])) };
      });
      measurements.push({ engine, ...profile, language, ...metrics });
      if (profile.width >= 360 && profile.width <= 412) {
        assert.ok(metrics.heroLines <= 2, `${label}: H1 exceeds two lines`);
        assert.ok(metrics.introLines <= 4, `${label}: intro exceeds four lines`);
        for (const heading of metrics.headings) assert.ok(heading.lines <= 2, `${label}: heading wraps excessively: ${heading.text}`);
        const targets = await page.locator('.theme-switcher > summary,.core-language,.core-mobile > summary,.hero-primary,.hero-secondary,.hero-project-controls button,.case-rail-arrow,#contact .brief-input').evaluateAll(elements => elements.filter(e => e.getClientRects().length).map(e => ({ text: e.textContent, width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height })));
        for (const target of targets) assert.ok(target.width >= 48 && target.height >= 48, `${label}: small touch target ${JSON.stringify(target)}`);
      }
      if (profile.name === 'iphone') {
        await page.locator('.core-mobile > summary').click();
        assert.equal(await page.locator('.core-mobile').evaluate(e => e.open), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('.core-mobile').evaluate(e => e.open), false);
        await page.locator('.hero-project-controls button').nth(1).click();
        assert.equal(await page.locator('.hero-project-controls button').nth(1).getAttribute('aria-pressed'), 'true');
        await page.locator('.hero-primary').click();
        await page.locator('#contact').waitFor();
        const preview = page.locator('.brief-preview-disclosure');
        assert.equal(await preview.evaluate(e => e.open), false);
        await preview.locator('summary').click();
        await page.locator('.brief-preview').waitFor({ state: 'visible' });
        await page.locator('select.mobile-copy').selectOption('export');
        await page.locator('#contact .brief-field > summary').click();
        assert.equal(await page.locator('.brief-option').filter({ hasText: /On-site installation|现场安装/ }).count(), 0);
        await preview.locator('summary').click();
        assert.equal(await preview.evaluate(e => e.open), false);
        const firstProduct = page.locator('.product-card').first();
        await firstProduct.locator('.product-copy > button').click();
        await firstProduct.locator('[id^="category-details-"]').waitFor({ state: 'visible' });
        await checkOverflow(page, `${label} expanded product`);
        await firstProduct.locator('.product-copy > button').click();
        const originalCount = await page.locator('.product-card').count();
        await page.locator('.product-more-button').click();
        assert.ok(await page.locator('.product-card').count() > originalCount);
        await page.locator('.product-more-button').click();
        assert.equal(await page.locator('.product-card').count(), originalCount);
        await page.keyboard.press('Escape'); // Stop the hash restorer as a user would.
        await page.evaluate(() => history.replaceState(null, '', location.pathname));
        await page.evaluate(() => { window.scrollTo(0, 0); });
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.querySelector('.home-theme').setAttribute('data-theme', theme), theme);
          await page.waitForTimeout(300);
          await page.screenshot({ path: `${output}/${label}-${theme}.png` });
        }
      }
      if (profile.name === 'iphone') {
        // Text-only enlargement is a stress test, not native Dynamic Type certification.
        await page.evaluate(() => {
          const sizes = [...document.querySelectorAll('.site-shell,.site-shell *')].map(e => ({ e, font: parseFloat(getComputedStyle(e).fontSize), line: parseFloat(getComputedStyle(e).lineHeight) }));
          for (const { e, font, line } of sizes) {
            e.style.setProperty('font-size', `${font * 2}px`, 'important');
            if (Number.isFinite(line)) e.style.setProperty('line-height', `${line * 2}px`, 'important');
          }
        });
        await checkOverflow(page, `${label} 200% text`);
        const clipped = await page.locator('.solution-card h3,.product-title h3,.brief-panel p,.brief-panel a').evaluateAll(elements => elements.filter(e => e.checkVisibility({ visibilityProperty: true }) && e.scrollWidth > e.clientWidth + 3).map(e => e.textContent));
        assert.deepEqual(clipped, [], `${label}: clipped enlarged text`);
      }
      assert.deepEqual(errors, [], `${label}: runtime errors`);
      await page.close();
      console.log(`PASS ${label}: ${metrics.pageHeight}px, H1 ${metrics.heroLines} lines`);
    }
  } finally { await browser.close(); }
}
await writeFile(`${output}/measurements${process.env.MOBILE_UI_PROFILE ? '-' + process.env.MOBILE_UI_PROFILE : ''}.json`, JSON.stringify(measurements, null, 2));
console.log(`Passed ${measurements.length} profiles. Measurements and screenshots: ${output}`);
