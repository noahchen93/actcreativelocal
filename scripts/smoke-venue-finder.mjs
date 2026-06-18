import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "playwright";

const HOST = "127.0.0.1";
const PORT = 5191;
const BASE_URL =
  process.env.VENUE_FINDER_BASE_URL ||
  `http://${HOST}:${PORT}/singapore-event-venue-finder/`;
const OUTPUT_DIR = path.resolve("output/playwright");

let previewProcess;
let browser;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForUrl(url, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Preview did not become ready: ${lastError?.message || "timeout"}`);
}

async function launchPreview() {
  if (process.env.VENUE_FINDER_BASE_URL) return;

  previewProcess = spawn(
    process.execPath,
    [
      path.resolve("node_modules/vite/bin/vite.js"),
      "preview",
      "--host",
      HOST,
      "--port",
      String(PORT),
      "--strictPort",
    ],
    {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
    },
  );

  let previewError = "";
  previewProcess.stderr.on("data", (chunk) => {
    previewError += chunk.toString();
  });
  previewProcess.on("exit", (code) => {
    if (code && code !== 0) {
      previewError ||= `preview exited with code ${code}`;
    }
  });

  try {
    await waitForUrl(BASE_URL);
  } catch (error) {
    throw new Error(`${error.message}${previewError ? `\n${previewError}` : ""}`);
  }
}

async function waitForVenueCards(page) {
  await page.waitForFunction(() => {
    const count = Number(document.querySelector("[data-result-count]")?.textContent || 0);
    return count > 0 && document.querySelectorAll("[data-venue-card]").length === count;
  });
}

async function verifyImageGeometry(card) {
  const geometry = await card.locator(".venue-thumb img").evaluate((image) => {
    const imageRect = image.getBoundingClientRect();
    const parentRect = image.parentElement.getBoundingClientRect();
    const styles = getComputedStyle(image);
    return {
      imageHeight: imageRect.height,
      imageWidth: imageRect.width,
      parentHeight: parentRect.height,
      parentWidth: parentRect.width,
      objectFit: styles.objectFit,
      position: styles.position,
    };
  });

  assert(
    Math.abs(geometry.imageHeight - geometry.parentHeight) <= 1 &&
      Math.abs(geometry.imageWidth - geometry.parentWidth) <= 1,
    `Venue image does not fit its thumbnail container: ${JSON.stringify(geometry)}`,
  );
  assert(geometry.objectFit === "contain", "Venue image must use object-fit: contain");
  assert(geometry.position === "absolute", "Venue image must be anchored to its thumbnail");
}

async function runDesktopChecks(page) {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await waitForVenueCards(page);

  const structure = await page.evaluate(() => {
    const howTo = document.querySelector(".planning-strip");
    const finder = document.querySelector(".finder-grid");
    return {
      howToBeforeFinder:
        Boolean(howTo && finder) &&
        Boolean(howTo.compareDocumentPosition(finder) & Node.DOCUMENT_POSITION_FOLLOWING),
      searchInputs: document.querySelectorAll(".filter-panel input").length,
      areaOptions: document.querySelector("[data-filter-area]")?.options.length || 0,
    };
  });
  assert(structure.howToBeforeFinder, "How-to section must appear before the venue finder");
  assert(structure.searchInputs === 0, "Venue finder must not contain a text search input");
  assert(structure.areaOptions > 1, "Area dropdown must contain regional options");

  const firstImageCard = page.locator("[data-venue-card]").filter({
    has: page.locator(".venue-thumb img"),
  }).first();
  await verifyImageGeometry(firstImageCard);

  const details = firstImageCard.locator("details");
  assert(!(await details.evaluate((element) => element.open)), "Venue details should be collapsed initially");
  await details.locator("summary").click();
  assert(await details.evaluate((element) => element.open), "Venue details should expand when clicked");

  const southside = page.locator("[data-venue-card]", { hasText: "Southside" }).first();
  await southside.locator("summary").click();
  assert(
    (await southside.locator(".venue-site-link").count()) === 0,
    "Venue without a website must not render a website link",
  );

  const areaSelect = page.locator("[data-filter-area]");
  await areaSelect.selectOption("Sentosa");
  await page.waitForFunction(
    () => document.querySelector("[data-result-count]")?.textContent === "41",
  );
  assert(
    (await page.locator("[data-venue-card]").count()) === 41,
    "Sentosa filter should show 41 venues",
  );

  const map = page.locator("#venue-map");
  const initialZoom = Number(await map.getAttribute("data-zoom"));
  await map.hover();
  await page.mouse.wheel(0, 650);
  await page.waitForFunction(
    (zoom) => Number(document.querySelector("#venue-map")?.dataset.zoom) !== zoom,
    initialZoom,
  );
  const changedZoom = Number(await map.getAttribute("data-zoom"));
  assert(changedZoom !== initialZoom, "Mouse wheel should change the map zoom");

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  const backToTop = page.locator("[data-back-to-top]");
  await backToTop.waitFor({ state: "visible" });
  await backToTop.click();
  await page.waitForFunction(() => window.scrollY < 5);
}

async function runMobileChecks(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await waitForVenueCards(page);

  const layout = await page.evaluate(() => ({
    viewportWidth: window.innerWidth,
    bodyWidth: document.body.scrollWidth,
    documentWidth: document.documentElement.scrollWidth,
  }));
  assert(
    layout.bodyWidth <= layout.viewportWidth &&
      layout.documentWidth <= layout.viewportWidth,
    `Mobile layout has horizontal overflow: ${JSON.stringify(layout)}`,
  );

  const firstImageCard = page.locator("[data-venue-card]").filter({
    has: page.locator(".venue-thumb img"),
  }).first();
  await verifyImageGeometry(firstImageCard);
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await launchPreview();

  const channel = process.env.PLAYWRIGHT_CHANNEL || "chrome";
  browser = await chromium.launch({ channel, headless: true });
  const page = await browser.newPage();
  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  try {
    await runDesktopChecks(page);
    await runMobileChecks(page);
    assert(consoleErrors.length === 0, `Browser console errors:\n${consoleErrors.join("\n")}`);
    console.log("Venue finder browser smoke test passed");
  } catch (error) {
    await page.screenshot({
      path: path.join(OUTPUT_DIR, "venue-finder-smoke-failure.png"),
      fullPage: true,
    });
    throw error;
  }
}

try {
  await main();
} finally {
  await browser?.close();
  if (previewProcess && !previewProcess.killed) previewProcess.kill();
}
