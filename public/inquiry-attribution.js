(function () {
  var STORAGE_KEY = "act_inquiry_attribution_v1";
  var PHONE = "6584515268";
  var EMAIL = "contact@actcreative.net";

  function ensureVercelAnalytics() {
    // The React homepage injects Analytics through @vercel/analytics/react.
    // Static landing pages need the framework-agnostic script explicitly.
    if (document.getElementById("root")) return;

    window.va =
      window.va ||
      function () {
        (window.vaq = window.vaq || []).push(arguments);
      };

    if (document.querySelector('script[src="/_vercel/insights/script.js"]')) {
      return;
    }

    var script = document.createElement("script");
    script.defer = true;
    script.src = "/_vercel/insights/script.js";
    script.dataset.actVercelAnalytics = "true";
    document.head.appendChild(script);
  }

  function safeDecode(value) {
    try {
      return decodeURIComponent(value || "");
    } catch {
      return value || "";
    }
  }

  function getSearchParams() {
    return new URLSearchParams(window.location.search || "");
  }

  function readStored() {
    try {
      var raw = window.sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeStored(value) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Attribution is useful, but never worth blocking contact links.
    }
  }

  function detectSource(referrer, params) {
    var utmSource = params.get("utm_source");
    if (utmSource) return safeDecode(utmSource);

    if (!referrer) return "direct";

    try {
      var host = new URL(referrer).hostname.replace(/^www\./, "");
      if (host.indexOf("google.") !== -1) return "google";
      if (host.indexOf("bing.") !== -1) return "bing";
      if (host.indexOf("yahoo.") !== -1) return "yahoo";
      if (host.indexOf("duckduckgo.") !== -1) return "duckduckgo";
      if (host.indexOf("baidu.") !== -1) return "baidu";
      if (host.indexOf("linkedin.") !== -1) return "linkedin";
      if (host.indexOf("facebook.") !== -1) return "facebook";
      if (host.indexOf("instagram.") !== -1) return "instagram";
      return host;
    } catch {
      return "referral";
    }
  }

  function createInitialAttribution() {
    var params = getSearchParams();
    var referrer = document.referrer || "";
    return {
      landingPage: window.location.pathname + window.location.search + window.location.hash,
      landingTitle: document.title,
      firstReferrer: referrer,
      firstSource: detectSource(referrer, params),
      firstMedium: safeDecode(params.get("utm_medium")) || (referrer ? "referral" : "direct"),
      campaign: safeDecode(params.get("utm_campaign")),
      term: safeDecode(params.get("utm_term")),
      content: safeDecode(params.get("utm_content")),
      gclid: safeDecode(params.get("gclid")),
      capturedAt: new Date().toISOString(),
    };
  }

  function getInitialAttribution() {
    var stored = readStored();
    if (stored) return stored;

    var initial = createInitialAttribution();
    writeStored(initial);
    return initial;
  }

  function getAttribution() {
    var initial = getInitialAttribution();
    var params = getSearchParams();
    var referrer = document.referrer || "";

    return {
      page: window.location.pathname + window.location.search + window.location.hash,
      pageTitle: document.title,
      referrer: referrer,
      source: detectSource(referrer, params) || initial.firstSource,
      medium: safeDecode(params.get("utm_medium")) || initial.firstMedium,
      campaign: safeDecode(params.get("utm_campaign")) || initial.campaign,
      term: safeDecode(params.get("utm_term")) || initial.term,
      content: safeDecode(params.get("utm_content")) || initial.content,
      gclid: safeDecode(params.get("gclid")) || initial.gclid,
      landingPage: initial.landingPage,
      firstReferrer: initial.firstReferrer,
      firstSource: initial.firstSource,
      capturedAt: initial.capturedAt,
    };
  }

  function compactUrl(value) {
    if (!value) return "";
    try {
      var url = new URL(value, window.location.origin);
      return url.hostname === window.location.hostname
        ? url.pathname + url.search + url.hash
        : url.hostname + url.pathname;
    } catch {
      return value;
    }
  }

  function formatLines(channel) {
    var data = getAttribution();
    var lines = [
      "",
      "---",
      "Website source",
      "Channel: " + channel,
      "Current page: " + compactUrl(data.page),
      "Landing page: " + compactUrl(data.landingPage),
      "Source: " + (data.firstSource || data.source || "unknown"),
    ];

    if (data.campaign) lines.push("Campaign: " + data.campaign);
    if (data.term) lines.push("Term: " + data.term);
    if (data.firstReferrer) lines.push("Referrer: " + compactUrl(data.firstReferrer));

    return lines.join("\n");
  }

  function track(channel, label) {
    var data = getAttribution();
    var event = {
      event: "inquiry_intent",
      inquiry_channel: channel,
      inquiry_label: label || "",
      page_path: data.page,
      page_title: data.pageTitle,
      landing_page: data.landingPage,
      first_source: data.firstSource,
      source: data.source,
      medium: data.medium,
      campaign: data.campaign,
      term: data.term,
      referrer: data.referrer,
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
    window.dispatchEvent(new CustomEvent("act:inquiry-intent", { detail: event }));

    // Vercel custom events appear on Pro/Enterprise plans. Keeping this call
    // here makes the same intent data available automatically after an upgrade,
    // while the dataLayer event and inquiry message attribution work on all plans.
    if (typeof window.va === "function") {
      window.va("event", "Inquiry Intent", {
        channel: channel,
        page_path: data.page,
      });
    }
  }

  function appendWhatsAppText(href) {
    var url = new URL(href, window.location.href);
    var existing = url.searchParams.get("text");
    var intro = "Hi ACT Creative, I found this page and would like to discuss a project.";
    var text = existing || intro;

    if (text.indexOf("Website source") === -1) {
      text += formatLines("whatsapp");
    }

    url.searchParams.set("text", text);
    return url.toString();
  }

  function appendMailtoBody(href) {
    var raw = href.replace(/^mailto:/i, "");
    var parts = raw.split("?");
    var address = parts[0] || EMAIL;
    var params = new URLSearchParams(parts[1] || "");
    var subject = params.get("subject") || "Project Inquiry - ACT Creative";
    var body =
      params.get("body") ||
      "Hi ACT Creative,\n\nI found this page and would like to discuss a project.\n";

    if (body.indexOf("Website source") === -1) {
      body += formatLines("email");
    }

    params.set("subject", subject);
    params.set("body", body);
    return "mailto:" + address + "?" + params.toString();
  }

  function enhanceLink(link) {
    if (link.dataset.actInquiryEnhanced === "true") return;

    var href = link.getAttribute("href") || "";
    if (!href) return;

    if (href.indexOf("wa.me/" + PHONE) !== -1) {
      link.setAttribute("href", appendWhatsAppText(href));
      link.dataset.actInquiryEnhanced = "true";
      link.addEventListener("click", function () {
        track("whatsapp", link.textContent.trim());
      });
      return;
    }

    if (href.toLowerCase().indexOf("mailto:" + EMAIL) === 0) {
      link.setAttribute("href", appendMailtoBody(href));
      link.dataset.actInquiryEnhanced = "true";
      link.addEventListener("click", function () {
        track("email", link.textContent.trim());
      });
    }
  }

  function enhanceLinks() {
    document
      .querySelectorAll('a[href*="wa.me/' + PHONE + '"], a[href^="mailto:' + EMAIL + '"]')
      .forEach(enhanceLink);
  }

  window.ACTInquiryAttribution = {
    get: getAttribution,
    formatLines: formatLines,
    track: track,
    appendWhatsAppText: appendWhatsAppText,
    appendMailtoBody: appendMailtoBody,
  };

  ensureVercelAnalytics();
  getInitialAttribution();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceLinks);
  } else {
    enhanceLinks();
  }

  new MutationObserver(enhanceLinks).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
