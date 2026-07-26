import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const data = JSON.parse(
  await fs.readFile(
    path.join(publicRoot, "singapore-event-venue-finder", "venue-data.json"),
    "utf8",
  ),
);

const guides = [
  {
    slug: "sentosa",
    name: "Sentosa Event Venues",
    title: "Sentosa Event Venues: Hotels, Beaches & Attractions",
    description:
      "Compare curated Sentosa event venues including hotels, resorts, beaches, attractions, restaurants and waterfront spaces.",
    eyebrow: "Destination venues in Singapore",
    intro:
      "Sentosa offers one of Singapore's broadest venue mixes: integrated resorts, beachfront restaurants, hotels, attractions and outdoor spaces. It is especially useful when the programme needs a destination feel or several linked guest experiences.",
    planning:
      "Compare transport plans, guest movement between spaces, weather cover and production access. Capacity figures below refer to the largest recorded layout for a named space.",
    filter: (venue) => venue.area === "Sentosa",
    finderHash: "#area=Sentosa",
  },
  {
    slug: "marina-bay",
    name: "Marina Bay Event Venues",
    title: "Marina Bay Event Venues: Hotels, Halls & Waterfront Spaces",
    description:
      "Explore curated Marina Bay event venues including convention centres, hotels, theatres, rooftops and waterfront spaces.",
    eyebrow: "Central Singapore event district",
    intro:
      "Marina Bay combines large convention infrastructure with hotels, theatres, restaurants, civic spaces and waterfront settings. It suits programmes that need central access, a recognisable Singapore setting or several venue formats within one district.",
    planning:
      "Check loading access, public-space restrictions, weather exposure and how guest movement interacts with the surrounding business and tourism district.",
    filter: (venue) => venue.area === "Marina Bay",
    finderHash: "#area=Marina+Bay",
  },
  {
    slug: "outdoor",
    name: "Outdoor Event Venues",
    title: "Outdoor Event Venues in Singapore: Gardens, Beaches & Decks",
    description:
      "Compare outdoor event venues in Singapore including gardens, beaches, lawns, rooftops, pool decks and waterfront spaces.",
    eyebrow: "Open-air venue planning",
    intro:
      "Outdoor venues can create stronger destination and brand experiences, but they also require more operational planning than enclosed rooms. This guide surfaces venues with a recorded outdoor setting across Singapore.",
    planning:
      "Treat weather cover, wet-weather alternatives, sound limits, power distribution, guest shade, site protection and load-in access as early shortlist criteria.",
    filter: (venue) => (venue.settings || []).includes("Outdoor"),
    finderHash: "#quick=outdoor",
  },
  {
    slug: "hotel-ballrooms",
    name: "Singapore Hotel Ballrooms",
    title: "Singapore Hotel Ballrooms for Corporate Events & Dinners",
    description:
      "Compare Singapore hotel ballrooms for conferences, corporate dinners, receptions, weddings and brand events.",
    eyebrow: "Established indoor event infrastructure",
    intro:
      "Hotel ballrooms remain a practical choice when an event needs indoor reliability, catering infrastructure, guest accommodation and familiar conference or dinner layouts.",
    planning:
      "Compare the named ballroom rather than the hotel-wide maximum. Stage depth, production control, pre-function space, ceiling height and service access can materially change usable capacity.",
    filter: (venue) =>
      (venue.propertyTypes || []).includes("Hotel") &&
      (venue.settings || []).includes("Ballroom"),
    finderHash: "#type=Hotel&setting=Ballroom",
  },
  {
    slug: "200-guests",
    name: "Venues for 200+ Guests",
    title: "Singapore Event Venues for 200+ Guests",
    description:
      "Compare Singapore event venues with a recorded layout for at least 200 guests, across hotels, halls, restaurants and outdoor spaces.",
    eyebrow: "Medium and large event shortlist",
    intro:
      "This guide lists venues whose largest recorded layout accommodates at least 200 guests. It is a starting point for corporate events, launches, dinners, conferences and public-facing programmes.",
    planning:
      "A venue-wide maximum is not the same as a usable event capacity. Confirm the named space, layout type, staging footprint, catering plan and safety requirements before selecting a venue.",
    filter: (venue) => Number(venue.maxCapacity || 0) >= 200,
    finderHash: "#capacity=200",
  },
  {
    slug: "arts-performance",
    name: "Arts & Performance Venues",
    title: "Arts & Performance Venues in Singapore: Theatres & Arts Centres",
    description:
      "Compare Singapore theatres, concert halls, black boxes and arts centres for performances, talks, launches, conferences and creative events.",
    eyebrow: "Theatres and creative event spaces",
    intro:
      "Singapore's arts and performance venues range from major concert halls and proscenium theatres to flexible black boxes, rehearsal studios and heritage arts centres. This guide focuses on spaces designed primarily for performances and creative programmes.",
    planning:
      "Compare fixed versus retractable seating, stage dimensions, technical systems, foyer capacity, rehearsal access and production load-in. Published seating is a starting point and may change with the event configuration.",
    filter: (venue) => venue.primaryType === "Theatre / performance",
    finderHash: "#type=Theatre+%2F+performance",
  },
];

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function capacityText(venue) {
  const basis = venue.capacityBasis;
  if (!basis?.capacity) return "Capacity requires source review";
  const prefix =
    venue.capacityAuditStatus === "official"
      ? "Officially published"
      : venue.capacityAuditStatus === "reference"
        ? "Reference record"
        : "Recorded";
  return `${prefix}: up to ${Number(basis.capacity).toLocaleString("en-SG")} guests · ${basis.layout} · ${basis.space}`;
}

