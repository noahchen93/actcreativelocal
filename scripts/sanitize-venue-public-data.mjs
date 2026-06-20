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

const sensitiveNotePattern =
  /(?:\bavailability\b|\bavailable dates?\b|\bdate holds?\b|\bafter[- ]hours\b|\bweekdays?\b|\bweekends?\b|\bminimum spend\b|\bpricing\b|\bprices?\b|\bcosts?\b|\bfees?\b|\brates?\b|\bquotes?\b|s\$|\$\s*\d|档期|可用日期|最低消费|价格|费用|报价|营业时间)/i;

function sanitizePublicNote(note) {
  const firstSentence = String(note || "")
    .replace(
      /\s*Confirm the exact space, setup rules and current availability before booking\.\s*$/i,
      "",
    )
    .replace(
      /(?:\s*Review the exact space and setup requirements with the venue team\.\s*)+$/i,
      "",
    )
    .trim();
  if (!firstSentence) return "";
  return `${firstSentence} Review the exact space and setup requirements with the venue team.`;
}

const dataset = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
dataset.privacyNote =
  "This public dataset contains venue identity, planning tags, capacity signals and map coordinates only.";

for (const venue of dataset.venues || []) {
  delete venue.hours;
  delete venue.priceSignal;
  venue.publicNote = sanitizePublicNote(venue.publicNote);

  for (const space of venue.spaces || []) {
    space.name = String(space.name || "")
      .replace(/\s*\(after hours\)\s*/gi, " ")
      .replace(/\bafter[- ]hours\b/gi, "private")
      .replace(/\s+/g, " ")
      .trim();
    if (sensitiveNotePattern.test(space.note || "")) {
      space.note = "";
    }
  }
}

await fs.writeFile(DATA_PATH, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
console.log(`sanitized ${dataset.venues.length} public venue records`);
