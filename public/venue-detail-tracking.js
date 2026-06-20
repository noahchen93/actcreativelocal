(function () {
  function eventData(extra) {
    return {
      venue_id: document.body.dataset.venueId || "unknown",
      guide_slug: document.body.dataset.guideSlug || "",
      page_path: window.location.pathname,
      ...extra,
    };
  }

  function track(name, data) {
    const detail = eventData(data || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...detail });
    if (typeof window.va === "function") {
      window.va("event", { name, data: detail });
    }
    window.dispatchEvent(new CustomEvent(`act:${name}`, { detail }));
  }

  function ready() {
    track(
      document.body.dataset.pageType === "venue-guide"
        ? "Venue guide viewed"
        : "Venue detail viewed",
    );
    document.addEventListener("click", function (event) {
      const link = event.target.closest("[data-track-action]");
      if (!link) return;
      track(link.dataset.trackAction, {
        label: link.dataset.trackLabel || "",
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();
