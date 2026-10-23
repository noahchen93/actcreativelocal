import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { scheduledTheme, isThemePreference } from '../src/lib/homeTheme.ts';

// The pre-paint script and React must agree, including exact schedule boundaries.
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const bootstrap = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const times = [[0, 0, 'dark'], [6, 59, 'dark'], [7, 0, 'light'], [12, 0, 'light'], [18, 59, 'light'], [19, 0, 'dark'], [23, 59, 'dark']];
for (const [hour, minute, expected] of times) {
  assert.equal(scheduledTheme(new Date(2026, 0, 15, hour, minute)), expected);
  for (const saved of [null, 'auto', 'light', 'dark', 'invalid', 'storage-blocked']) {
    const root = { dataset: {} };
    let browserColor;
    vm.runInNewContext(bootstrap, {
      Date: class { getHours() { return hour; } },
      localStorage: { getItem() { if (saved === 'storage-blocked') throw Error('blocked'); return saved; } },
      location: { pathname: '/' },
      document: { documentElement: root, querySelector: () => ({ setAttribute: (_key, value) => { browserColor = value; } }) },
    });
    const effective = saved === 'light' || saved === 'dark' ? saved : expected;
    assert.equal(root.dataset.homeTheme, effective);
    assert.equal(browserColor, effective === 'dark' ? '#171D1A' : '#F4F2EC');
  }
}
for (const value of ['auto', 'light', 'dark']) assert.equal(isThemePreference(value), true);
for (const value of [null, '', 'invalid']) assert.equal(isThemePreference(value), false);
console.log('Home theme checks passed: local-time boundaries, manual overrides, invalid/blocked storage and pre-paint consistency.');