function score(venue) {
  return (
    (venue.dataConfidence === "high" ? 100000 : 0) +
    (venue.image ? 20000 : 0) +
    (venue.sourceUrl ? 10000 : 0) +
    Math.min(Number(venue.maxCapacity || 0), 9000)
  );
}

function card(venue) {
  const source = venue.sourceUrl || venue.website || "";
  const imageLicenseUrl = venue.imageLicenseUrl || "";
  const imageCredit = venue.imageCredit
    ? `<p class="image-credit">Image credit: ${
        imageLicenseUrl
          ? `<a href="${escapeHtml(imageLicenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(venue.imageCredit)}</a>`
          : escapeHtml(venue.imageCredit)
      }</p>`
    : "";
  const detailUrl = venue.featuredDetail
    ? `/singapore-event-venues/${venue.id}/`
    : "";
  return `
    <article class="venue-card" id="${escapeHtml(venue.id)}">
      <div class="venue-thumb">
        ${
          venue.image
            ? `${detailUrl ? `<a href="${escapeHtml(detailUrl)}" data-track-action="Reviewed venue opened" data-track-label="${escapeHtml(venue.id)}">` : ""}<img src="${escapeHtml(venue.image)}" alt="${escapeHtml(venue.name)} in ${escapeHtml(venue.area)}, Singapore" loading="lazy" decoding="async" width="560" height="350" />${detailUrl ? "</a>" : ""}`
            : `<div class="venue-location-card"><span>${escapeHtml(venue.area)}</span><strong>${escapeHtml(venue.name)}</strong><small>Location record</small></div>`
        }
        <span class="confidence-badge confidence-${escapeHtml(venue.dataConfidence)}">${venue.dataConfidence === "high" ? "Source-linked" : "Curated"}</span>
      </div>
      <div class="venue-body">
        <div class="venue-summary">
          <div class="venue-meta">
            <span class="tag accent">${escapeHtml(venue.primaryType)}</span>
            <span class="tag">${escapeHtml(venue.area)}</span>
          </div>
          <h3>${detailUrl ? `<a href="${escapeHtml(detailUrl)}" data-track-action="Reviewed venue opened" data-track-label="${escapeHtml(venue.id)}">${escapeHtml(venue.name)}</a>` : escapeHtml(venue.name)}</h3>
          <p class="venue-address">${escapeHtml(venue.address)}</p>
          <p class="venue-facts"><span>${escapeHtml(capacityText(venue))}</span></p>
          <p class="venue-note">${escapeHtml(venue.publicNote)}</p>${imageCredit}
          <div class="source-links">
            ${detailUrl ? `<a class="venue-site-link" href="${escapeHtml(detailUrl)}" data-track-action="Reviewed venue opened" data-track-label="${escapeHtml(venue.id)}">Open reviewed venue guide →</a>` : ""}
            ${source ? `<a class="venue-site-link" href="${escapeHtml(source)}" target="_blank" rel="noopener noreferrer" data-track-action="Venue source opened" data-track-label="${escapeHtml(venue.id)}">${venue.sourceType === "Official venue website" ? "Open official venue site" : "Open public source"} ↗</a>` : ""}
          </div>
        </div>
      </div>
    </article>`;
}

function renderGuide(guide) {
  const venues = data.venues
    .filter(guide.filter)
    .sort((a, b) => score(b) - score(a) || a.name.localeCompare(b.name));
  const shown = venues.slice(0, 18);
  const canonical = `https://actcreative.net/singapore-event-venues/${guide.slug}/`;
  const itemList = shown.map((venue, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: venue.name,
    url: venue.featuredDetail
      ? `https://actcreative.net/singapore-event-venues/${venue.id}/`
      : `${canonical}#${venue.id}`,
  }));

  return `<!DOCTYPE html>
<html lang="en-SG">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(guide.title)} | ACT Creative</title>
    <meta name="description" content="${escapeHtml(guide.description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(guide.title)}" />
    <meta property="og:description" content="${escapeHtml(guide.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="https://actcreative.net/og/singapore-event-venue-finder.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
    <link rel="stylesheet" href="/singapore-event-venue-finder/venue-finder.css" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <script type="application/ld+json">
    ${JSON.stringify(
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            "@id": `${canonical}#webpage`,
            url: canonical,
            name: guide.title,
            description: guide.description,
            inLanguage: "en-SG",
            dateModified: data.generatedAt,
            isPartOf: { "@id": "https://actcreative.net/#website" },
            publisher: { "@id": "https://actcreative.net/#business" },
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: shown.length,
              itemListElement: itemList,
            },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://actcreative.net/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Singapore Event Venue Finder",
                item: "https://actcreative.net/singapore-event-venue-finder/",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: guide.name,
                item: canonical,
              },
            ],
          },
        ],
      },
      null,
      2,
    )}
    </script>
    <script>
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
      if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) {
        var insightsScript = document.createElement("script");
        insightsScript.defer = true;
        insightsScript.src = "/_vercel/insights/script.js";
        document.head.appendChild(insightsScript);
      }
    </script>
  </head>
  <body class="venue-category-page" data-page-type="venue-guide" data-guide-slug="${escapeHtml(guide.slug)}">
    <div class="site-shell">
      <header class="topbar">
        <a class="brand" href="/" aria-label="ACT Creative home"><img src="/favicon-192.png" alt="ACT Creative logo" width="36" height="36" /><span>ACT Creative</span></a>
        <nav aria-label="Primary navigation"><a href="/singapore-event-venue-finder/">Venue service</a><a href="/#contact">Contact</a></nav>
      </header>
      <main>
        <section class="tool-hero">
          <div>
            <p class="eyebrow">${escapeHtml(guide.eyebrow)}</p>
            <h1>${escapeHtml(guide.title)}</h1>
            <p class="lede">${escapeHtml(guide.intro)}</p>
          </div>
        </section>
        <section class="planning-strip category-summary">
          <div><span class="section-kicker">${venues.length} matching records</span><h2>How to use this shortlist</h2></div>
          <p>${escapeHtml(guide.planning)}</p>
        </section>
        <div class="category-actions">
          <a class="button primary" href="/singapore-event-venue-finder/${guide.finderHash}" data-track-action="Filtered finder opened" data-track-label="${escapeHtml(guide.slug)}">Open on venue map</a>
          <a class="button secondary" href="/singapore-event-venue-finder/#venue-brief-form" data-track-action="Venue sourcing opened" data-track-label="${escapeHtml(guide.slug)}">Request a reviewed shortlist</a>
        </div>
        <section aria-labelledby="venue-list-title">
          <div class="result-header"><div><span class="section-kicker">Curated public records</span><h2 id="venue-list-title">${shown.length} venue options to compare</h2></div></div>
          <div class="result-list">${shown.map(card).join("")}</div>
        </section>
        <section class="data-methodology">
          <div><span class="section-kicker">Data notes</span><h2>Capacity is layout-specific</h2></div>
          <div class="methodology-grid">
            <p><strong>Recorded layouts</strong>Capacity refers to the largest named public setup in the current venue record.</p>
            <p><strong>Source review</strong>Source-linked records include a public venue website or reference source and a review date.</p>
            <p><strong>Final checks</strong>Commercial terms, schedules and site-specific restrictions are reviewed separately.</p>
          </div>
        </section>
      </main>
      <footer><span>&copy; 2026 ACT Creative Pte. Ltd. - Singapore</span><span><a href="/singapore-event-venue-finder/">Venue service</a> · <a href="mailto:contact@actcreative.net">contact@actcreative.net</a></span></footer>
    </div>
    <script src="/inquiry-attribution.js" defer></script>
    <script src="/venue-detail-tracking.js" defer></script>
  </body>
</html>`;
}

for (const guide of guides) {
  const directory = path.join(
    publicRoot,
    "singapore-event-venues",
    guide.slug,
  );
  await fs.mkdir(directory, { recursive: true });
  const html = renderGuide(guide).replace(/[ \t]+$/gm, "");
  await fs.writeFile(path.join(directory, "index.html"), html, "utf8");
  console.log(`Generated ${guide.slug}`);
}
