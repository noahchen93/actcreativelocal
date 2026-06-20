import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const dataset = JSON.parse(
  await fs.readFile(
    path.join(publicRoot, "singapore-event-venue-finder", "venue-data.json"),
    "utf8",
  ),
);
const audit = JSON.parse(
  await fs.readFile(
    path.join(root, "scripts", "cache", "featured-venue-audit.json"),
    "utf8",
  ),
);
const auditById = new Map(audit.venues.map((venue) => [venue.id, venue]));
const venueById = new Map(dataset.venues.map((venue) => [venue.id, venue]));
const capacityFields = ["banquet", "cocktail", "theatre", "classroom"];

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function label(value) {
  return String(value || "")
    .replace(/(^|\s)\S/g, (letter) => letter.toUpperCase())
    .replace("Published Total", "Published total");
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-SG");
}

function largestRecordedCapacity(space) {
  return Math.max(...capacityFields.map((field) => Number(space[field] || 0)));
}

function normaliseName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function capacityCell(value) {
  return value ? formatNumber(value) : "—";
}

function relatedVenues(venue) {
  return dataset.venues
    .filter(
      (candidate) =>
        candidate.id !== venue.id &&
        candidate.featuredDetail &&
        (candidate.area === venue.area ||
          candidate.primaryType === venue.primaryType),
    )
    .sort(
      (a, b) =>
        Number(b.area === venue.area) - Number(a.area === venue.area) ||
        Number(b.dataConfidence === "high") -
          Number(a.dataConfidence === "high") ||
        a.name.localeCompare(b.name),
    )
    .slice(0, 3);
}

function renderRelatedCard(venue) {
  return `
    <a class="related-venue-card" href="/singapore-event-venues/${escapeHtml(venue.id)}/" data-track-action="Related venue opened" data-track-label="${escapeHtml(venue.id)}">
      <img src="${escapeHtml(venue.image)}" alt="${escapeHtml(venue.name)} in ${escapeHtml(venue.area)}, Singapore" loading="lazy" decoding="async" width="420" height="260" />
      <span>${escapeHtml(venue.area)}</span>
      <strong>${escapeHtml(venue.name)}</strong>
      <small>${escapeHtml(venue.primaryType)}</small>
    </a>`;
}

