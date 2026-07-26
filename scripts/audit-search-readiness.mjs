import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const outputDirectory = path.resolve(process.argv[2] || "build");
const siteOrigin = "https://actcreative.net";
const failures = [];

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(fullPath)));
    else files.push(fullPath);
  }

  return files;
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function canonicalFrom(html) {
  const tag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)?.[0];
  return tag?.match(/\bhref=["']([^"']+)["']/i)?.[1] || null;
}

function alternateLinks(html) {
  return [...html.matchAll(/<link\b[^>]*\brel=["']alternate["'][^>]*>/gi)]
    .map((match) => ({
      hreflang: match[0].match(/\bhreflang=["']([^"']+)["']/i)?.[1]?.toLowerCase(),
      href: match[0].match(/\bhref=["']([^"']+)["']/i)?.[1],
    }))
    .filter((link) => link.hreflang && link.href);
}

function buildPathForUrl(url) {
  const pathname = new URL(url).pathname;
  if (pathname === "/") return path.join(outputDirectory, "index.html");
  if (path.extname(pathname)) return path.join(outputDirectory, pathname.replace(/^\//, ""));
  return path.join(outputDirectory, pathname.replace(/^\//, ""), "index.html");
}

let outputStats;
try {
  outputStats = await stat(outputDirectory);
} catch {
  console.error(`Search audit: output directory not found: ${outputDirectory}`);
  process.exit(1);
}

if (!outputStats.isDirectory()) {
  console.error(`Search audit: expected a directory: ${outputDirectory}`);
  process.exit(1);
}

const htmlFiles = (await listFiles(outputDirectory)).filter((file) => file.endsWith(".html"));
const htmlByCanonical = new Map();

for (const file of htmlFiles) {
  const relativePath = path.relative(outputDirectory, file).replaceAll("\\", "/");
  const html = await readFile(file, "utf8");
  const titleCount = countMatches(html, /<title\b[^>]*>[\s\S]*?<\/title>/gi);
  const h1Count = countMatches(html, /<h1\b[^>]*>/gi);
  const canonicalCount = countMatches(html, /<link\b[^>]*\brel=["']canonical["'][^>]*>/gi);
  const jsonLdBlocks = [...html.matchAll(/<script\b[^>]*\btype=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

  if (titleCount !== 1) failures.push(`${relativePath}: expected one <title>, found ${titleCount}`);
  if (h1Count !== 1) failures.push(`${relativePath}: expected one <h1>, found ${h1Count}`);
  if (canonicalCount !== 1) failures.push(`${relativePath}: expected one canonical, found ${canonicalCount}`);
  if (jsonLdBlocks.length === 0) failures.push(`${relativePath}: missing JSON-LD`);
  if (!html.includes('src="/site-analytics.js"')) failures.push(`${relativePath}: missing site-analytics.js`);

  for (const [index, block] of jsonLdBlocks.entries()) {
    try {
      JSON.parse(block[1].trim());
    } catch (error) {
      failures.push(`${relativePath}: invalid JSON-LD block ${index + 1}: ${error.message}`);
    }
  }

  const canonical = canonicalFrom(html);
  if (canonical) {
    htmlByCanonical.set(canonical, html);
    try {
      const url = new URL(canonical);
      if (url.origin !== siteOrigin) failures.push(`${relativePath}: canonical uses unexpected origin ${url.origin}`);
      if (url.pathname !== "/" && !url.pathname.endsWith("/")) failures.push(`${relativePath}: canonical must end with a trailing slash`);
    } catch {
      failures.push(`${relativePath}: invalid canonical URL ${canonical}`);
    }
  }
}

const sitemapPath = path.join(outputDirectory, "sitemap.xml");
const sitemap = await readFile(sitemapPath, "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>(https:\/\/actcreative\.net\/[^<]*)<\/loc>/g)].map((match) => match[1]);

for (const url of sitemapUrls) {
  try {
    await stat(buildPathForUrl(url));
  } catch {
    failures.push(`sitemap.xml: missing built page for ${url}`);
  }
}

const localizedPairs = [
  ["https://actcreative.net/custom-props-singapore/", "https://actcreative.net/zh/custom-props-singapore/"],
  ["https://actcreative.net/frp-sculpture-fabrication-singapore/", "https://actcreative.net/zh/frp-sculpture-fabrication-singapore/"],
  ["https://actcreative.net/custom-food-truck-rental-singapore/", "https://actcreative.net/zh/custom-food-truck-rental-singapore/"],
  ["https://actcreative.net/singapore-event-venue-finder/", "https://actcreative.net/zh/singapore-event-venue-finder/"],
];

for (const [englishUrl, chineseUrl] of localizedPairs) {
  const englishLinks = alternateLinks(htmlByCanonical.get(englishUrl) || "");
  const chineseLinks = alternateLinks(htmlByCanonical.get(chineseUrl) || "");

  if (!englishLinks.some((link) => link.href === chineseUrl && link.hreflang.startsWith("zh"))) {
    failures.push(`${englishUrl}: missing Chinese hreflang link`);
  }
  if (!chineseLinks.some((link) => link.href === englishUrl && link.hreflang.startsWith("en"))) {
    failures.push(`${chineseUrl}: missing English hreflang link`);
  }
}

if (failures.length > 0) {
  console.error(`Search audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Search audit passed: ${htmlFiles.length} HTML pages, ${sitemapUrls.length} sitemap URLs, ${localizedPairs.length} localized pairs.`);
