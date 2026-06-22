import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import * as cheerio from "cheerio";
import { embedTexts } from "./lib/local-ai-rag.mjs";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const MANUAL_DOCUMENTS_DIR = path.join(ROOT, "local-ai", "knowledge", "documents");
const INDEX_DIR = path.join(ROOT, "local-ai", "knowledge", "index");
const INDEX_PATH = path.join(INDEX_DIR, "act-creative-rag-index.json");
const OLLAMA_URL = (process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
const EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || "act-rag-embedding";
const EMBEDDING_BATCH_SIZE = 12;
const MAX_CHUNK_CHARS = 1_500;
const CHUNK_OVERLAP_CHARS = 180;
const SUPPORTED_MANUAL_EXTENSIONS = new Set([".md", ".txt", ".html", ".htm", ".json"]);

function normalizeWhitespace(value) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function uniqueLines(lines) {
  const seen = new Set();
  return lines.filter((line) => {
    const normalized = normalizeWhitespace(line);
    if (!normalized || normalized.length < 2 || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function extractHtmlDocument(html, fallbackTitle, sourceUrl) {
  const $ = cheerio.load(html);
  const title =
    normalizeWhitespace($("h1").first().text()) ||
    normalizeWhitespace($("title").first().text()) ||
    fallbackTitle;
  const description = normalizeWhitespace(
    $('meta[name="description"]').attr("content") || "",
  );

  $("script, style, noscript, svg, nav, header, footer, form, button").remove();

  let contentRoot = $("main").first();
  if (!contentRoot.length || !normalizeWhitespace(contentRoot.text())) {
    contentRoot = $(".seo-fallback").first();
  }
  if (!contentRoot.length || !normalizeWhitespace(contentRoot.text())) {
    contentRoot = $("body").first();
  }

  const lines = [];
  contentRoot.find("h1, h2, h3, h4, p, li, dt, dd, figcaption").each((_, element) => {
    const text = normalizeWhitespace($(element).text());
    if (text) lines.push(text);
  });

  const text = normalizeWhitespace(
    uniqueLines([title, description, ...lines]).join("\n\n"),
  );

  return { title, description, text, url: sourceUrl };
}

function urlFromPublicPath(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/").replace(/\/index\.html$/, "/");
  return `https://actcreative.net/${normalized === "index.html" ? "" : normalized}`;
}

function categoryFromPath(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  if (normalized.includes("/case-studies/") || normalized.startsWith("case-studies/")) {
    return "cases";
  }
  if (normalized.includes("venue")) return "venues";
  if (normalized.includes("about") || normalized === "index.html") return "company";
  if (normalized.startsWith("blog/")) return "company";
  return "services";
}

function shouldIndexWebsitePage(relativePath) {
  const normalized = relativePath.replace(/\\/g, "/");
  if (!normalized.endsWith("/index.html") && normalized !== "index.html") return false;
  if (normalized.startsWith("singapore-event-venues/")) return false;

  const segments = normalized.split("/");
  return (
    normalized === "index.html" ||
    segments.length === 2 ||
    normalized.startsWith("case-studies/") ||
    normalized.startsWith("blog/") ||
    (normalized.startsWith("zh/") && segments.length <= 4)
  );
}

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );
  return nested.flat();
}

async function loadWebsiteDocuments() {
  const publicFiles = await listFiles(PUBLIC_DIR);
  const websitePaths = [
    path.join(ROOT, "index.html"),
    ...publicFiles.filter((filePath) => path.basename(filePath) === "index.html"),
  ];
  const documents = [];

  for (const filePath of websitePaths) {
    const relativePath =
      filePath === path.join(ROOT, "index.html")
        ? "index.html"
        : path.relative(PUBLIC_DIR, filePath);

    if (!shouldIndexWebsitePage(relativePath)) continue;

    const html = await fs.readFile(filePath, "utf8");
    const sourceUrl = urlFromPublicPath(relativePath);
    const extracted = extractHtmlDocument(
      html,
      path.basename(path.dirname(filePath)),
      sourceUrl,
    );

    if (extracted.text.length < 80) continue;

    documents.push({
      id: `website:${relativePath.replace(/\\/g, "/")}`,
      sourceType: "website",
      category: categoryFromPath(relativePath),
      filePath: path.relative(ROOT, filePath).replace(/\\/g, "/"),
      ...extracted,
    });
  }

  return documents;
}

async function loadManualDocuments() {
  const files = await listFiles(MANUAL_DOCUMENTS_DIR);
  const documents = [];

  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();
    if (!SUPPORTED_MANUAL_EXTENSIONS.has(extension)) continue;
    if (path.basename(filePath).toLowerCase() === "readme.md") continue;

    const relativePath = path.relative(MANUAL_DOCUMENTS_DIR, filePath).replace(/\\/g, "/");
    const category = relativePath.split("/")[0] || "company";
    const raw = await fs.readFile(filePath, "utf8");
    let title = path.basename(filePath, extension);
    let text = raw;

    if (extension === ".html" || extension === ".htm") {
      const extracted = extractHtmlDocument(raw, title, `local://${relativePath}`);
      title = extracted.title;
      text = extracted.text;
    } else if (extension === ".json") {
      text = JSON.stringify(JSON.parse(raw), null, 2);
    } else {
      const heading = raw.match(/^#\s+(.+)$/m);
      if (heading) title = normalizeWhitespace(heading[1]);
    }

    text = normalizeWhitespace(`${title}\n\n${text}`);
    if (text.length < 40) continue;

    documents.push({
      id: `manual:${relativePath}`,
      sourceType: "manual",
      category,
      filePath: path.relative(ROOT, filePath).replace(/\\/g, "/"),
      title,
      description: "",
      text,
      url: "",
    });
  }

  return documents;
}

function splitIntoChunks(document) {
  const paragraphs = document.text.split(/\n{2,}/).filter(Boolean);
  const chunks = [];
  let current = "";

  const pushChunk = () => {
    const text = normalizeWhitespace(current);
    if (!text) return;
    chunks.push(text);
    current = text.slice(-CHUNK_OVERLAP_CHARS);
  };

  for (const paragraph of paragraphs) {
    if (paragraph.length > MAX_CHUNK_CHARS) {
      if (current) pushChunk();
      for (let start = 0; start < paragraph.length; start += MAX_CHUNK_CHARS - CHUNK_OVERLAP_CHARS) {
        chunks.push(paragraph.slice(start, start + MAX_CHUNK_CHARS));
      }
      current = "";
      continue;
    }

    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;
    if (candidate.length > MAX_CHUNK_CHARS) {
      pushChunk();
      current = `${current}\n\n${paragraph}`;
    } else {
      current = candidate;
    }
  }

  if (current) {
    const finalText = normalizeWhitespace(current);
    if (finalText) chunks.push(finalText);
  }

  return chunks.map((text, index) => ({
    id: createHash("sha256").update(`${document.id}:${index}:${text}`).digest("hex").slice(0, 20),
    documentId: document.id,
    chunkIndex: index,
    title: document.title,
    url: document.url,
    category: document.category,
    sourceType: document.sourceType,
    text,
  }));
}

async function main() {
  console.log(`Embedding model: ${EMBEDDING_MODEL}`);
  const [websiteDocuments, manualDocuments] = await Promise.all([
    loadWebsiteDocuments(),
    loadManualDocuments(),
  ]);
  const documents = [...websiteDocuments, ...manualDocuments];
  const chunks = documents.flatMap(splitIntoChunks);

  console.log(`Documents: ${documents.length}`);
  console.log(`Chunks: ${chunks.length}`);

  for (let start = 0; start < chunks.length; start += EMBEDDING_BATCH_SIZE) {
    const batch = chunks.slice(start, start + EMBEDDING_BATCH_SIZE);
    const embeddings = await embedTexts({
      ollamaUrl: OLLAMA_URL,
      model: EMBEDDING_MODEL,
      inputs: batch.map((chunk) => chunk.text),
      keepAlive: "24h",
    });

    embeddings.forEach((embedding, index) => {
      batch[index].embedding = embedding;
    });
    console.log(`Embedded ${Math.min(start + batch.length, chunks.length)}/${chunks.length}`);
  }

  const index = {
    version: 1,
    generatedAt: new Date().toISOString(),
    embeddingModel: EMBEDDING_MODEL,
    documentCount: documents.length,
    chunkCount: chunks.length,
    documents: documents.map(({ text, ...document }) => document),
    chunks,
  };

  await fs.mkdir(INDEX_DIR, { recursive: true });
  await fs.writeFile(INDEX_PATH, JSON.stringify(index), "utf8");
  console.log(`Wrote ${path.relative(ROOT, INDEX_PATH)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
