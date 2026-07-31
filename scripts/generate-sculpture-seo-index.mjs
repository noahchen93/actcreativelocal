import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";

const root = process.cwd();
const pagePath = path.join(
  root,
  "public/frp-sculpture-fabrication-singapore/index.html",
);
const dataPath = path.join(
  root,
  "public/frp-sculpture-fabrication-singapore/data/projects.js",
);
const startMarker = "<!-- SCULPTURE_SEO_INDEX_START -->";
const endMarker = "<!-- SCULPTURE_SEO_INDEX_END -->";

const categoryMetadata = [
  ["large-scale", "Large-scale sculptures and brand installations"],
  ["public-art", "Public art and exhibition fabrication"],
  ["museum", "Museum and institutional displays"],
  ["spatial-frp", "Commercial FRP seating, planters and spatial objects"],
  ["stainless-steel", "Stainless-steel and mirror-finish sculpture"],
  ["multi-material", "Multi-material and specialist sculpture processes"],
  ["small-scale", "Decorative objects and export projects"],
  ["collectibles", "Collectibles and batch production"],
  ["special-finish", "Special finishes and material effects"],
];

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const projectScript = await readFile(dataPath, "utf8");
const context = { window: {} };
vm.runInNewContext(projectScript, context, { filename: dataPath });

const projects = context.window.ACT_CREATIVE_PROJECTS;
if (!Array.isArray(projects) || projects.length === 0) {
  throw new Error("Sculpture project data did not expose any projects.");
}

const indexableProjects = projects.filter(
  (project) =>
    !/^Decorative Sculpture Project/.test(project.title) &&
    project.client !== "Project Name Pending",
);

const renderProject = (project) => {
  const client =
    project.client === "Manufacturing Network Reference"
      ? "Integrated production capability"
      : project.client;
  const location =
    project.location === "To Be Confirmed"
      ? "Location available on request"
      : project.location;
  const image = `/frp-sculpture-fabrication-singapore/${project.images[0]}`;
  const tags = project.tags
    .map((tag) => `<li>${escapeHtml(tag)}</li>`)
    .join("");

  return `
            <article class="seo-project-card" id="portfolio-${escapeHtml(project.id)}">
              <img src="${escapeHtml(image)}" alt="${escapeHtml(project.title)} sculpture fabrication reference" width="1200" height="900" loading="lazy" />
              <div>
                <p class="seo-project-meta">${escapeHtml(client)} &middot; ${escapeHtml(location)}</p>
                <h3>${escapeHtml(project.title)}</h3>
                <p>${escapeHtml(project.summary)}</p>
                <ul class="seo-project-tags" aria-label="Materials and project type">${tags}</ul>
              </div>
            </article>`;
};

const categorySections = categoryMetadata
  .map(([category, title]) => {
    const categoryProjects = indexableProjects.filter(
      (project) => project.category === category,
    );
    if (categoryProjects.length === 0) return "";

    return `
        <section class="seo-portfolio-category" id="portfolio-${category}" aria-labelledby="portfolio-${category}-title">
          <h2 id="portfolio-${category}-title">${escapeHtml(title)}</h2>
          <p>${categoryProjects.length} named references covering project type, application, production route and finish.</p>
          <div class="seo-project-grid">${categoryProjects.map(renderProject).join("")}
          </div>
        </section>`;
  })
  .join("");

const categoryLinks = categoryMetadata
  .filter(([category]) =>
    indexableProjects.some((project) => project.category === category),
  )
  .map(
    ([category, title]) =>
      `<a href="#portfolio-${category}">${escapeHtml(title)}</a>`,
  )
  .join("");

const generatedBlock = `${startMarker}
      <main class="seo-fallback">
        <p class="seo-eyebrow">ACT Creative sculpture solutions</p>
        <h1>Custom sculpture fabrication for Singapore and international projects</h1>
        <p>ACT Creative is a Singapore-facing systems and solutions integration platform. We translate each sculpture brief into the right production route, then coordinate technical review, sampling, fabrication, quality checks, export packing, freight, Singapore delivery and installation readiness through one accountable project team.</p>
        <div class="seo-fallback-actions">
          <a href="https://wa.me/6584515268?text=Hi%20ACT%20Creative%2C%20I%20would%20like%20to%20discuss%20a%20custom%20sculpture%20project." data-act-event="Inquiry CTA selected" data-act-label="sculpture_fallback_whatsapp">Request a sculpture quotation</a>
          <a href="mailto:contact@actcreative.net?subject=Custom%20Sculpture%20Project%20Inquiry" data-act-event="Inquiry CTA selected" data-act-label="sculpture_fallback_email">Email drawings or references</a>
        </div>
        <section class="seo-scope-summary" aria-labelledby="sculpture-scope-title">
          <h2 id="sculpture-scope-title">One project team across material, factory and delivery decisions</h2>
          <ul>
            <li>FRP and fiberglass sculpture, character forms, commercial furniture and planters</li>
            <li>Stainless-steel, mirror-polished, electroplated and figurative metal sculpture</li>
            <li>Public art, museum displays, reliefs, water features and large-format 3D printing</li>
            <li>Supplier comparison, sample review, production reporting, export packing and international logistics</li>
          </ul>
        </section>
        <nav class="seo-portfolio-nav" aria-label="Sculpture portfolio categories">${categoryLinks}</nav>
        <section aria-labelledby="portfolio-index-title">
          <h2 id="portfolio-index-title">Searchable sculpture portfolio index</h2>
          <p>${indexableProjects.length} named and representative projects are indexed below from ${projects.length} total visual references. Project media demonstrates the production capabilities ACT Creative can integrate; final materials, engineering, supplier route and delivery scope are confirmed against each brief.</p>
        </section>${categorySections}
        <section class="seo-scope-summary" aria-labelledby="related-sculpture-services-title">
          <h2 id="related-sculpture-services-title">Related fabrication routes</h2>
          <p><a href="/custom-props-singapore/">Custom event props</a> are best for temporary campaign objects and photo moments. <a href="/event-fabrication-singapore/">Event fabrication</a> is best when several scenic, interactive and display elements must be coordinated as one site-ready build.</p>
        </section>
      </main>
      ${endMarker}`;

const page = await readFile(pagePath, "utf8");
const startIndex = page.indexOf(startMarker);
const endIndex = page.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
  throw new Error("Sculpture SEO index markers are missing or out of order.");
}

const updated =
  page.slice(0, startIndex) +
  generatedBlock +
  page.slice(endIndex + endMarker.length);

await writeFile(pagePath, updated, "utf8");
console.log(
  `Generated sculpture SEO index: ${indexableProjects.length} named projects from ${projects.length} total references.`,
);
