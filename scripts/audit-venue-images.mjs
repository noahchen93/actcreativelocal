import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = path.join(
  ROOT,
  "public",
  "singapore-event-venue-finder",
  "venue-data.json",
);
const MANIFEST_PATH = path.join(
  ROOT,
  "scripts",
  "cache",
  "venue-image-sources.json",
);
const OUTPUT_DIR = path.join(ROOT, "tmp", "venue-image-audit");

const CARD_WIDTH = 440;
const CARD_HEIGHT = 320;
const IMAGE_WIDTH = 420;
const IMAGE_HEIGHT = 220;
const COLUMNS = 4;
const ROWS = 5;
const PAGE_SIZE = COLUMNS * ROWS;

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function labelSvg(venue, index) {
  const modeColor = venue.image ? "#b7ff38" : "#ffb020";
  const modeText =
    venue.imageMode === "official"
      ? "official image"
      : venue.image
        ? "reference image"
        : "location fallback";
  return Buffer.from(`
    <svg width="${CARD_WIDTH}" height="${CARD_HEIGHT - IMAGE_HEIGHT}">
      <rect width="100%" height="100%" fill="#141414"/>
      <text x="10" y="30" fill="${modeColor}" font-size="21" font-family="Arial, sans-serif" font-weight="700">
        ${String(index + 1).padStart(3, "0")}. ${escapeXml(venue.name)}
      </text>
      <text x="10" y="58" fill="#d0d0d0" font-size="16" font-family="Arial, sans-serif">
        ${escapeXml(venue.area)}
      </text>
      <text x="10" y="84" fill="${modeColor}" font-size="14" font-family="Arial, sans-serif">
        ${modeText}
      </text>
    </svg>
  `);
}

function fallbackSvg(venue) {
  return Buffer.from(`
    <svg width="${IMAGE_WIDTH}" height="${IMAGE_HEIGHT}">
      <rect width="100%" height="100%" fill="#263238"/>
      <rect x="18" y="18" width="${IMAGE_WIDTH - 36}" height="${IMAGE_HEIGHT - 36}" rx="14" fill="#32434b" stroke="#ffb020" stroke-width="2"/>
      <text x="50%" y="44%" text-anchor="middle" fill="#ffffff" font-size="25" font-family="Arial, sans-serif" font-weight="700">
        ${escapeXml(venue.name)}
      </text>
      <text x="50%" y="61%" text-anchor="middle" fill="#ffcc74" font-size="17" font-family="Arial, sans-serif">
        ${escapeXml(venue.area)}
      </text>
      <text x="50%" y="76%" text-anchor="middle" fill="#cfd8dc" font-size="14" font-family="Arial, sans-serif">
        No verified image shown
      </text>
    </svg>
  `);
}

async function imageBuffer(venue) {
  if (!venue.image) {
    return sharp(fallbackSvg(venue)).jpeg({ quality: 88 }).toBuffer();
  }
  const filePath = path.join(ROOT, "public", venue.image.replace(/^\//, ""));
  return sharp(filePath)
    .resize({
      width: IMAGE_WIDTH,
      height: IMAGE_HEIGHT,
      fit: "cover",
      position: "attention",
    })
    .jpeg({ quality: 88 })
    .toBuffer();
}

async function renderPage(venues, pageIndex) {
  const width = CARD_WIDTH * COLUMNS;
  const height = CARD_HEIGHT * ROWS;
  const composites = [];

  for (let index = 0; index < venues.length; index += 1) {
    const venue = venues[index];
    const column = index % COLUMNS;
    const row = Math.floor(index / COLUMNS);
    const left = column * CARD_WIDTH;
    const top = row * CARD_HEIGHT;
    composites.push({
      input: await imageBuffer(venue),
      left: left + 10,
      top: top + 10,
    });
    composites.push({
      input: labelSvg(venue, pageIndex * PAGE_SIZE + index),
      left,
      top: top + IMAGE_HEIGHT,
    });
  }

  const outputPath = path.join(
    OUTPUT_DIR,
    `audit-after-${String(pageIndex + 1).padStart(2, "0")}.jpg`,
  );
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: "#141414",
    },
  })
    .composite(composites)
    .jpeg({ quality: 90 })
    .toFile(outputPath);
  console.log(outputPath);
}

async function main() {
  const dataset = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"));
  const auditedIds = new Set([
    ...Object.keys(manifest.replacements),
    ...manifest.removedIncorrectImages,
  ]);
  const auditAll = process.argv.includes("--all");
  const venues = auditAll
    ? dataset.venues
    : dataset.venues.filter((venue) => auditedIds.has(venue.id));
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  for (let offset = 0; offset < venues.length; offset += PAGE_SIZE) {
    const pageIndex = Math.floor(offset / PAGE_SIZE);
    await renderPage(venues.slice(offset, offset + PAGE_SIZE), pageIndex);
  }
}

await main();
