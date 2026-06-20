import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = path.join(
  ROOT,
  "public",
  "singapore-event-venue-finder",
  "venue-data.json",
);
const IMAGE_SOURCE_PATH = path.join(
  ROOT,
  "scripts",
  "cache",
  "venue-image-sources.json",
);
const OVERRIDE_PATH = path.join(
  ROOT,
  "scripts",
  "cache",
  "venue-data-overrides.json",
);

const sensitiveNotePattern =
  /(?:\bavailability\b|\bavailable dates?\b|\bdate holds?\b|\bafter[- ]hours\b|\bweekdays?\b|\bweekends?\b|\bminimum spend\b|\bpricing\b|\bprices?\b|\bcosts?\b|\bfees?\b|\brates?\b|\bquotes?\b|s\$|\$\s*\d|档期|可用日期|最低消费|价格|费用|报价|营业时间)/i;
const nonEnglishOrCorruptPattern =
  /[\u3400-\u9fff\uff00-\uffef]|(?:\?{3,})|(?:锟|鈫|妗|鍙|鏈|�)/;
const capacityFields = ["banquet", "cocktail", "theatre", "classroom"];
const internalFields = [
  "alias",
  "category",
  "rawSuggestedTypes",
  "searchTerms",
  "sourceLevel",
  "geocodeName",
  "geocodeStatus",
  "geocodeQuery",
];

function normaliseUrl(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function cleanSpaceNote(note) {
  const value = String(note || "").replace(/\s+/g, " ").trim();
  if (
    !value ||
    sensitiveNotePattern.test(value) ||
    nonEnglishOrCorruptPattern.test(value)
  ) {
    return "";
  }
  return value;
}

function getLargestSetup(venue) {
  let largest = null;
  for (const space of venue.spaces || []) {
    for (const layout of capacityFields) {
      const value = Number(space[layout] || 0);
      if (!value || (largest && value <= largest.capacity)) continue;
      largest = {
        capacity: value,
        layout,
        space: String(space.name || "").trim(),
      };
    }
  }
  return largest;
}

function sentenceList(values, limit = 3) {
  const items = (values || []).filter(Boolean).slice(0, limit);
  if (items.length < 2) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items.at(-1)}`;
}

function buildPublicNote(venue, largestSetup) {
  const primaryType = venue.primaryType || venue.propertyTypes?.[0] || "Event venue";
  const events = sentenceList(venue.eventTypes, 3).toLowerCase();
  const spaceCount = venue.spaces?.length || 0;
  const opening = `${primaryType} in ${venue.area}`;
  let detail = spaceCount
    ? ` with ${spaceCount} recorded event space${spaceCount === 1 ? "" : "s"}`
    : "";

  if (largestSetup) {
    detail += `. ${largestSetup.space || "The largest recorded setup"} supports up to ${largestSetup.capacity.toLocaleString("en-SG")} guests in ${largestSetup.layout} format`;
  }

  if (events) {
    detail += `. Planning tags include ${events}`;
  }

  return `${opening}${detail}. Capacity depends on the selected space and event layout.`;
}

const dataset = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
const imageSources = JSON.parse(await fs.readFile(IMAGE_SOURCE_PATH, "utf8"));
const overrides = JSON.parse(await fs.readFile(OVERRIDE_PATH, "utf8"));
const excludedNames = new Set(overrides.excludedVenueNames || []);

dataset.privacyNote =
  "This public planning dataset contains venue identity, source-linked planning tags, capacity signals and map coordinates. Commercial terms and scheduling information are excluded.";
dataset.methodology =
  "Records are curated from ACT Creative's venue index and checked against public venue or reference sources. Capacity values describe the largest recorded layout and are not booking guarantees.";
dataset.venues = (dataset.venues || []).filter(
  (venue) => !excludedNames.has(venue.name),
);

for (const venue of dataset.venues || []) {
  const override = overrides.venues?.[venue.name] || {};
  Object.assign(venue, override);
  delete venue.hours;
  delete venue.priceSignal;
  for (const field of internalFields) delete venue[field];

  venue.propertyTypes = [...new Set(venue.propertyTypes || [venue.kind])].filter(
    Boolean,
  );
  venue.settings = [...new Set(venue.settings || [])].filter(Boolean);
  venue.eventTypes = [...new Set(venue.eventTypes || [])].filter(Boolean);
  venue.primaryType = venue.propertyTypes[0] || "Flexible event venue";

  for (const space of venue.spaces || []) {
    space.name = String(space.name || "")
      .replace(/\s*\(after hours\)\s*/gi, " ")
      .replace(/\bafter[- ]hours\b/gi, "private")
      .replace(/\s+/g, " ")
      .trim();
    space.note = cleanSpaceNote(space.note);
  }

  const largestSetup = getLargestSetup(venue);
  venue.maxCapacity = largestSetup?.capacity || venue.maxCapacity || null;
  venue.capacityBasis = largestSetup
    ? {
        space: largestSetup.space,
        layout: largestSetup.layout,
        capacity: largestSetup.capacity,
      }
    : null;
  venue.publicNote = buildPublicNote(venue, largestSetup);

  const imageSource = imageSources.replacements?.[venue.id] || null;
  const officialImageSource =
    imageSource?.imageMode === "official"
      ? normaliseUrl(imageSource.sourcePage)
      : "";
  venue.website = normaliseUrl(venue.website) || officialImageSource;
  venue.sourceUrl = venue.website || normaliseUrl(imageSource?.sourcePage);
  venue.sourceType = venue.website
    ? "Official venue website"
    : venue.sourceUrl
      ? "Public reference source"
      : "Curated venue index";
  venue.imageSourceUrl = normaliseUrl(imageSource?.sourcePage);
  venue.imageSourceType = imageSource?.imageMode || venue.imageMode || "reference";
  venue.lastVerified = dataset.generatedAt;

  const completeness = [
    Boolean(venue.sourceUrl),
    Boolean(venue.image),
    Boolean(venue.maxCapacity),
    Boolean(venue.spaces?.length),
  ].filter(Boolean).length;
  venue.dataConfidence =
    completeness === 4 && venue.sourceType === "Official venue website"
      ? "high"
      : completeness >= 3
        ? "medium"
        : "limited";
}

dataset.publicCount = dataset.venues.length;
dataset.mappedCount = dataset.venues.filter(
  (venue) => Number.isFinite(venue.lat) && Number.isFinite(venue.lng),
).length;

await fs.writeFile(DATA_PATH, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
console.log(
  `sanitized and enriched ${dataset.venues.length} public venue records`,
);
