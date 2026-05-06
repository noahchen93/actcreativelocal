import { siteConfig } from "../config/site";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  const id = siteConfig.analytics.ga4MeasurementId;
  if (!id || id.includes("XXXXXX")) return; // skip if placeholder

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { send_page_view: false });
  initialized = true;
}

export function trackPageView(path: string, title: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  const id = siteConfig.analytics.ga4MeasurementId;
  if (!id || id.includes("XXXXXX")) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_title: title,
    page_location: `${siteConfig.url}${path}`,
  });
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.gtag) return;
  const id = siteConfig.analytics.ga4MeasurementId;
  if (!id || id.includes("XXXXXX")) {
    console.debug("[analytics] event (placeholder):", name, params);
    return;
  }
  window.gtag("event", name, params);
}
