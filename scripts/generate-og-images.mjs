import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public', 'og');

const sources = {
  bigWorld: 'public/case-studies/images/big-big-world.webp',
  pacman: 'public/case-studies/images/pacman-friends.webp',
  wings: 'public/case-studies/images/wings-of-art.webp',
  k11: 'public/case-studies/images/k11-shenyang.webp',
  hofman: 'public/case-studies/images/florentijn-hofman.webp',
  craigKarl: 'public/case-studies/images/craig-karl.webp',
  sourcing: 'public/blog/assets/linkedin-sourcing-solutions.jpg',
  holiday: 'public/holiday-decorations-singapore/assets/holiday-hero.webp',
};

const cards = [
  {
    slug: 'event-fabrication-singapore',
    image: sources.bigWorld,
    title: 'Event Fabrication Singapore',
    subtitle: 'Custom props, scenic builds, booth components and China production support.',
  },
  {
    slug: 'custom-props-singapore',
    image: sources.wings,
    title: 'Custom Props Singapore',
    subtitle: 'Oversized objects, themed decor, stage dressing and campaign display pieces.',
  },
  {
    slug: 'frp-sculpture-fabrication-singapore',
    image: sources.hofman,
    title: 'FRP Sculpture Fabrication',
    subtitle: 'Fiberglass sculptures and installation pieces for retail, public art and events.',
  },
  {
    slug: 'exhibition-booth-production-singapore',
    image: sources.k11,
    title: 'Exhibition Booth Production',
    subtitle: 'Booth structures, counters, signage, plinths and modular exhibition components.',
  },
  {
    slug: 'china-event-production-support',
    image: sources.sourcing,
    title: 'China Event Production Support',
    subtitle: 'Supplier matching, samples, quality checks, packing and cross-border shipping.',
  },
  {
    slug: 'event-merchandise-sourcing',
    image: sources.sourcing,
    title: 'Event Merchandise Sourcing',
    subtitle: 'Campaign giveaways, launch kits, press boxes and branded event utilities.',
  },
  {
    slug: 'trade-show-booth-singapore',
    image: sources.k11,
    title: 'Trade Show Booth Singapore',
    subtitle: 'Custom booth design, fabrication and on-site setup for major Singapore venues.',
  },
  {
    slug: 'roadshow-production-singapore',
    image: sources.pacman,
    title: 'Roadshow Production Singapore',
    subtitle: 'Modular roadshow sets, signage, props and repeatable brand campaign builds.',
  },
  {
    slug: 'retail-mall-activation-singapore',
    image: sources.pacman,
    title: 'Retail Mall Activation Singapore',
    subtitle: 'Pop-ups, atrium installations, photo moments and themed retail fabrication.',
  },
  {
    slug: 'zh-event-fabrication-singapore',
    image: sources.bigWorld,
    title: 'Singapore Event Fabrication',
    subtitle: 'Bilingual production support for Singapore activations and China-side builds.',
  },
  {
    slug: 'zh-china-event-production-support',
    image: sources.sourcing,
    title: 'China Production Support',
    subtitle: 'Factory coordination, sampling, quality checks and shipping for SEA agencies.',
  },
  {
    slug: 'holiday-decorations-singapore',
    image: sources.holiday,
    title: 'Holiday Decorations Singapore',
    subtitle: 'Christmas, New Year and CNY decor with local installation.',
  },
];

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const wrapWords = (text, maxChars) => {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
};

const renderText = ({ title, subtitle }) => {
  const titleLines = wrapWords(title, 24).slice(0, 3);
  const subtitleLines = wrapWords(subtitle, 58).slice(0, 3);

  const titleSvg = titleLines
    .map((line, index) => `<tspan x="72" dy="${index === 0 ? 0 : 76}">${escapeXml(line)}</tspan>`)
    .join('');
  const subtitleSvg = subtitleLines
    .map((line, index) => `<tspan x="72" dy="${index === 0 ? 0 : 34}">${escapeXml(line)}</tspan>`)
    .join('');

  return Buffer.from(`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#000000" stop-opacity="0.92"/>
          <stop offset="0.56" stop-color="#000000" stop-opacity="0.72"/>
          <stop offset="1" stop-color="#000000" stop-opacity="0.22"/>
        </linearGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#000000" stop-opacity="0"/>
          <stop offset="1" stop-color="#000000" stop-opacity="0.68"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#shade)"/>
      <rect width="1200" height="630" fill="url(#floor)"/>
      <rect x="72" y="74" width="142" height="8" rx="4" fill="#CCFF00"/>
      <text x="72" y="132" fill="#CCFF00" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="800" letter-spacing="4">ACT CREATIVE</text>
      <text x="72" y="300" fill="#FFFFFF" font-family="Inter, Arial, sans-serif" font-size="68" font-weight="800">${titleSvg}</text>
      <text x="72" y="475" fill="#DADADA" font-family="Inter, Arial, sans-serif" font-size="29" font-weight="500">${subtitleSvg}</text>
      <text x="72" y="565" fill="#CCFF00" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700">Singapore | Southeast Asia | China Production</text>
    </svg>
  `);
};

await fs.mkdir(outDir, { recursive: true });

for (const card of cards) {
  const sourcePath = path.join(root, card.image);
  const outputPath = path.join(outDir, `${card.slug}.png`);
  const overlay = renderText(card);

  await sharp(sourcePath)
    .resize(1200, 630, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.82, saturation: 0.86 })
    .composite([{ input: overlay, top: 0, left: 0 }])
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(outputPath);

  const size = (await fs.stat(outputPath)).size;
  console.log(`${path.relative(root, outputPath)} ${(size / 1024).toFixed(0)} KB`);
}
