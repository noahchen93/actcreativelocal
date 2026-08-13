#!/usr/bin/env node

import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const useBuild = process.argv.includes("--build");
const base = useBuild ? path.join(root, "build") : path.join(root, "public");
const failures = [];

async function text(relativePath) {
  const filePath = path.join(base, relativePath);
  try {
    const fileStats = await stat(filePath);
    if (!fileStats.isFile()) throw new Error("not a file");
    return await readFile(filePath, "utf8");
  } catch (error) {
    failures.push(`${relativePath}: missing or unreadable (${error.message})`);
    return "";
  }
}

function parseJson(relativePath, source) {
  if (!source) return null;
  try {
    return JSON.parse(source);
  } catch (error) {
    failures.push(`${relativePath}: invalid JSON (${error.message})`);
    return null;
  }
}

const [aiTxt, summarySource, faqSource, serviceSource, llms, llmsFull, feed, robots] =
  await Promise.all([
    text(".well-known/ai.txt"),
    text("ai/summary.json"),
    text("ai/faq.json"),
    text("ai/service.json"),
    text("llms.txt"),
    text("llms-full.txt"),
    text("feed.xml"),
    text("robots.txt"),
  ]);

const summary = parseJson("ai/summary.json", summarySource);
const faq = parseJson("ai/faq.json", faqSource);
const service = parseJson("ai/service.json", serviceSource);

if (summary) {
  if (summary.name !== "ACT Creative Singapore") failures.push("ai/summary.json: canonical name changed");
  if (!String(summary.description || "").includes("integrated event solutions")) failures.push("ai/summary.json: description is too generic");
  if (summary.url !== "https://actcreative.net/") failures.push("ai/summary.json: canonical URL changed");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(summary.lastModified || "")) failures.push("ai/summary.json: invalid lastModified");
  if (!summary.discovery?.llmsFull || !summary.discovery?.sitemap) failures.push("ai/summary.json: discovery links are incomplete");
}

if (faq) {
  if (!Array.isArray(faq.faqs) || faq.faqs.length < 6) failures.push("ai/faq.json: expected at least 6 FAQs");
  for (const [index, item] of (faq.faqs || []).entries()) {
    if (String(item.question || "").length < 10) failures.push(`ai/faq.json: FAQ ${index + 1} question is too short`);
    if (String(item.answer || "").length < 40) failures.push(`ai/faq.json: FAQ ${index + 1} answer is too short`);
    if (!String(item.source || "").startsWith("https://actcreative.net/")) failures.push(`ai/faq.json: FAQ ${index + 1} lacks a canonical source`);
  }
}

if (service) {
  if (!String(service.name || "").includes("ACT Creative")) failures.push("ai/service.json: service name changed");
  if (!Array.isArray(service.capabilities) || service.capabilities.length < 8) failures.push("ai/service.json: capability coverage is incomplete");
  if (!Array.isArray(service.limitations) || service.limitations.length < 3) failures.push("ai/service.json: public limitations are missing");
}

for (const marker of ["User-agent: *", "Disallow: /api/", "LLMs-Full:", "Service-Catalog:", "Sitemap:"]) {
  if (!aiTxt.includes(marker)) failures.push(`.well-known/ai.txt: missing ${marker}`);
}

if (!llms.startsWith("# ") || !llms.includes("\n> ")) failures.push("llms.txt: H1 or blockquote is missing");
if (!llms.includes("## Optional") || !llms.includes("https://actcreative.net/llms-full.txt")) failures.push("llms.txt: companion discovery section is missing");
if (llms.split(/\r?\n/).length > 200) failures.push("llms.txt: compact index exceeds 200 lines");
if (!llmsFull.startsWith("# ") || !llmsFull.includes("\n> ")) failures.push("llms-full.txt: H1 or blockquote is missing");
if (!feed.includes('<rss version="2.0"') || !feed.includes("https://actcreative.net/feed.xml")) failures.push("feed.xml: RSS self-discovery data is missing");
if (!robots.includes("https://actcreative.net/llms-full.txt")) failures.push("robots.txt: llms-full discovery hint is missing");

const homePath = path.join(useBuild ? base : root, "index.html");
const home = await readFile(homePath, "utf8");
if (!home.includes('type="application/rss+xml"') || !home.includes("https://actcreative.net/feed.xml")) failures.push("index.html: RSS discovery link is missing");
if (!home.includes('"dateModified": "2026-08-13"')) failures.push("index.html: current entity freshness signal is missing");

const venueDataPath = path.join(base, "singapore-event-venue-finder", "venue-data.json");
const venueData = JSON.parse(await readFile(venueDataPath, "utf8"));
const venueCount = Number(venueData.publicCount);
if (!Number.isInteger(venueCount) || venueCount < 1) failures.push("venue-data.json: publicCount is invalid");
for (const [label, source] of [["ai/faq.json", faqSource], ["llms-full.txt", llmsFull]]) {
  if (!source.includes(`${venueCount} reviewed`)) failures.push(`${label}: venue count is stale (expected ${venueCount})`);
}

if (failures.length > 0) {
  console.error(`GEO discovery check failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`GEO discovery check passed for ${useBuild ? "build output" : "source"}: 4 discovery endpoints, llms-full, RSS and ${venueCount} venue records.`);
