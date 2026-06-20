(function () {
  const DATA_URL = "/singapore-event-venue-finder/venue-data.json";
  const WHATSAPP_BASE = "https://wa.me/6584515268";

  const dom = {
    kind: document.querySelector("[data-filter-kind]"),
    setting: document.querySelector("[data-filter-setting]"),
    event: document.querySelector("[data-filter-event]"),
    area: document.querySelector("[data-filter-area]"),
    capacity: document.querySelector("[data-filter-capacity]"),
    clear: document.querySelector("[data-clear-filters]"),
    resultList: document.querySelector("[data-result-list]"),
    resultCount: document.querySelector("[data-result-count]"),
    visibleStat: document.querySelector("[data-stat-visible]"),
    totalStat: document.querySelector("[data-stat-total]"),
    mappedStat: document.querySelector("[data-stat-mapped]"),
    mapSummary: document.querySelector("[data-map-summary]"),
    shortlistList: document.querySelector("[data-shortlist-list]"),
    shortlistCount: document.querySelector("[data-shortlist-count]"),
    shortlistWhatsapp: document.querySelector("[data-shortlist-whatsapp]"),
    backToTop: document.querySelector("[data-back-to-top]"),
  };

  const state = {
    data: null,
    venues: [],
    filtered: [],
    shortlist: new Set(),
    expanded: new Set(),
    map: null,
    markerLayer: null,
    markers: new Map(),
    activeVenueId: null,
  };

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function uniq(values) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }

  function normalise(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  }

  function websiteHref(site) {
    const value = String(site || "").trim();
    if (!value || ["?", "-", "—", "n/a", "none"].includes(value.toLowerCase())) return "";
    try {
      const url = new URL(/^https?:\/\//i.test(value) ? value : "https://" + value);
      if (!["http:", "https:"].includes(url.protocol) || !url.hostname.includes(".")) return "";
      return url.href;
    } catch {
      return "";
    }
  }

  function capacityLabel(value) {
    if (!value) return "Capacity to check";
    return Number(value).toLocaleString("en-SG") + "+ pax signal";
  }

  function getMarkerClass(kind) {
    const lower = normalise(kind);
    if (lower.includes("outdoor")) return "outdoor";
    if (lower.includes("hotel")) return "hotel";
    if (lower.includes("restaurant")) return "restaurant";
    if (lower.includes("gallery") || lower.includes("culture")) return "culture";
    if (lower.includes("conference") || lower.includes("hall")) return "conference";
    return "";
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

  function initFilters() {
    populateSelect(dom.kind, uniq(state.venues.flatMap((venue) => venue.propertyTypes || [venue.kind])));
    populateSelect(dom.setting, uniq(state.venues.flatMap((venue) => venue.settings || [])));
    populateAreaSelect();
    populateSelect(dom.event, uniq(state.venues.flatMap((venue) => venue.eventTypes || [])));

    [dom.kind, dom.setting, dom.area, dom.event, dom.capacity].forEach((input) => {
      if (input) input.addEventListener("input", applyFilters);
    });

    if (dom.clear) {
      dom.clear.addEventListener("click", () => {
        if (dom.kind) dom.kind.value = "";
        if (dom.setting) dom.setting.value = "";
        if (dom.area) dom.area.value = "";
        if (dom.event) dom.event.value = "";
        if (dom.capacity) dom.capacity.value = "";
        applyFilters();
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
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(state.map);

    const mapElement = document.getElementById("venue-map");
    const syncMapZoom = () => {
      if (mapElement) mapElement.dataset.zoom = String(state.map.getZoom());
    };
    state.map.on("zoomend", syncMapZoom);
    syncMapZoom();

    state.markerLayer = L.layerGroup().addTo(state.map);
  }

  function refreshMapSize() {
    if (!state.map) return;
    state.map.invalidateSize();
    renderMarkers();
  }

  function matchesFilters(venue) {
    const kind = dom.kind && dom.kind.value;
    const setting = dom.setting && dom.setting.value;
    const eventType = dom.event && dom.event.value;
    const area = dom.area && dom.area.value;
    const capacity = Number(dom.capacity && dom.capacity.value);

    if (kind && !(venue.propertyTypes || [venue.kind]).includes(kind)) return false;
    if (setting && !(venue.settings || []).includes(setting)) return false;
    if (eventType && !(venue.eventTypes || []).includes(eventType)) return false;
    if (area && venue.area !== area) return false;
    if (capacity && Number(venue.maxCapacity || 0) < capacity) return false;
    return true;
  }

  function sortVenues(venues) {
    return venues.slice().sort((a, b) => {
      const capDiff = Number(b.maxCapacity || 0) - Number(a.maxCapacity || 0);
      if (capDiff !== 0) return capDiff;
      return a.name.localeCompare(b.name);
    });
  }

  function applyFilters() {
    state.filtered = sortVenues(state.venues.filter(matchesFilters));
    renderStats();
    renderMarkers();
    renderResults();
  }

  function renderStats() {
    if (dom.resultCount) dom.resultCount.textContent = state.filtered.length;
    if (dom.visibleStat) dom.visibleStat.textContent = state.filtered.length;
    const mapped = state.filtered.filter((venue) => Number.isFinite(venue.lat) && Number.isFinite(venue.lng)).length;
    if (dom.mapSummary) {
      dom.mapSummary.textContent = `${mapped} mapped markers from ${state.filtered.length} matching venues`;
    }
  }

  function markerPopup(venue) {
    const capacity = capacityLabel(venue.maxCapacity);
    return `<span class="popup-title">${escapeHtml(venue.name)}</span><span class="popup-meta">${escapeHtml(venue.primaryType || venue.kind)} · ${escapeHtml(venue.area)} · ${escapeHtml(capacity)}</span>`;
  }

  function renderMarkers() {
    if (!state.markerLayer) return;
    state.markerLayer.clearLayers();
    state.markers.clear();

    const bounds = [];
    const coordinateUse = new Map();
    state.filtered.forEach((venue) => {
      if (!Number.isFinite(venue.lat) || !Number.isFinite(venue.lng)) return;
      const coordinateKey = `${venue.lat.toFixed(5)},${venue.lng.toFixed(5)}`;
      const coordinateIndex = coordinateUse.get(coordinateKey) || 0;
      coordinateUse.set(coordinateKey, coordinateIndex + 1);
      const angle = coordinateIndex * 2.399963;
      const radius = coordinateIndex ? 0.00012 * Math.ceil(coordinateIndex / 6) : 0;
      const displayLat = venue.lat + Math.sin(angle) * radius;
      const displayLng = venue.lng + Math.cos(angle) * radius;
      const markerType = venue.primaryType || venue.kind;
      const icon = L.divIcon({
        className: "",
        html: `<span class="venue-marker ${getMarkerClass(markerType)}">${escapeHtml((markerType || "?").charAt(0))}</span>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -12],
      });
      const marker = L.marker([displayLat, displayLng], { icon }).bindPopup(markerPopup(venue));
      marker.on("click", () => activateVenue(venue.id, true));
      marker.addTo(state.markerLayer);
      state.markers.set(venue.id, marker);
      bounds.push([displayLat, displayLng]);
    });

    if (bounds.length > 1) {
      state.map.fitBounds(bounds, { padding: [32, 32], maxZoom: 14 });
    } else if (bounds.length === 1) {
      state.map.setView(bounds[0], 14);
    }
  }

  function venueCard(venue) {
    const website = websiteHref(venue.website);
    const isSelected = state.shortlist.has(venue.id);
    const isExpanded = state.expanded.has(venue.id);
    const activeClass = state.activeVenueId === venue.id ? " is-active" : "";
    const propertyTags = (venue.propertyTypes || [venue.kind]).slice(0, 3);
    const settingTags = (venue.settings || []).slice(0, 4);
    const eventTags = (venue.eventTypes || []).slice(0, 4);
    const facts = [
      capacityLabel(venue.maxCapacity),
      venue.maxAreaSqm ? `${Number(venue.maxAreaSqm).toLocaleString("en-SG")} sqm max area signal` : "",
      `${(venue.spaces || []).length || 1} recorded space${(venue.spaces || []).length === 1 ? "" : "s"}`,
    ].filter(Boolean);

    return `
      <article class="venue-card${activeClass}" data-venue-card="${escapeHtml(venue.id)}">
        <div class="venue-thumb">
          ${venue.image
            ? `<img src="${escapeHtml(venue.image)}" alt="${escapeHtml(venue.name)} in ${escapeHtml(venue.area)}, Singapore" loading="lazy" width="280" height="220" />`
            : `<div class="venue-location-card"><span>${escapeHtml(venue.area)}</span><strong>${escapeHtml(venue.name)}</strong><small>Location record</small></div>`}
        </div>
        <div class="venue-body">
          <div class="venue-summary">
            <div class="venue-meta">
              ${propertyTags.map((tag, index) => `<span class="tag ${index === 0 ? "accent" : ""}">${escapeHtml(tag)}</span>`).join("")}
              <span class="tag">${escapeHtml(venue.area)}</span>
            </div>
            <h3>${escapeHtml(venue.name)}</h3>
            <p class="venue-address">${escapeHtml(venue.address || "Address to check")}</p>
            <p class="venue-facts">${facts.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</p>
          </div>
          <details class="venue-details" data-venue-details="${escapeHtml(venue.id)}"${isExpanded ? " open" : ""}>
            <summary><span>Venue details</span><small>Tags, venue overview${website ? " and website" : ""}</small></summary>
            <div class="venue-detail-content">
              <div class="venue-meta setting-tags">${settingTags.map((tag) => `<span class="tag setting">${escapeHtml(tag)}</span>`).join("")}</div>
              <div class="venue-meta">${eventTags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
              <p class="venue-note">${escapeHtml(venue.publicNote)}</p>
              ${website ? `<a class="venue-site-link" href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer">Open official venue site ↗</a>` : ""}
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
      dom.resultList.innerHTML = '<div class="no-results">No matching venue in this public MVP set. Try removing one filter or send ACT Creative the brief for manual venue options.</div>';
      return;
    }
    dom.resultList.innerHTML = state.filtered.map(venueCard).join("");
  }

  function renderShortlist() {
    const selected = state.venues.filter((venue) => state.shortlist.has(venue.id));
    if (dom.shortlistCount) {
      dom.shortlistCount.textContent = `${selected.length} selected`;
    }

    if (dom.shortlistList) {
      dom.shortlistList.innerHTML = selected.length
        ? selected.map((venue) => `<div class="shortlist-pill"><span>${escapeHtml(venue.name)}</span><button type="button" aria-label="Remove ${escapeHtml(venue.name)}" data-shortlist-remove="${escapeHtml(venue.id)}">×</button></div>`).join("")
        : '<p class="empty-note">Add venues from the result list to prepare an enquiry.</p>';
    }

    if (dom.shortlistWhatsapp) {
      const venueNames = selected.map((venue) => `- ${venue.name} (${venue.area})`).join("\n");
      const text = selected.length
        ? `Hi ACT Creative, I would like help checking these Singapore event venues:\n\n${venueNames}\n\nEvent date:\nGuest count:\nEvent format:\nProduction needs:`
        : "Hi ACT Creative, I would like help shortlisting Singapore event venues.";
      dom.shortlistWhatsapp.href = WHATSAPP_BASE + "?text=" + encodeURIComponent(text);
    }

    renderResults();
  }

  function toggleShortlist(venueId) {
    if (state.shortlist.has(venueId)) {
      state.shortlist.delete(venueId);
    } else {
      state.shortlist.add(venueId);
    }
    renderShortlist();
  }

  function activateVenue(venueId, scrollCard) {
    state.activeVenueId = venueId;
    const venue = state.venues.find((item) => item.id === venueId);
    const marker = state.markers.get(venueId);
    if (venue && marker && state.map) {
      state.map.setView([venue.lat, venue.lng], Math.max(state.map.getZoom(), 14));
      marker.openPopup();
    }
    renderResults();
    if (scrollCard) {
      const card = document.querySelector(`[data-venue-card="${CSS.escape(venueId)}"]`);
      if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function updateBackToTop() {
    if (!dom.backToTop) return;
    dom.backToTop.classList.toggle("is-visible", window.scrollY > 700);
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
    }
  });

  document.addEventListener("toggle", (event) => {
    const details = event.target.closest && event.target.closest("[data-venue-details]");
    if (!details) return;
    const venueId = details.getAttribute("data-venue-details");
    if (details.open) state.expanded.add(venueId);
    else state.expanded.delete(venueId);
  }, true);

  if (dom.backToTop) {
    dom.backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();
  }

  fetch(DATA_URL)
    .then((response) => {
      if (!response.ok) throw new Error("Venue dataset failed to load.");
      return response.json();
    })
    .then((data) => {
      state.data = data;
      state.venues = data.venues || [];
      if (dom.totalStat) dom.totalStat.textContent = data.publicCount || state.venues.length;
      if (dom.mappedStat) dom.mappedStat.textContent = data.mappedCount || state.venues.filter((venue) => Number.isFinite(venue.lat) && Number.isFinite(venue.lng)).length;
      initFilters();
      requestAnimationFrame(() => {
        setTimeout(() => {
          initMap();
          applyFilters();
          renderShortlist();
          window.addEventListener("load", refreshMapSize, { once: true });
          setTimeout(refreshMapSize, 350);
          setTimeout(refreshMapSize, 1200);
        }, 80);
      });
    })
    .catch((error) => {
      if (dom.resultList) {
        dom.resultList.innerHTML = `<div class="no-results">${escapeHtml(error.message)} Please refresh the page or contact ACT Creative for a manual venue shortlist.</div>`;
      }
      if (dom.mapSummary) dom.mapSummary.textContent = "Venue data could not be loaded.";
    });
})();
