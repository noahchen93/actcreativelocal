import fs from "node:fs/promises";
import path from "node:path";

const workspace = "C:/actcreativelocal";
const sourceRoot =
  "C:/Users/Noah Chen/Documents/BaiduSyncdisk/10 SDQ/新加坡场地资料汇总";
const dataset = JSON.parse(
  await fs.readFile(
    path.join(
      workspace,
      "public/singapore-event-venue-finder/venue-data.json",
    ),
    "utf8",
  ),
);

function key(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\bthe\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\bhotel\b/g, " hotel ")
    .replace(/\s+/g, " ")
    .trim();
}

const aliases = new Map([
  [key("CÉ LA VI"), key("Ce La Vi")],
  [key("1-ATICO"), key("1-Atico")],
  [key("Swissotel The Stamford"), key("Swissôtel The Stamford")],
  [key("The St. Regis Singapore"), key("St. Regis Singapore")],
  [
    key("The Ritz-Carlton, Millenia Singapore"),
    key("The Ritz-Carlton Millenia Singapore"),
  ],
  [
    key("Fullerton Bay Hotel / Clifford Pier"),
    key("Fullerton Bay / Clifford Pier"),
  ],
  [key("Marina Bay Cruise Centre"), key("Marina Bay Cruise Centre Singapore")],
  [key("Wheeler_s Estate"), key("Wheeler's Estate")],
  [
    key("Sofitel Singapore Sentosa Resort_Spa"),
    key("Sofitel Singapore Sentosa Resort & Spa"),
  ],
]);

function canonical(value) {
  const normalised = key(value);
  return aliases.get(normalised) || normalised;
}

const publicKeys = new Set(dataset.venues.map((venue) => canonical(venue.name)));
const inventory = [];

for (const group of ["活动场地", "酒店_宴会厅", "餐厅_餐饮"]) {
  const entries = await fs.readdir(path.join(sourceRoot, group), {
    withFileTypes: true,
  });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      inventory.push({ source: `folder:${group}`, name: entry.name });
    }
  }
}

const catalog = JSON.parse(
  await fs.readFile(
    path.join(sourceRoot, ".internal/codex_work/data/venue_catalog.json"),
    "utf8",
  ),
);
for (const venue of catalog.venues || []) {
  inventory.push({ source: "venue_catalog.json", name: venue.name });
}

const supplement = JSON.parse(
  await fs.readFile(
    path.join(
      sourceRoot,
      ".internal/codex_work/data/web_supplement_venues.json",
    ),
    "utf8",
  ),
);
for (const venue of supplement.venues || []) {
  inventory.push({ source: "web_supplement_venues.json", name: venue.name });
}

const missing = inventory.filter((item) => !publicKeys.has(canonical(item.name)));
const grouped = new Map();
for (const item of missing) {
  const candidate = canonical(item.name);
  if (!grouped.has(candidate)) {
    grouped.set(candidate, { names: new Set(), sources: new Set() });
  }
  grouped.get(candidate).names.add(item.name);
  grouped.get(candidate).sources.add(item.source);
}

const output = [...grouped.values()]
  .map((item) => ({
    names: [...item.names],
    sources: [...item.sources],
  }))
  .sort((a, b) => a.names[0].localeCompare(b.names[0]));

console.log(
  JSON.stringify(
    {
      publicCount: dataset.venues.length,
      inventoryEntries: inventory.length,
      missingCandidates: output,
    },
    null,
    2,
  ),
);
