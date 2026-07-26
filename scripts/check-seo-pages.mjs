#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

const priorityPages = [
  "booth-design-build-singapore/index.html",
  "event-fabrication-singapore/index.html",
  "custom-props-singapore/index.html",
  "singapore-event-venue-sourcing/index.html",
];

const allStaticPages = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.name === "index.html") {
      allStaticPages.push(fullPath);
    }
  }
}

function matchContent(html, pattern) {
  return (html.match(pattern)?.[1]?.trim() ?? "")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function countMatches(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

const failures = [];

for (const relativePath of priorityPages) {
  const filePath = path.join(publicDir, relativePath);
  const html = fs.readFileSync(filePath, "utf8");
  const title = matchContent(html, /<title>([^<]+)<\/title>/i);
  const description = matchContent(
    html,
    /<meta\s+name="description"\s+content="([^"]+)"/i,
  );
  const canonical = matchContent(
    html,
    /<link\s+rel="canonical"\s+href="([^"]+)"/i,
  );

  if (!title || title.length < 30 || title.length > 65) {
    failures.push(`${relativePath}: title must be 30-65 characters`);
  }
  if (!description || description.length < 110 || description.length > 165) {
    failures.push(`${relativePath}: description must be 110-165 characters`);
  }
  if (!canonical.startsWith("https://actcreative.net/")) {
    failures.push(`${relativePath}: canonical must use actcreative.net`);
  }
  if (countMatches(html, /<h1(?:\s[^>]*)?>/gi) !== 1) {
    failures.push(`${relativePath}: expected exactly one h1`);
  }
  if (!html.includes('class="button primary"') && !html.includes('class="cta"')) {
    failures.push(`${relativePath}: missing a prominent inquiry CTA`);
  }
}

walk(publicDir);

for (const filePath of allStaticPages) {
  const html = fs.readFileSync(filePath, "utf8");
  if (!html.includes('src="/inquiry-attribution.js"')) {
    failures.push(
      `${path.relative(publicDir, filePath)}: missing analytics and inquiry attribution script`,
    );
  }
}

if (failures.length) {
  console.error("SEO checks failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log(
    `SEO checks passed for ${priorityPages.length} priority pages and ${allStaticPages.length} static pages.`,
  );
}
