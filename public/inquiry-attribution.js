(function () {
  var STORAGE_KEY = "act_inquiry_attribution_v1";
  var PHONE = "6584515268";
  var EMAIL = "contact@actcreative.net";

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

  function enhanceLinks() {
    document
      .querySelectorAll('a[href*="wa.me/' + PHONE + '"], a[href^="mailto:' + EMAIL + '"], a[href]')
      .forEach(enhanceLink);
  }

  window.ACTInquiryAttribution = {
    get: getAttribution,
    formatLines: formatLines,
    track: track,
    appendWhatsAppText: appendWhatsAppText,
    appendMailtoBody: appendMailtoBody,
  };

  getInitialAttribution();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      createFloatingWhatsApp();
      enhanceLinks();
    });
  } else {
    createFloatingWhatsApp();
    enhanceLinks();
  }

  new MutationObserver(enhanceLinks).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
