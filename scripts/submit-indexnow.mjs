import fs from "node:fs/promises";
import path from "node:path";

const SITE_HOST = "actcreative.net";
const SITE_ORIGIN = `https://${SITE_HOST}`;
const DEFAULT_KEY = "1f6d9c3e7a4b8d2c5e0f9a1b6c3d7e4f";
const isDryRun = process.argv.includes("--dry-run");
const sitemapArgument = process.argv.find((argument) => argument.startsWith("--sitemap="));
const sitemapPath = path.resolve(
  process.cwd(),
  sitemapArgument?.slice("--sitemap=".length) || "public/sitemap.xml",
);

const sitemap = await fs.readFile(sitemapPath, "utf8");
const urls = Array.from(sitemap.matchAll(/<loc>(https:\/\/actcreative\.net\/[^<]*)<\/loc>/g))
  .map((match) => match[1])
  .filter((url, index, allUrls) => allUrls.indexOf(url) === index);

if (urls.length === 0) {
  throw new Error(`No ${SITE_HOST} URLs found in ${sitemapPath}.`);
}

const key = process.env.INDEXNOW_KEY || DEFAULT_KEY;
const payload = {
  host: SITE_HOST,
  key,
  keyLocation: `${SITE_ORIGIN}/${key}.txt`,
  urlList: urls,
};

if (isDryRun) {
  console.log(`[indexnow] Dry run: ${urls.length} URLs from ${sitemapPath}`);
  console.log(`[indexnow] Key location: ${payload.keyLocation}`);
  process.exit(0);
}

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

if (!response.ok && response.status !== 202) {
  const body = await response.text();
  throw new Error(`IndexNow submission failed (${response.status}): ${body.slice(0, 500)}`);
}

console.log(`[indexnow] Submitted ${urls.length} URLs (${response.status}).`);
