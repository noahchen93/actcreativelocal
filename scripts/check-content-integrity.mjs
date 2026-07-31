#!/usr/bin/env node

import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDirectory = path.join(root, "public");
const sitemapPath = path.join(publicDirectory, "sitemap.xml");
const baselinePath = path.join(root, "scripts/content-integrity-baseline.json");
const origin = "https://actcreative.net";
const compareProduction = process.argv.includes("--compare-production");
const failures = [];

async function listIndexPages(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) pages.push(...(await listIndexPages(entryPath)));
    else if (entry.isFile() && entry.name === "index.html") pages.push(entryPath);
  }

  return pages;
}

const getCanonical = (html) =>
  html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0]
    ?.match(/\bhref=["']([^"']+)["']/i)?.[1] || "";

const getSitemapUrls = (xml) =>
  [...xml.matchAll(/<loc>(https:\/\/actcreative\.net\/[^<]*)<\/loc>/g)].map(
    (match) => match[1],
  );

const baseline = JSON.parse(await readFile(baselinePath, "utf8"));
const sitemap = await readFile(sitemapPath, "utf8");
const sitemapUrls = getSitemapUrls(sitemap);
const sitemapSet = new Set(sitemapUrls);
const publicPages = await listIndexPages(publicDirectory);
const casePages = publicPages.filter((page) =>
  page.startsWith(path.join(publicDirectory, "case-studies") + path.sep),
);
const venuePages = publicPages.filter((page) =>
  page.startsWith(path.join(publicDirectory, "singapore-event-venues") + path.sep),
);

const minimumChecks = [
  ["public static pages", publicPages.length, baseline.minimums.publicStaticPages],
  ["case studies", casePages.length, baseline.minimums.caseStudies],
  ["venue pages", venuePages.length, baseline.minimums.venuePages],
  ["sitemap URLs", sitemapUrls.length, baseline.minimums.sitemapUrls],
];

for (const [label, actual, minimum] of minimumChecks) {
  if (actual < minimum) {
    failures.push(`${label}: found ${actual}, protected minimum is ${minimum}`);
  }
}

for (const page of baseline.protectedPages) {
  const filePath = path.join(publicDirectory, page, "index.html");
  const expectedCanonical = `${origin}/${page}/`;
  let html = "";

  try {
    const pageStats = await stat(filePath);
    if (!pageStats.isFile()) throw new Error("not a file");
    html = await readFile(filePath, "utf8");
  } catch {
    failures.push(`${page}: protected page file is missing`);
    continue;
  }

  if (getCanonical(html) !== expectedCanonical) {
    failures.push(`${page}: canonical changed or is missing`);
  }
  if (!sitemapSet.has(expectedCanonical)) {
    failures.push(`${page}: protected URL is missing from sitemap.xml`);
  }
  if (!/<h1(?:\s[^>]*)?>/i.test(html)) {
    failures.push(`${page}: protected page is missing its H1`);
  }
  if (!html.includes('src="/inquiry-attribution.js"')) {
    failures.push(`${page}: protected page lost inquiry attribution coverage`);
  }
}

if (compareProduction) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(`${origin}/sitemap.xml`, {
      headers: { "user-agent": "ACT-Creative-Content-Integrity-Check/1.0" },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const productionUrls = getSitemapUrls(await response.text());
    const missingLocally = productionUrls.filter((url) => !sitemapSet.has(url));
    if (missingLocally.length > 0) {
      failures.push(
        `production sitemap contains ${missingLocally.length} URL(s) absent locally: ${missingLocally.join(", ")}`,
      );
    }
  } catch (error) {
    failures.push(`production comparison failed: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

if (failures.length > 0) {
  console.error(`Content integrity check failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Content integrity passed: ${publicPages.length} static pages, ${casePages.length} case studies, ${venuePages.length} venue pages and ${sitemapUrls.length} sitemap URLs${compareProduction ? ", with production sitemap comparison" : ""}.`,
);
