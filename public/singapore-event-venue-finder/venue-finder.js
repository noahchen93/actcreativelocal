(function () {
  const DATA_URL = "/singapore-event-venue-finder/venue-data.json";
  const WHATSAPP_BASE = "https://wa.me/6584515268";
  const PAGE_SIZE = 12;
  const MAX_SHORTLIST = 5;
  const CLUSTER_ZOOM = 12;

  const dom = {
    search: document.querySelector("[data-filter-search]"),
    kind: document.querySelector("[data-filter-kind]"),
    setting: document.querySelector("[data-filter-setting]"),
    event: document.querySelector("[data-filter-event]"),
    area: document.querySelector("[data-filter-area]"),
    capacity: document.querySelector("[data-filter-capacity]"),
    sort: document.querySelector("[data-sort-results]"),
    clear: document.querySelector("[data-clear-filters]"),
    activeFilters: document.querySelector("[data-active-filters]"),
    resultList: document.querySelector("[data-result-list]"),
    resultCount: document.querySelector("[data-result-count]"),
    visibleStat: document.querySelector("[data-stat-visible]"),
    totalStat: document.querySelector("[data-stat-total]"),
    mappedStat: document.querySelector("[data-stat-mapped]"),
    mapSummary: document.querySelector("[data-map-summary]"),
    shortlistList: document.querySelector("[data-shortlist-list]"),
    shortlistCount: document.querySelector("[data-shortlist-count]"),
    shortlistWhatsapp: document.querySelector("[data-shortlist-whatsapp]"),
    compareToggle: document.querySelector("[data-compare-toggle]"),
    comparePanel: document.querySelector("[data-compare-panel]"),
    compareTable: document.querySelector("[data-compare-table]"),
    loadMoreWrap: document.querySelector("[data-load-more-wrap]"),
    loadMore: document.querySelector("[data-load-more]"),
    renderedSummary: document.querySelector("[data-rendered-summary]"),
    shareFilters: document.querySelector("[data-share-filters]"),
    shareStatus: document.querySelector("[data-share-status]"),
    mapResults: document.querySelector(".map-results"),
    backToTop: document.querySelector("[data-back-to-top]"),
  };

  const state = {
    data: null,
    venues: [],
    filtered: [],
    shortlist: new Set(),
    expanded: new Set(),
    quickFilters: new Set(),
    visibleCount: PAGE_SIZE,
    map: null,
    markerLayer: null,
    markers: new Map(),
    activeVenueId: null,
    compareOpen: false,
    viewMode: "list",
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function uniq(values) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
      a.localeCompare(b),
    );
  }

  function normalise(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  }

  function titleCase(value) {
    return String(value || "")
      .replace(/(^|\s)\S/g, (character) => character.toUpperCase());
  }

  function websiteHref(site) {
    const value = String(site || "").trim();
    if (!value || ["?", "-", "—", "n/a", "none"].includes(value.toLowerCase())) {
      return "";
    }
    try {
      const url = new URL(
        /^https?:\/\//i.test(value) ? value : `https://${value}`,
      );
      if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) {
        return "";
      }
      return url.href;
    } catch {
      return "";
    }
  }

  function formatDate(value) {
    if (!value) return "Review date unavailable";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-SG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function formatLayout(value) {
    const labels = {
      banquet: "banquet",
      cocktail: "cocktail",
      theatre: "theatre",
      classroom: "classroom",
    };
    return labels[value] || value || "layout";
  }

  function capacityLabel(venue) {
    const basis = venue.capacityBasis;
    if (!basis?.capacity) return "Capacity requires source review";
    const prefix =
      venue.capacityAuditStatus === "official"
        ? "Officially published"
        : venue.capacityAuditStatus === "reference"
          ? "Reference record"
          : "Recorded";
    const space = basis.space ? ` · ${basis.space}` : "";
    return `${prefix}: up to ${Number(basis.capacity).toLocaleString("en-SG")} guests · ${formatLayout(basis.layout)}${space}`;
  }

  function confidenceLabel(value) {
    if (value === "high") return "Source-linked";
    if (value === "medium") return "Curated";
    return "Limited public data";
  }

  function maxSpaceCapacity(space) {
    return Math.max(
      Number(space.banquet || 0),
      Number(space.cocktail || 0),
      Number(space.theatre || 0),
      Number(space.classroom || 0),
    );
  }

  function spaceCapacitySummary(space) {
    const values = [
      ["Banquet", space.banquet],
      ["Cocktail", space.cocktail],
      ["Theatre", space.theatre],
      ["Classroom", space.classroom],
    ]
      .filter(([, value]) => Number(value) > 0)
      .map(
        ([label, value]) =>
          `${label} ${Number(value).toLocaleString("en-SG")}`,
      );
    return values.length ? values.join(" · ") : "Capacity not recorded";
  }

  function getMarkerClass(kind) {
    const lower = normalise(kind);
    if (lower.includes("outdoor") || lower.includes("island")) return "outdoor";
    if (lower.includes("hotel") || lower.includes("resort")) return "hotel";
    if (lower.includes("restaurant") || lower.includes("golf")) return "restaurant";
    if (
      lower.includes("gallery") ||
      lower.includes("museum") ||
      lower.includes("theatre")
    ) {
      return "culture";
    }
    if (lower.includes("conference") || lower.includes("convention")) {
      return "conference";
    }
    return "";
  }

  function track(eventName, detail = {}) {
    const event = {
      event: eventName,
      page_path: window.location.pathname,
      ...detail,
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
    if (typeof window.va === "function") {
      window.va("event", { name: eventName, data: event });
    }
    window.dispatchEvent(new CustomEvent(`act:${eventName}`, { detail: event }));
  }

  function populateSelect(select, values) {
    if (!select) return;
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function populateAreaSelect() {
    if (!dom.area) return;
    const counts = state.venues.reduce((totals, venue) => {
      totals.set(venue.area, (totals.get(venue.area) || 0) + 1);
      return totals;
    }, new Map());
    uniq(state.venues.map((venue) => venue.area)).forEach((area) => {
      const option = document.createElement("option");
      option.value = area;
      option.textContent = `${area} (${counts.get(area)})`;
      dom.area.appendChild(option);
    });
  }

  function readHashState() {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (dom.search) dom.search.value = params.get("q") || "";
    if (dom.area) dom.area.value = params.get("area") || "";
    if (dom.kind) dom.kind.value = params.get("type") || "";
    if (dom.setting) dom.setting.value = params.get("setting") || "";
    if (dom.event) dom.event.value = params.get("event") || "";
    if (dom.capacity) dom.capacity.value = params.get("capacity") || "";
    if (dom.sort) dom.sort.value = params.get("sort") || "recommended";
    state.quickFilters = new Set(
      (params.get("quick") || "").split(",").filter(Boolean),
    );
    syncQuickFilterButtons();
  }

  function syncHashState() {
    const params = new URLSearchParams();
    if (dom.search?.value.trim()) params.set("q", dom.search.value.trim());
    if (dom.area?.value) params.set("area", dom.area.value);
    if (dom.kind?.value) params.set("type", dom.kind.value);
    if (dom.setting?.value) params.set("setting", dom.setting.value);
    if (dom.event?.value) params.set("event", dom.event.value);
    if (dom.capacity?.value) params.set("capacity", dom.capacity.value);
    if (state.quickFilters.size) {
      params.set("quick", Array.from(state.quickFilters).sort().join(","));
    }
    if (dom.sort?.value && dom.sort.value !== "recommended") {
      params.set("sort", dom.sort.value);
    }
    const hash = params.toString();
    history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash ? `#${hash}` : ""}`);
  }

  function syncQuickFilterButtons() {
    document.querySelectorAll("[data-quick-filter]").forEach((button) => {
      const active = state.quickFilters.has(
        button.getAttribute("data-quick-filter"),
      );
      button.setAttribute("aria-pressed", String(active));
      button.classList.toggle("is-active", active);
    });
  }

  function initFilters() {
    populateSelect(
      dom.kind,
      uniq(
        state.venues.flatMap(
          (venue) => venue.propertyTypes || [venue.primaryType],
        ),
      ),
    );
    populateSelect(
      dom.setting,
      uniq(state.venues.flatMap((venue) => venue.settings || [])),
    );
    populateAreaSelect();
    populateSelect(
      dom.event,
      uniq(state.venues.flatMap((venue) => venue.eventTypes || [])),
    );
    readHashState();

    [dom.kind, dom.setting, dom.area, dom.event, dom.capacity, dom.sort].forEach(
      (input) => {
        if (input) {
          input.addEventListener("input", () =>
            applyFilters({ fitMap: input !== dom.sort }),
          );
        }
      },
    );
    if (dom.search) {
      dom.search.addEventListener("input", () => applyFilters({ fitMap: false }));
    }

    if (dom.clear) {
      dom.clear.addEventListener("click", () => {
        if (dom.search) dom.search.value = "";
        if (dom.kind) dom.kind.value = "";
        if (dom.setting) dom.setting.value = "";
        if (dom.area) dom.area.value = "";
        if (dom.event) dom.event.value = "";
        if (dom.capacity) dom.capacity.value = "";
        if (dom.sort) dom.sort.value = "recommended";
        state.quickFilters.clear();
        syncQuickFilterButtons();
        applyFilters({ fitMap: true });
        track("venue_filters_reset");
      });
    }
  }

  function initMap() {
    state.map = L.map("venue-map", {
      center: [1.3521, 103.8198],
      zoom: 11,
      scrollWheelZoom: true,
      touchZoom: true,
      doubleClickZoom: true,
      dragging: true,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(state.map);

    const mapElement = document.getElementById("venue-map");
    const syncMapZoom = () => {
      if (mapElement) mapElement.dataset.zoom = String(state.map.getZoom());
      renderMarkers();
    };
    state.map.on("zoomend", syncMapZoom);
    state.markerLayer = L.layerGroup().addTo(state.map);
    syncMapZoom();
  }

  function refreshMapSize() {
    if (!state.map) return;
    state.map.invalidateSize();
    renderMarkers();
  }

  function searchableText(venue) {
    return normalise(
      [
        venue.name,
        venue.area,
        venue.address,
        ...(venue.propertyTypes || []),
        ...(venue.settings || []),
        ...(venue.eventTypes || []),
        ...(venue.spaces || []).map((space) => space.name),
      ].join(" "),
    );
  }

  function matchesFilters(venue) {
    const query = normalise(dom.search?.value);
    const kind = dom.kind?.value;
    const setting = dom.setting?.value;
    const eventType = dom.event?.value;
    const area = dom.area?.value;
    const capacity = Number(dom.capacity?.value);

    if (query && !searchableText(venue).includes(query)) return false;
    if (kind && !(venue.propertyTypes || []).includes(kind)) return false;
    if (setting && !(venue.settings || []).includes(setting)) return false;
    if (eventType && !(venue.eventTypes || []).includes(eventType)) return false;
    if (area && venue.area !== area) return false;
    if (capacity && Number(venue.maxCapacity || 0) < capacity) return false;
    if (state.quickFilters.has("outdoor") && !(venue.settings || []).includes("Outdoor")) {
      return false;
    }
    if (
      state.quickFilters.has("official") &&
      venue.sourceType !== "Official venue website"
    ) {
      return false;
    }
    if (state.quickFilters.has("image") && !venue.image) return false;
    return true;
  }

  function recommendedScore(venue) {
    return (
      (venue.dataConfidence === "high" ? 100000 : 0) +
      (venue.image ? 20000 : 0) +
      (venue.sourceUrl ? 10000 : 0) +
      Math.min(Number(venue.maxCapacity || 0), 9000) +
      Math.min((venue.spaces || []).length * 150, 1500)
    );
  }

  function sortVenues(venues) {
    const mode = dom.sort?.value || "recommended";
    return venues.slice().sort((a, b) => {
      if (mode === "name") return a.name.localeCompare(b.name);
      if (mode === "area") {
        return a.area.localeCompare(b.area) || a.name.localeCompare(b.name);
      }
      if (mode === "capacity-desc") {
        return (
          Number(b.maxCapacity || 0) - Number(a.maxCapacity || 0) ||
          a.name.localeCompare(b.name)
        );
      }
      return (
        recommendedScore(b) - recommendedScore(a) ||
        a.name.localeCompare(b.name)
      );
    });
  }

  function applyFilters({ fitMap = true } = {}) {
    state.filtered = sortVenues(state.venues.filter(matchesFilters));
    state.visibleCount = PAGE_SIZE;
    renderStats();
    renderActiveFilters();
    renderMarkers();
    renderResults();
    syncHashState();
    if (fitMap) fitMapToFiltered();
    track("venue_filter_applied", {
      result_count: state.filtered.length,
      area: dom.area?.value || "",
      venue_type: dom.kind?.value || "",
      event_format: dom.event?.value || "",
    });
  }

  function renderStats() {
    if (dom.resultCount) dom.resultCount.textContent = state.filtered.length;
    if (dom.visibleStat) dom.visibleStat.textContent = state.filtered.length;
    const mapped = state.filtered.filter(
      (venue) => Number.isFinite(venue.lat) && Number.isFinite(venue.lng),
    ).length;
    if (dom.mapSummary) {
      const markerDescription =
        state.map && state.map.getZoom() <= CLUSTER_ZOOM && mapped > 20
          ? "grouped by area"
          : "shown individually";
      dom.mapSummary.textContent = `${mapped} mapped venues · ${markerDescription}`;
    }
  }

  function renderActiveFilters() {
    if (!dom.activeFilters) return;
    const filters = [
      ["search", dom.search?.value.trim(), `Search: ${dom.search?.value.trim()}`],
      ["area", dom.area?.value, dom.area?.value],
      ["kind", dom.kind?.value, dom.kind?.value],
      ["setting", dom.setting?.value, dom.setting?.value],
      ["event", dom.event?.value, dom.event?.value],
      [
        "capacity",
        dom.capacity?.value,
        dom.capacity?.value ? `${Number(dom.capacity.value).toLocaleString("en-SG")}+ guests` : "",
      ],
      ...Array.from(state.quickFilters).map((value) => [
        `quick:${value}`,
        value,
        value === "official"
          ? "Official source"
          : value === "image"
            ? "With photo"
            : titleCase(value),
      ]),
    ].filter(([, value]) => value);

    dom.activeFilters.innerHTML = filters.length
      ? filters
          .map(
            ([key, , label]) =>
              `<button type="button" data-filter-remove="${escapeHtml(key)}">${escapeHtml(label)} <span aria-hidden="true">×</span></button>`,
          )
          .join("")
      : '<span class="active-filters-empty">No filters applied</span>';
  }

  function markerPopup(venue) {
    return `<span class="popup-title">${escapeHtml(venue.name)}</span><span class="popup-meta">${escapeHtml(venue.primaryType)} · ${escapeHtml(venue.area)}</span><span class="popup-capacity">${escapeHtml(capacityLabel(venue))}</span>`;
  }

  function createVenueMarker(venue, displayLat, displayLng) {
    const markerType = venue.primaryType;
    const icon = L.divIcon({
      className: "",
      html: `<span class="venue-marker ${getMarkerClass(markerType)}" aria-hidden="true">${escapeHtml((markerType || "?").charAt(0))}</span>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -12],
    });
    const marker = L.marker([displayLat, displayLng], {
      icon,
      title: `${venue.name}, ${venue.area}`,
      alt: `${venue.name}, ${venue.area}`,
      keyboard: true,
    }).bindPopup(markerPopup(venue));
    marker.on("click", () => activateVenue(venue.id, true));
    marker.addTo(state.markerLayer);
    state.markers.set(venue.id, marker);
  }

  function createAreaCluster(area, venues) {
    const latitude =
      venues.reduce((sum, venue) => sum + venue.lat, 0) / venues.length;
    const longitude =
      venues.reduce((sum, venue) => sum + venue.lng, 0) / venues.length;
    const icon = L.divIcon({
      className: "",
      html: `<span class="venue-marker venue-cluster" aria-hidden="true">${venues.length}</span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
    const marker = L.marker([latitude, longitude], {
      icon,
      title: `${venues.length} venue${venues.length === 1 ? "" : "s"} in ${area}`,
      alt: `${venues.length} venue${venues.length === 1 ? "" : "s"} in ${area}`,
      keyboard: true,
    });
    marker.bindTooltip(
      `${area} · ${venues.length} venue${venues.length === 1 ? "" : "s"}`,
      {
      direction: "top",
      offset: [0, -14],
      },
    );
    marker.on("click", () => {
      const bounds = venues.map((venue) => [venue.lat, venue.lng]);
      state.map.fitBounds(bounds, { padding: [42, 42], maxZoom: 14 });
    });
    marker.addTo(state.markerLayer);
  }

  function renderMarkers() {
    if (!state.markerLayer || !state.map) return;
    state.markerLayer.clearLayers();
    state.markers.clear();
    const mapped = state.filtered.filter(
      (venue) => Number.isFinite(venue.lat) && Number.isFinite(venue.lng),
    );
    const shouldCluster =
      state.map.getZoom() <= CLUSTER_ZOOM && mapped.length > 20;

    if (shouldCluster) {
      const groups = mapped.reduce((result, venue) => {
        (result[venue.area] ||= []).push(venue);
        return result;
      }, {});
      Object.entries(groups).forEach(([area, venues]) =>
        createAreaCluster(area, venues),
      );
      renderStats();
      return;
    }

    const coordinateUse = new Map();
    mapped.forEach((venue) => {
      const coordinateKey = `${venue.lat.toFixed(5)},${venue.lng.toFixed(5)}`;
      const coordinateIndex = coordinateUse.get(coordinateKey) || 0;
      coordinateUse.set(coordinateKey, coordinateIndex + 1);
      const angle = coordinateIndex * 2.399963;
      const radius = coordinateIndex
        ? 0.00012 * Math.ceil(coordinateIndex / 6)
        : 0;
      createVenueMarker(
        venue,
        venue.lat + Math.sin(angle) * radius,
        venue.lng + Math.cos(angle) * radius,
      );
    });
    renderStats();
  }

  function fitMapToFiltered() {
    if (!state.map) return;
    const bounds = state.filtered
      .filter((venue) => Number.isFinite(venue.lat) && Number.isFinite(venue.lng))
      .map((venue) => [venue.lat, venue.lng]);
    if (bounds.length > 1) {
      state.map.fitBounds(bounds, { padding: [32, 32], maxZoom: 14 });
    } else if (bounds.length === 1) {
      state.map.setView(bounds[0], 14);
    }
  }

  function spacesTable(venue) {
    const spaces = (venue.spaces || [])
      .slice()
      .sort((a, b) => maxSpaceCapacity(b) - maxSpaceCapacity(a))
      .slice(0, 6);
    if (!spaces.length) {
      return '<p class="space-empty">Named public spaces are not recorded for this venue.</p>';
    }
    return `
      <div class="space-table" role="table" aria-label="Recorded spaces at ${escapeHtml(venue.name)}">
        ${spaces
          .map(
            (space) => `
              <div class="space-row" role="row">
                <div role="cell">
                  <strong>${escapeHtml(space.name)}</strong>
                  ${space.note ? `<small>${escapeHtml(space.note)}</small>` : ""}
                </div>
                <div role="cell">
                  <span>${escapeHtml(spaceCapacitySummary(space))}</span>
                  ${space.areaSqm ? `<small>${Number(space.areaSqm).toLocaleString("en-SG")} sqm${space.ceilingM ? ` · ${space.ceilingM} m ceiling` : ""}</small>` : ""}
                </div>
              </div>`,
          )
          .join("")}
      </div>`;
  }

  function venueCard(venue) {
    const sourceUrl = websiteHref(venue.sourceUrl || venue.website);
    const imageLicenseUrl = websiteHref(venue.imageLicenseUrl);
    const isSelected = state.shortlist.has(venue.id);
    const isExpanded = state.expanded.has(venue.id);
    const activeClass = state.activeVenueId === venue.id ? " is-active" : "";
    const propertyTags = (venue.propertyTypes || [venue.primaryType]).slice(0, 3);
    const settingTags = (venue.settings || []).slice(0, 5);
    const eventTags = (venue.eventTypes || []).slice(0, 5);
    const facts = [
      capacityLabel(venue),
      venue.maxAreaSqm
        ? `Largest recorded area ${Number(venue.maxAreaSqm).toLocaleString("en-SG")} sqm`
        : "",
    ].filter(Boolean);

    return `
      <article class="venue-card${activeClass}" data-venue-card="${escapeHtml(venue.id)}">
        <div class="venue-thumb">
          ${
            venue.image
              ? `<img src="${escapeHtml(venue.image)}" alt="${escapeHtml(venue.name)} in ${escapeHtml(venue.area)}, Singapore" loading="lazy" decoding="async" width="560" height="350" />`
              : `<div class="venue-location-card"><span>${escapeHtml(venue.area)}</span><strong>${escapeHtml(venue.name)}</strong><small>Location record</small></div>`
          }
          <span class="confidence-badge confidence-${escapeHtml(venue.dataConfidence)}">${escapeHtml(confidenceLabel(venue.dataConfidence))}</span>
        </div>
        <div class="venue-body">
          <div class="venue-summary">
            <div class="venue-meta">
              ${propertyTags.map((tag, index) => `<span class="tag ${index === 0 ? "accent" : ""}">${escapeHtml(tag)}</span>`).join("")}
              <span class="tag">${escapeHtml(venue.area)}</span>
            </div>
            <h3>${escapeHtml(venue.name)}</h3>
            <p class="venue-address">${escapeHtml(venue.address || "Address requires source review")}</p>
            <p class="venue-facts">${facts.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</p>
          </div>
          <details class="venue-details" data-venue-details="${escapeHtml(venue.id)}"${isExpanded ? " open" : ""}>
            <summary><span>Spaces and planning details</span><small>Layouts, sources and review date</small></summary>
            <div class="venue-detail-content">
              <div class="venue-meta setting-tags">${settingTags.map((tag) => `<span class="tag setting">${escapeHtml(tag)}</span>`).join("")}</div>
              <div class="venue-meta">${eventTags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
              <p class="venue-note">${escapeHtml(venue.publicNote)}</p>
              ${
                venue.imageCredit
                  ? `<p class="image-credit">Image credit: ${
                      imageLicenseUrl
                        ? `<a href="${escapeHtml(imageLicenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(venue.imageCredit)}</a>`
                        : escapeHtml(venue.imageCredit)
                    }</p>`
                  : ""
              }
              ${spacesTable(venue)}
              <div class="source-row">
                <span>${escapeHtml(confidenceLabel(venue.dataConfidence))} · reviewed ${escapeHtml(formatDate(venue.auditReviewedAt || venue.lastVerified))}</span>
                <div class="source-links">
                  ${venue.featuredDetail ? `<a class="venue-site-link" href="/singapore-event-venues/${escapeHtml(venue.id)}/" data-track-link="reviewed_detail" data-track-venue="${escapeHtml(venue.id)}">Open reviewed venue guide →</a>` : ""}
                  ${sourceUrl ? `<a class="venue-site-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer" data-track-link="venue_source" data-track-venue="${escapeHtml(venue.id)}">${venue.sourceType === "Official venue website" ? "Open official venue site" : "Open public source"} ↗</a>` : '<span>Public source link not recorded</span>'}
                </div>
              </div>
            </div>
          </details>
          <div class="venue-actions">
            <button type="button" class="${isSelected ? "is-selected" : ""}" data-shortlist-toggle="${escapeHtml(venue.id)}">${isSelected ? "Selected" : "Add to shortlist"}</button>
            <button type="button" data-map-focus="${escapeHtml(venue.id)}">Show on map</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderResults() {
    if (!dom.resultList) return;
    if (!state.filtered.length) {
      dom.resultList.innerHTML =
        '<div class="no-results">No venue matches every selected filter. Remove one filter or send ACT Creative the event brief for a manual shortlist.</div>';
      if (dom.loadMoreWrap) dom.loadMoreWrap.hidden = true;
      return;
    }
    const visible = state.filtered.slice(0, state.visibleCount);
    dom.resultList.innerHTML = visible.map(venueCard).join("");
    if (dom.loadMoreWrap) {
      dom.loadMoreWrap.hidden = visible.length >= state.filtered.length;
    }
    if (dom.renderedSummary) {
      dom.renderedSummary.textContent = `Showing ${visible.length} of ${state.filtered.length}`;
    }
  }

  function compareTable(selected) {
    const rows = [
      [
        "Area",
        (venue) => venue.area,
      ],
      [
        "Venue type",
        (venue) => venue.primaryType,
      ],
      [
        "Largest recorded setup",
        (venue) => capacityLabel(venue),
      ],
      [
        "Settings",
        (venue) => (venue.settings || []).slice(0, 4).join(", ") || "Not recorded",
      ],
      [
        "Named spaces",
        (venue) => String((venue.spaces || []).length),
      ],
      [
        "Source status",
        (venue) =>
          `${confidenceLabel(venue.dataConfidence)} · ${formatDate(venue.lastVerified)}`,
      ],
    ];
    return `
      <table>
        <thead>
          <tr>
            <th scope="col">Compare</th>
            ${selected.map((venue) => `<th scope="col">${escapeHtml(venue.name)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([label, getter]) => `
                <tr>
                  <th scope="row">${escapeHtml(label)}</th>
                  ${selected.map((venue) => `<td>${escapeHtml(getter(venue))}</td>`).join("")}
                </tr>`,
            )
            .join("")}
        </tbody>
      </table>`;
  }

  function renderCompare() {
    const selected = state.venues.filter((venue) =>
      state.shortlist.has(venue.id),
    );
    if (dom.compareToggle) {
      dom.compareToggle.disabled = selected.length < 2;
      dom.compareToggle.textContent =
        selected.length >= 2
          ? `Compare ${selected.length} selected venues`
          : "Select 2–5 venues to compare";
    }
    if (!dom.comparePanel || !dom.compareTable) return;
    if (!state.compareOpen || selected.length < 2) {
      dom.comparePanel.hidden = true;
      return;
    }
    dom.comparePanel.hidden = false;
    dom.compareTable.innerHTML = compareTable(selected);
  }

  function renderShortlist() {
    const selected = state.venues.filter((venue) =>
      state.shortlist.has(venue.id),
    );
    if (dom.shortlistCount) {
      dom.shortlistCount.textContent = `${selected.length} selected`;
    }

    if (dom.shortlistList) {
      dom.shortlistList.innerHTML = selected.length
        ? selected
            .map(
              (venue) =>
                `<div class="shortlist-pill"><span>${escapeHtml(venue.name)}</span><button type="button" aria-label="Remove ${escapeHtml(venue.name)}" data-shortlist-remove="${escapeHtml(venue.id)}">×</button></div>`,
            )
            .join("")
        : '<p class="empty-note">Add 2–5 venues to compare their public planning information.</p>';
    }

    if (dom.shortlistWhatsapp) {
      const venueNames = selected
        .map((venue) => `- ${venue.name} (${venue.area})`)
        .join("\n");
      const text = selected.length
        ? `Hi ACT Creative, I would like help reviewing these Singapore event venues:\n\n${venueNames}\n\nGuest count:\nEvent format:\nProduction needs:`
        : "Hi ACT Creative, I would like help shortlisting Singapore event venues.";
      dom.shortlistWhatsapp.href =
        `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
    }

    renderCompare();
    renderResults();
  }

  function toggleShortlist(venueId) {
    if (state.shortlist.has(venueId)) {
      state.shortlist.delete(venueId);
    } else {
      if (state.shortlist.size >= MAX_SHORTLIST) {
        if (dom.shareStatus) {
          dom.shareStatus.textContent =
            "The comparison is limited to five venues. Remove one before adding another.";
        }
        return;
      }
      state.shortlist.add(venueId);
    }
    renderShortlist();
    track("venue_shortlist_changed", {
      venue_id: venueId,
      shortlist_count: state.shortlist.size,
    });
  }

  function activateVenue(venueId, scrollCard) {
    state.activeVenueId = venueId;
    const venue = state.venues.find((item) => item.id === venueId);
    const filteredIndex = state.filtered.findIndex((item) => item.id === venueId);
    if (filteredIndex >= state.visibleCount) {
      state.visibleCount =
        Math.ceil((filteredIndex + 1) / PAGE_SIZE) * PAGE_SIZE;
    }
    renderResults();

    if (venue && state.map) {
      state.map.setView([venue.lat, venue.lng], Math.max(state.map.getZoom(), 14));
      setTimeout(() => {
        renderMarkers();
        state.markers.get(venueId)?.openPopup();
      }, 180);
    }
    if (scrollCard) {
      setTimeout(() => {
        const card = document.querySelector(
          `[data-venue-card="${CSS.escape(venueId)}"]`,
        );
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 0);
    }
    track("venue_map_focus", { venue_id: venueId });
  }

  function removeFilter(key) {
    if (key.startsWith("quick:")) {
      state.quickFilters.delete(key.split(":")[1]);
      syncQuickFilterButtons();
    } else {
      const controls = {
        search: dom.search,
        area: dom.area,
        kind: dom.kind,
        setting: dom.setting,
        event: dom.event,
        capacity: dom.capacity,
      };
      if (controls[key]) controls[key].value = "";
    }
    applyFilters({ fitMap: true });
  }

  function setViewMode(mode) {
    state.viewMode = mode;
    if (dom.mapResults) {
      dom.mapResults.classList.toggle("view-map", mode === "map");
      dom.mapResults.classList.toggle("view-list", mode === "list");
    }
    document.querySelectorAll("[data-view-mode]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.getAttribute("data-view-mode") === mode),
      );
    });
    if (mode === "map") setTimeout(refreshMapSize, 80);
  }

  async function copyFilterLink() {
    syncHashState();
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (dom.shareStatus) {
        dom.shareStatus.textContent = "Filter link copied.";
      }
      track("venue_filters_shared", { result_count: state.filtered.length });
    } catch {
      if (dom.shareStatus) {
        dom.shareStatus.textContent =
          "Copy was blocked by the browser. Use the current address-bar link.";
      }
    }
  }

  function updateBackToTop() {
    if (!dom.backToTop) return;
    dom.backToTop.classList.toggle("is-visible", window.scrollY > 700);
  }

  function initVenueBriefForm() {
    const form = document.querySelector("[data-venue-brief-form]");
    if (!form) return;

    const fileInput = form.querySelector('input[type="file"]');
    const fileSummary = form.querySelector("[data-file-summary]");
    const status = form.querySelector("[data-form-status]");
    const getFileNames = () =>
      fileInput?.files?.length
        ? Array.from(fileInput.files).map((file) => file.name)
        : [];

    fileInput?.addEventListener("change", () => {
      const files = getFileNames();
      if (!fileSummary) return;
      fileSummary.textContent = files.length
        ? `Selected files: ${files.join(", ")}. Attach them in your email client after clicking Prepare venue brief.`
        : "Files cannot be attached automatically through a browser mail link. Select them here to record the filenames, then attach them in your email client.";
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const lines = [
        "Singapore Venue Service Brief",
        "",
        `Contact name: ${data.get("Contact name") || ""}`,
        `Company / brand: ${data.get("Company or brand") || ""}`,
        `Email: ${data.get("Email") || ""}`,
        `Phone / WhatsApp: ${data.get("Phone or WhatsApp") || ""}`,
        "",
        `Event type: ${data.get("Event type") || ""}`,
        `Expected guest count: ${data.get("Expected guest count") || ""}`,
        `Preferred date or date range: ${data.get("Preferred date or date range") || ""}`,
        `Preferred area: ${data.get("Preferred area") || ""}`,
        `Budget direction: ${data.get("Budget range") || ""}`,
        `Venue format: ${data.get("Venue format") || ""}`,
        "",
        "Event description:",
        data.get("Event description") || "",
        "",
        "Restrictions or site details to check:",
        data.get("Restrictions to check") || "",
        "",
        `Reference files selected: ${getFileNames().join(", ") || "None selected"}`,
        "",
        "Please attach any selected files before sending.",
      ];
      const mailtoUrl =
        "mailto:contact@actcreative.net?subject=" +
        encodeURIComponent("Singapore venue service brief") +
        "&body=" +
        encodeURIComponent(lines.join("\n"));

      if (status) {
        status.textContent =
          "Opening your email client with the structured venue brief.";
      }
      track("venue_brief_prepared", {
        venue_count: state.shortlist.size,
      });
      window.location.href = mailtoUrl;
    });
  }

  document.addEventListener("click", (event) => {
    const shortlistToggle = event.target.closest("[data-shortlist-toggle]");
    if (shortlistToggle) {
      toggleShortlist(shortlistToggle.getAttribute("data-shortlist-toggle"));
      return;
    }

    const shortlistRemove = event.target.closest("[data-shortlist-remove]");
    if (shortlistRemove) {
      toggleShortlist(shortlistRemove.getAttribute("data-shortlist-remove"));
      return;
    }

    const mapFocus = event.target.closest("[data-map-focus]");
    if (mapFocus) {
      activateVenue(mapFocus.getAttribute("data-map-focus"), false);
      setViewMode("map");
      return;
    }

    const quickFilter = event.target.closest("[data-quick-filter]");
    if (quickFilter) {
      const value = quickFilter.getAttribute("data-quick-filter");
      if (state.quickFilters.has(value)) state.quickFilters.delete(value);
      else state.quickFilters.add(value);
      syncQuickFilterButtons();
      applyFilters({ fitMap: true });
      return;
    }

    const filterRemove = event.target.closest("[data-filter-remove]");
    if (filterRemove) {
      removeFilter(filterRemove.getAttribute("data-filter-remove"));
      return;
    }

    const viewMode = event.target.closest("[data-view-mode]");
    if (viewMode) {
      setViewMode(viewMode.getAttribute("data-view-mode"));
      return;
    }

    const trackedLink = event.target.closest("[data-track-link]");
    if (trackedLink) {
      track("venue_link_opened", {
        link_type: trackedLink.getAttribute("data-track-link"),
        venue_id: trackedLink.getAttribute("data-track-venue") || "",
      });
      return;
    }

    if (event.target.closest("[data-load-more]")) {
      state.visibleCount += PAGE_SIZE;
      renderResults();
      track("venue_results_loaded", {
        rendered_count: Math.min(state.visibleCount, state.filtered.length),
      });
      return;
    }

    if (event.target.closest("[data-compare-toggle]")) {
      state.compareOpen = true;
      renderCompare();
      dom.comparePanel?.scrollIntoView({ behavior: "smooth", block: "start" });
      track("venue_comparison_opened", {
        venue_count: state.shortlist.size,
      });
      return;
    }

    if (event.target.closest("[data-compare-close]")) {
      state.compareOpen = false;
      renderCompare();
      return;
    }

    if (event.target.closest("[data-share-filters]")) {
      copyFilterLink();
    }
  });

  document.addEventListener(
    "toggle",
    (event) => {
      const details =
        event.target.closest && event.target.closest("[data-venue-details]");
      if (!details) return;
      const venueId = details.getAttribute("data-venue-details");
      if (details.open) {
        state.expanded.add(venueId);
        track("venue_details_opened", { venue_id: venueId });
      } else {
        state.expanded.delete(venueId);
      }
    },
    true,
  );

  if (dom.backToTop) {
    dom.backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
  }

  window.addEventListener("hashchange", () => {
    readHashState();
    applyFilters({ fitMap: true });
  });

  initVenueBriefForm();

  fetch(DATA_URL)
    .then((response) => {
      if (!response.ok) throw new Error("Venue dataset failed to load.");
      return response.json();
    })
    .then((data) => {
      state.data = data;
      state.venues = data.venues || [];
      if (dom.totalStat) {
        dom.totalStat.textContent = data.publicCount || state.venues.length;
      }
      if (dom.mappedStat) {
        dom.mappedStat.textContent =
          data.mappedCount ||
          state.venues.filter(
            (venue) => Number.isFinite(venue.lat) && Number.isFinite(venue.lng),
          ).length;
      }
      initFilters();
      setViewMode(
        window.matchMedia("(max-width: 840px)").matches ? "map" : "list",
      );
      requestAnimationFrame(() => {
        setTimeout(() => {
          initMap();
          applyFilters({ fitMap: true });
          renderShortlist();
          window.addEventListener("load", refreshMapSize, { once: true });
          setTimeout(refreshMapSize, 350);
        }, 80);
      });
    })
    .catch((error) => {
      if (dom.resultList) {
        dom.resultList.innerHTML = `<div class="no-results">${escapeHtml(error.message)} Please refresh the page or contact ACT Creative for a manual venue shortlist.</div>`;
      }
      if (dom.mapSummary) {
        dom.mapSummary.textContent = "Venue data could not be loaded.";
      }
    });
})();
