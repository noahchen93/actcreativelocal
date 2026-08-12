(function () {
  var STORAGE_KEY = "act_inquiry_attribution_v1";
  var ENGAGEMENT_STORAGE_KEY = "act_engagement_events_v1";
  var PHONE = "6584515268";
  var EMAIL = "contact@actcreative.net";

  function ensureVercelAnalytics() {
    // The React homepage loads Analytics through site-analytics.js.
    // Static landing pages also keep this fallback for direct page loads.
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

  function normalizeSource(value) {
    var source = (value || "").toLowerCase().replace(/^www\./, "");
    if (!source) return "";
    if (source.indexOf("chatgpt") !== -1 || source.indexOf("openai") !== -1) return "chatgpt";
    if (source.indexOf("perplexity") !== -1) return "perplexity";
    if (source.indexOf("claude") !== -1 || source.indexOf("anthropic") !== -1) return "claude";
    if (source.indexOf("copilot") !== -1) return "copilot";
    if (source.indexOf("gemini") !== -1) return "gemini";
    if (source.indexOf("deepseek") !== -1) return "deepseek";
    if (source.indexOf("doubao") !== -1) return "doubao";
    if (source.indexOf("kimi") !== -1 || source.indexOf("moonshot") !== -1) return "kimi";
    if (source.indexOf("tongyi") !== -1 || source.indexOf("qianwen") !== -1) return "qwen";
    if (source.indexOf("chatglm") !== -1 || source.indexOf("zhipu") !== -1) return "zhipu";
    if (source.indexOf("minimax") !== -1) return "minimax";
    return value || "";
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
    if (utmSource) return normalizeSource(safeDecode(utmSource));

    if (!referrer) return "direct";

    try {
      var host = new URL(referrer).hostname.replace(/^www\./, "");
      var normalizedAiSource = normalizeSource(host);
      if (normalizedAiSource !== host) return normalizedAiSource;
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
    if (typeof window.va === "function") {
      window.va("event", {
        name: "Inquiry intent",
        data: {
          channel: channel,
          label: label || "",
          page_path: window.location.pathname,
          source: data.firstSource || data.source || "unknown",
        },
      });
    }
    window.dispatchEvent(new CustomEvent("act:inquiry-intent", { detail: event }));
  }

  function trackAction(name, label, details) {
    var attribution = getAttribution();
    var safeDetails = details || {};
    var data = {
      label: label || "",
      page_path: window.location.pathname,
      source: attribution.firstSource || attribution.source || "unknown",
    };

    Object.keys(safeDetails).forEach(function (key) {
      var value = safeDetails[key];
      if (["string", "number", "boolean"].includes(typeof value)) {
        data[key] = value;
      }
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "act_site_action",
      action_name: name,
      action_label: label || "",
      page_path: window.location.pathname,
      landing_page: attribution.landingPage,
      first_source: attribution.firstSource,
      details: data,
    });

    if (typeof window.va === "function") {
      window.va("event", { name: name, data: data });
    }

    window.dispatchEvent(
      new CustomEvent("act:site-action", {
        detail: { name: name, data: data },
      }),
    );
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

  function isChinesePage() {
    return (document.documentElement.lang || "").toLowerCase().indexOf("zh") === 0;
  }

  function isProminentLink(link) {
    return link.matches(
      '.button, .btn, .cta, .nav-cta, [class*="button"], [class*="cta"]',
    );
  }

  function isEmailFirstIntent(link) {
    var label = (link.textContent || "").replace(/\s+/g, " ").trim();
    if (/^(contact(?: us)?|email us|联系我们|联系|发送邮件)$/i.test(label)) {
      return true;
    }

    if (!isProminentLink(link)) return false;

    return /(send.{0,18}brief|request|quote|estimate|discuss|enquir|availability|contact|咨询|需求|报价|询价|联系|发送.{0,12}需求)/i.test(
      label,
    );
  }

  function createIntentMailto(label, message) {
    var subject = label && label.length < 90 ? label : "Project Inquiry - ACT Creative";
    var body =
      message ||
      "Hi ACT Creative,\n\nI found this page and would like to discuss a project.\n";
    var params = new URLSearchParams();
    params.set("subject", subject);
    params.set("body", body);
    return appendMailtoBody("mailto:" + EMAIL + "?" + params.toString());
  }

  function convertWhatsAppButtonToEmail(link, href) {
    var url = new URL(href, window.location.href);
    var message = url.searchParams.get("text") || "";
    var label = (link.textContent || "").replace(/\s+/g, " ").trim();
    link.setAttribute("href", createIntentMailto(label, message));
    link.removeAttribute("target");
    link.removeAttribute("rel");

    if (/whatsapp/i.test(label)) {
      link.textContent = label
        .replace(/on WhatsApp/gi, isChinesePage() ? "通过邮件" : "by Email")
        .replace(/via WhatsApp/gi, isChinesePage() ? "通过邮件" : "by Email")
        .replace(/whatsapp/gi, isChinesePage() ? "邮件" : "Email");
    } else if (/^\+?65[\s-]*8451[\s-]*5268$/.test(label)) {
      link.textContent = EMAIL;
    }
  }

  function createFloatingWhatsApp() {
    if (document.querySelector("[data-act-whatsapp-float]")) return;

    var style = document.createElement("style");
    style.textContent =
      ".act-whatsapp-float{" +
      "position:fixed;right:max(14px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));z-index:55;" +
      "display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:10px 14px;" +
      "border:1px solid rgba(255,255,255,.3);border-radius:8px;background:#1fbd63;color:#06130b;" +
      "font:800 14px/1 system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;letter-spacing:0;" +
      "box-shadow:0 12px 30px rgba(0,0,0,.32);text-decoration:none;transition:transform 160ms ease,background 160ms ease}" +
      ".act-whatsapp-float:hover{background:#38d878;transform:translateY(-2px)}" +
      ".act-whatsapp-float:focus-visible{outline:3px solid #fff;outline-offset:3px}" +
      ".act-whatsapp-mark{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;" +
      "border:2px solid currentColor;border-radius:50%;font-size:9px;font-weight:900}" +
      "@media(max-width:480px){.act-whatsapp-float{right:max(10px,env(safe-area-inset-right));bottom:max(10px,env(safe-area-inset-bottom));width:48px;min-height:48px;padding:0;border-radius:50%}.act-whatsapp-float>span:last-child{display:none}}" +
      "@media print{.act-whatsapp-float{display:none!important}}";
    document.head.appendChild(style);

    var link = document.createElement("a");
    link.className = "act-whatsapp-float";
    link.href = "https://wa.me/" + PHONE;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.dataset.actWhatsappFloat = "true";
    link.dataset.actWhatsappPreserve = "true";
    link.setAttribute(
      "aria-label",
      isChinesePage() ? "通过 WhatsApp 联系 ACT Creative" : "Contact ACT Creative on WhatsApp",
    );
    link.title = isChinesePage() ? "WhatsApp 联系" : "WhatsApp";
    link.innerHTML = '<span class="act-whatsapp-mark" aria-hidden="true">WA</span><span>WhatsApp</span>';
    document.body.appendChild(link);
  }

  function enhanceLink(link) {
    if (link.dataset.actInquiryEnhanced === "true") return;

    var href = link.getAttribute("href") || "";
    if (!href) return;

    if (href.indexOf("wa.me/" + PHONE) !== -1) {
      if (link.dataset.actWhatsappPreserve !== "true" && isProminentLink(link)) {
        convertWhatsAppButtonToEmail(link, href);
        link.dataset.actInquiryEnhanced = "true";
        link.addEventListener("click", function () {
          track("email", link.textContent.trim());
        });
        return;
      }

      link.setAttribute("href", appendWhatsAppText(href));
      link.dataset.actInquiryEnhanced = "true";
      link.addEventListener("click", function () {
        track("whatsapp", link.textContent.trim());
      });
      return;
    }

    if (isEmailFirstIntent(link) && href.charAt(0) !== "#") {
      link.setAttribute("href", createIntentMailto(link.textContent.trim()));
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.dataset.actInquiryEnhanced = "true";
      link.addEventListener("click", function () {
        track("email", link.textContent.trim());
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

  function classifyInternalLink(link) {
    if (link.dataset.actEvent) {
      return {
        name: link.dataset.actEvent,
        label: link.dataset.actLabel || link.textContent.trim(),
      };
    }

    var href = link.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#") return null;

    var pathname;
    try {
      var url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return null;
      pathname = url.pathname;
    } catch {
      return null;
    }

    if (pathname.indexOf("/case-studies/") === 0 || pathname.indexOf("/booth-design-build-portfolio/") === 0) {
      return { name: "Proof viewed", label: pathname };
    }
    if (pathname.indexOf("/singapore-event-venues/") === 0 || pathname.indexOf("/singapore-event-venue-finder/") === 0) {
      return { name: "Venue explored", label: pathname };
    }
    if (
      /\/(event-fabrication|custom-props|booth-design-build|frp-sculpture|interactive-digital-display|event-merchandise|china-event-production)/.test(
        pathname,
      )
    ) {
      return { name: "Service explored", label: pathname };
    }

    return null;
  }

  function enhanceActionLink(link) {
    if (link.dataset.actActionEnhanced === "true") return;

    var classification = classifyInternalLink(link);
    if (!classification) return;

    link.dataset.actActionEnhanced = "true";
    link.addEventListener("click", function () {
      trackAction(classification.name, classification.label, {
        destination: compactUrl(link.getAttribute("href") || ""),
      });
    });
  }

  function enhanceLinks() {
    document
      .querySelectorAll('a[href*="wa.me/' + PHONE + '"], a[href^="mailto:' + EMAIL + '"], a[href]')
      .forEach(enhanceLink);
    document.querySelectorAll("a[href]").forEach(enhanceActionLink);
  }

  function readEngagementEvents() {
    try {
      return JSON.parse(window.sessionStorage.getItem(ENGAGEMENT_STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function trackEngagementOnce(key, name, details) {
    var events = readEngagementEvents();
    var storageKey = window.location.pathname + ":" + key;
    if (events[storageKey]) return;
    events[storageKey] = true;
    try {
      window.sessionStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(events));
    } catch {
      // Engagement tracking must not affect page use.
    }
    trackAction(name, key, details);
  }

  function installEngagementTracking() {
    window.setTimeout(function () {
      trackEngagementOnce("15_seconds", "Engaged visit", { seconds: 15 });
    }, 15000);

    var onScroll = function () {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      var depth = Math.round((window.scrollY / scrollable) * 100);
      if (depth >= 50) trackEngagementOnce("scroll_50", "Scroll depth", { percent: 50 });
      if (depth >= 90) {
        trackEngagementOnce("scroll_90", "Scroll depth", { percent: 90 });
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
  }

  window.ACTInquiryAttribution = {
    get: getAttribution,
    formatLines: formatLines,
    track: track,
    trackAction: trackAction,
    appendWhatsAppText: appendWhatsAppText,
    appendMailtoBody: appendMailtoBody,
  };

  ensureVercelAnalytics();
  getInitialAttribution();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      createFloatingWhatsApp();
      enhanceLinks();
      installEngagementTracking();
    });
  } else {
    createFloatingWhatsApp();
    enhanceLinks();
    installEngagementTracking();
  }

  new MutationObserver(enhanceLinks).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