function renderPage(venue, venueAudit) {
  const canonical = `https://actcreative.net/singapore-event-venues/${venue.id}/`;
  const sourceUrl =
    venue.capacitySourceUrl || venue.sourceUrl || venue.website || "";
  const isOfficial = venue.capacityAuditStatus === "official";
  const basis = venue.capacityBasis;
  const capacityHeading = isOfficial
    ? `Officially published: up to ${formatNumber(basis.capacity)}`
    : `Reference record: up to ${formatNumber(basis.capacity)}`;
  const capacityExplanation = isOfficial
    ? `${basis.space} is publicly listed for up to ${formatNumber(basis.capacity)} guests in ${label(basis.layout)} format.`
    : `The current public source confirms the venue, but not a sufficiently clear current maximum for the recorded layout. Treat ${formatNumber(basis.capacity)} as a planning reference and confirm it directly.`;
  const basisName = normaliseName(basis.space);
  let topSpaces = [...(venue.spaces || [])]
    .filter(
      (space) =>
        !isOfficial ||
        largestRecordedCapacity(space) <= Number(basis.capacity) ||
        normaliseName(space.name) === basisName,
    )
    .map((space) => {
      if (!isOfficial || normaliseName(space.name) !== basisName) return space;
      const reviewedSpace = { ...space };
      for (const field of capacityFields) {
        if (Number(reviewedSpace[field] || 0) > Number(basis.capacity)) {
          reviewedSpace[field] = null;
        }
      }
      if (capacityFields.includes(basis.layout)) {
        reviewedSpace[basis.layout] = basis.capacity;
      }
      return reviewedSpace;
    })
    .sort(
      (a, b) =>
        largestRecordedCapacity(b) - largestRecordedCapacity(a) ||
        String(a.name).localeCompare(String(b.name)),
    );
  if (isOfficial && capacityFields.includes(basis.layout)) {
    const basisIndex = topSpaces.findIndex(
      (space) => normaliseName(space.name) === basisName,
    );
    const basisSpace =
      basisIndex >= 0
        ? topSpaces.splice(basisIndex, 1)[0]
        : {
            name: basis.space,
            banquet: null,
            cocktail: null,
            theatre: null,
            classroom: null,
          };
    basisSpace[basis.layout] = basis.capacity;
    topSpaces.unshift(basisSpace);
  }
  topSpaces = topSpaces.slice(0, 8);
  const related = relatedVenues(venue);
  const description = `${venue.name} event venue guide: reviewed capacity context, recorded spaces, planning considerations and official source links for Singapore event teams.`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: `${venue.name} Event Venue Singapore`,
        description,
        inLanguage: "en-SG",
        dateModified: audit.reviewedAt,
        isPartOf: { "@id": "https://actcreative.net/#website" },
        publisher: { "@id": "https://actcreative.net/#business" },
        mainEntity: { "@id": `${canonical}#venue` },
      },
      {
        "@type": "Place",
        "@id": `${canonical}#venue`,
        name: venue.name,
        description: venueAudit.auditSummary,
        address: {
          "@type": "PostalAddress",
          streetAddress: venue.address,
          addressCountry: "SG",
        },
        geo:
          Number.isFinite(venue.lat) && Number.isFinite(venue.lng)
            ? {
                "@type": "GeoCoordinates",
                latitude: venue.lat,
                longitude: venue.lng,
              }
            : undefined,
        image: `https://actcreative.net${venue.image}`,
        url: canonical,
        sameAs: sourceUrl ? [sourceUrl] : undefined,
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
            name: venue.name,
            item: canonical,
          },
        ],
      },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en-SG">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(venue.name)} Event Venue Singapore: Capacity & Spaces | ACT Creative</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta name="robots" content="index,follow,max-image-preview:large" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(venue.name)} Event Venue Singapore" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="https://actcreative.net${escapeHtml(venue.image)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" />
    <link rel="stylesheet" href="/singapore-event-venue-finder/venue-finder.css" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <script type="application/ld+json">
    ${JSON.stringify(schema, null, 2)}
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
  <body class="venue-detail-page" data-venue-id="${escapeHtml(venue.id)}" data-venue-name="${escapeHtml(venue.name)}">
    <div class="site-shell">
      <header class="topbar">
        <a class="brand" href="/" aria-label="ACT Creative home"><img src="/favicon-192.png" alt="ACT Creative logo" width="36" height="36" /><span>ACT Creative</span></a>
        <nav aria-label="Primary navigation"><a href="/singapore-event-venue-finder/">Venue finder</a><a href="/singapore-event-venue-sourcing/">Venue sourcing</a><a href="/#contact">Contact</a></nav>
      </header>
      <main>
        <nav class="detail-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a><span>/</span><a href="/singapore-event-venue-finder/">Venue finder</a><span>/</span><span>${escapeHtml(venue.name)}</span>
        </nav>
        <section class="venue-detail-hero">
          <div class="venue-detail-copy">
            <p class="eyebrow">Reviewed Singapore venue guide</p>
            <h1>${escapeHtml(venue.name)}</h1>
            <p class="lede">${escapeHtml(venueAudit.auditSummary)}</p>
            <div class="venue-meta">
              <span class="tag accent">${escapeHtml(venue.primaryType)}</span>
              <span class="tag">${escapeHtml(venue.area)}</span>
              <span class="tag">${isOfficial ? "Official capacity source" : "Reference capacity record"}</span>
            </div>
            <p class="venue-detail-address">${escapeHtml(venue.address)}</p>
            <div class="category-actions">
              <a class="button primary" href="/singapore-event-venue-finder/#q=${encodeURIComponent(venue.name)}" data-track-action="Venue finder opened" data-track-label="${escapeHtml(venue.id)}">Compare in venue finder</a>
              <a class="button secondary" href="/singapore-event-venue-sourcing/#venue-brief-form" data-track-action="Venue sourcing opened" data-track-label="${escapeHtml(venue.id)}">Request a reviewed shortlist</a>
            </div>
          </div>
          <figure class="venue-detail-image">
            <img src="${escapeHtml(venue.image)}" alt="${escapeHtml(venue.name)} event venue in ${escapeHtml(venue.area)}, Singapore" width="960" height="640" fetchpriority="high" decoding="async" />
            <figcaption>Venue image linked to the public venue record.</figcaption>
          </figure>
        </section>

        <section class="capacity-audit-card">
          <div>
            <span class="section-kicker">${isOfficial ? "Official public benchmark" : "Capacity review status"}</span>
            <h2>${escapeHtml(capacityHeading)}</h2>
            <p>${escapeHtml(capacityExplanation)}</p>
          </div>
          <dl>
            <div><dt>Named space</dt><dd>${escapeHtml(basis.space)}</dd></div>
            <div><dt>Layout</dt><dd>${escapeHtml(label(basis.layout))}</dd></div>
            <div><dt>Reviewed</dt><dd>${escapeHtml(audit.reviewedAt)}</dd></div>
          </dl>
          ${sourceUrl ? `<a class="venue-site-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer" data-track-action="Official source opened" data-track-label="${escapeHtml(venue.id)}">Open ${isOfficial ? "capacity" : "venue"} source ↗</a>` : ""}
        </section>

        <section class="detail-section">
          <div class="detail-section-heading">
            <div><span class="section-kicker">Recorded spaces</span><h2>Space and layout comparison</h2></div>
            <p>${isOfficial ? "Records that conflict with the reviewed official benchmark are omitted here." : "These are planning records, not booking guarantees."} Confirm the current floor plan, production footprint and permitted layout with the venue.</p>
          </div>
          <div class="space-table-wrap">
            <table class="space-table">
              <thead><tr><th>Space</th><th>Banquet</th><th>Cocktail</th><th>Theatre</th><th>Classroom</th></tr></thead>
              <tbody>
                ${topSpaces
                  .map(
                    (space) => `<tr>
                      <th scope="row">${escapeHtml(space.name)}</th>
                      <td>${capacityCell(space.banquet)}</td>
                      <td>${capacityCell(space.cocktail)}</td>
                      <td>${capacityCell(space.theatre)}</td>
                      <td>${capacityCell(space.classroom)}</td>
                    </tr>`,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>

        <section class="detail-two-column">
          <div class="detail-panel">
            <span class="section-kicker">Best fit</span>
            <h2>Useful event formats</h2>
            <ul class="detail-check-list">${venueAudit.bestFor.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
          <div class="detail-panel">
            <span class="section-kicker">Before shortlisting</span>
            <h2>Planning considerations</h2>
            <ul class="detail-check-list">${venueAudit.planningConsiderations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </div>
        </section>

        <section class="data-methodology">
          <div><span class="section-kicker">How to read this page</span><h2>Transparent capacity context</h2></div>
          <div class="methodology-grid">
            <p><strong>Official benchmark</strong>${isOfficial ? "A named public source supports the highlighted capacity and layout." : "No sufficiently clear current maximum was found on the reviewed public page."}</p>
            <p><strong>Recorded spaces</strong>Other figures are comparison records and may come from earlier room charts or source material.</p>
            <p><strong>Final verification</strong>Ask the venue to confirm the current floor plan, operating restrictions and usable capacity for the proposed production.</p>
          </div>
        </section>

        ${
          related.length
            ? `<section class="detail-section">
                <div class="detail-section-heading"><div><span class="section-kicker">Related reviewed venues</span><h2>Continue comparing</h2></div></div>
                <div class="related-venue-grid">${related.map(renderRelatedCard).join("")}</div>
              </section>`
            : ""
        }

        <section class="cta-panel">
          <div><span class="section-kicker">Need a practical venue check?</span><h2>Turn venue records into a workable shortlist.</h2><p>ACT Creative can review venue fit, production access, guest flow and the questions to raise before requesting a quote.</p></div>
          <div class="cta-actions">
            <a class="button primary" href="https://wa.me/6584515268?text=Hello%20ACT%20Creative%2C%20I%20would%20like%20help%20reviewing%20${encodeURIComponent(venue.name)}%20for%20an%20event." data-inquiry-link="whatsapp" data-track-action="WhatsApp venue enquiry" data-track-label="${escapeHtml(venue.id)}">Discuss this venue</a>
            <a class="button secondary" href="/singapore-event-venue-sourcing/#venue-brief-form" data-track-action="Venue brief opened" data-track-label="${escapeHtml(venue.id)}">Send a venue brief</a>
          </div>
        </section>
      </main>
      <footer><span>&copy; 2026 ACT Creative Pte. Ltd. - Singapore</span><span><a href="/singapore-event-venue-finder/">Venue finder</a> · <a href="mailto:contact@actcreative.net">contact@actcreative.net</a></span></footer>
    </div>
    <script src="/inquiry-attribution.js" defer></script>
    <script src="/venue-detail-tracking.js" defer></script>
  </body>
</html>`;
}

for (const venueAudit of audit.venues) {
  const venue = venueById.get(venueAudit.id);
  if (!venue) {
    throw new Error(`Featured venue is missing from public data: ${venueAudit.id}`);
  }
  const directory = path.join(
    publicRoot,
    "singapore-event-venues",
    venue.id,
  );
  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(
    path.join(directory, "index.html"),
    renderPage(venue, venueAudit).replace(/[ \t]+$/gm, ""),
    "utf8",
  );
  console.log(`Generated venue detail: ${venue.id}`);
}
