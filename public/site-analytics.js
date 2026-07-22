(function () {
  var LOCAL_HOSTS = ["localhost", "127.0.0.1"];
  var AI_SOURCES = [
    { name: "chatgpt", patterns: ["chatgpt.com", "openai.com"] },
    { name: "perplexity", patterns: ["perplexity.ai"] },
    { name: "claude", patterns: ["claude.ai", "anthropic.com"] },
    { name: "copilot", patterns: ["copilot.microsoft.com"] },
    { name: "gemini", patterns: ["gemini.google.com"] },
    { name: "deepseek", patterns: ["deepseek.com"] },
    { name: "doubao", patterns: ["doubao.com"] },
    { name: "kimi", patterns: ["kimi.com", "kimi.moonshot.cn"] },
    { name: "qwen", patterns: ["tongyi.com", "tongyi.aliyun.com", "qianwen"] },
    { name: "zhipu", patterns: ["chatglm.cn", "zhipuai.cn"] },
    { name: "minimax", patterns: ["minimax.io", "minimaxi.com"] },
  ];

  function normalize(value) {
    return (value || "").toLowerCase().replace(/^www\./, "");
  }

  function matchAiSource(value) {
    var normalized = normalize(value);
    if (!normalized) return "";

    for (var i = 0; i < AI_SOURCES.length; i += 1) {
      var source = AI_SOURCES[i];
      for (var j = 0; j < source.patterns.length; j += 1) {
        if (normalized.indexOf(source.patterns[j]) !== -1) return source.name;
      }
    }

    return "";
  }

  function detectAiSource() {
    var params = new URLSearchParams(window.location.search || "");
    var declared = [
      params.get("utm_source"),
      params.get("source"),
      params.get("ref"),
    ];

    for (var i = 0; i < declared.length; i += 1) {
      var declaredMatch = matchAiSource(declared[i]);
      if (declaredMatch) return declaredMatch;
    }

    if (!document.referrer) return "";
    try {
      return matchAiSource(new URL(document.referrer).hostname);
    } catch {
      return matchAiSource(document.referrer);
    }
  }

  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };

  if (
    !LOCAL_HOSTS.includes(window.location.hostname) &&
    !document.querySelector('script[src="/_vercel/insights/script.js"]')
  ) {
    var insightsScript = document.createElement("script");
    insightsScript.defer = true;
    insightsScript.src = "/_vercel/insights/script.js";
    insightsScript.dataset.actSiteAnalytics = "true";
    document.head.appendChild(insightsScript);
  }

  var aiSource = detectAiSource();
  window.ACT_AI_REFERRAL_SOURCE = aiSource;

  if (!aiSource) return;

  var eventData = {
    source: aiSource,
    page_path: window.location.pathname,
    language: document.documentElement.lang || "unknown",
  };

  window.va("event", { name: "AI referral landing", data: eventData });
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "ai_referral_landing",
    ai_source: aiSource,
    page_path: window.location.pathname,
  });
})();
