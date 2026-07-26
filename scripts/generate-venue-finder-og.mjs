import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const venueDir = path.join(
  root,
  "public",
  "singapore-event-venue-finder",
  "assets",
  "venues",
);
const output = path.join(root, "public", "og", "singapore-event-venue-finder.png");

const photos = [
  "gardens-by-the-bay.webp",
  "resorts-world-ballroom.webp",
  "lazarus-island.webp",
];

const photoBuffers = await Promise.all(
  photos.map((filename) =>
    sharp(path.join(venueDir, filename))
      .resize(400, 320, { fit: "cover", position: "attention" })
      .png()
      .toBuffer(),
  ),
);

const overlay = Buffer.from(`
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#050505"/>
        <stop offset="0.72" stop-color="#101010"/>
        <stop offset="1" stop-color="#171717"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="310" y="320" fill="url(#shade)"/>
    <rect width="1200" height="8" y="312" fill="#ccff00"/>
    <text x="70" y="396" fill="#ccff00" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" letter-spacing="3">ACT CREATIVE · SINGAPORE</text>
    <text x="70" y="474" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="61" font-weight="800">Singapore Event Venue Finder</text>
    <text x="70" y="536" fill="#d2d2d2" font-family="Arial, Helvetica, sans-serif" font-size="31">100+ venues · search, compare &amp; filter by area, type and capacity</text>
    <rect x="70" y="574" width="278" height="4" rx="2" fill="#ccff00"/>
  </svg>
`);

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: "#050505",
  },
})
  .composite([
    ...photoBuffers.map((input, index) => ({
      input,
      left: index * 400,
      top: 0,
    })),
    { input: overlay, left: 0, top: 0 },
  ])
  .png({
    compressionLevel: 9,
    palette: true,
    colours: 256,
    dither: 0.8,
  })
  .toFile(output);

console.log(`Generated ${output}`);
