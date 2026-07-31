(function () {
  const html = htm.bind(React.createElement);
  const site = window.ACT_CREATIVE_SITE_CONTENT;
  const projects = window.ACT_CREATIVE_PROJECTS;
  const brands = window.ACT_CREATIVE_BRANDS;

  if (!site || !projects || !brands) {
    const appRoot = document.getElementById("app");
    if (appRoot) {
      appRoot.innerHTML = `
        <main style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#050505;color:#f5f7f0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
          <div style="max-width:680px;border:1px solid rgba(204,255,0,.2);border-radius:24px;padding:28px;background:rgba(12,12,12,.9);box-shadow:0 24px 80px rgba(0,0,0,.4);">
            <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#ccff00;">Preview Reload Required</p>
            <h1 style="margin:0 0 12px;font-size:34px;line-height:1;color:#ffffff;">The page scripts loaded out of sync.</h1>
            <p style="margin:0;color:#b3b3b3;line-height:1.8;">Please refresh the page once. If the issue persists, use Ctrl+F5 to clear the cached local preview files.</p>
          </div>
        </main>
      `;
    }
    return;
  }

  const filters = [
    { key: "all", label: "All References" },
    { key: "large-scale", label: "Large-Scale" },
    { key: "public-art", label: "Public Art & Museum" },
    { key: "small-scale", label: "Small-Scale" },
    { key: "collectibles", label: "Collectibles" },
    { key: "special-finish", label: "Special Finish" },
    { key: "museum", label: "Clay & Museum" },
    { key: "spatial-frp", label: "Spatial FRP" },
    { key: "stainless-steel", label: "Stainless Steel" },
    { key: "multi-material", label: "Multi-Material" },
  ];

  const CASE_GROUPS = [
    {
      id: "large-group",
      title: "Large-Scale Sculptures & Brand Installations",
      description:
        "Oversized structures, branded activations, outdoor builds and statement IP projects intended to anchor a site or campaign.",
      categories: ["large-scale"],
      stat: "Large-scale",
      curatedCount: 6,
      tone:
        "border-[#5c8200] bg-[radial-gradient(circle_at_top_left,rgba(204,255,0,0.18),transparent_34%),linear-gradient(180deg,rgba(16,16,16,0.98),rgba(8,8,8,0.98))]",
      startExpanded: false,
    },
    {
      id: "public-group",
      title: "Public Art, Exhibition & Museum Fabrication",
      description:
        "Public-facing sculpture, exhibition builds, museum delivery and artist-collaboration fabrication with stronger site and presentation requirements.",
      categories: ["public-art", "museum"],
      stat: "Public / institutional",
      curatedCount: 5,
      tone:
        "border-[#4a640f] bg-[radial-gradient(circle_at_top_left,rgba(180,255,72,0.14),transparent_34%),linear-gradient(180deg,rgba(13,15,11,0.98),rgba(7,8,7,0.98))]",
      startExpanded: false,
    },
    {
      id: "spatial-frp-group",
      title: "Commercial Spatial Sculpture, Seating & Planters",
      description:
        "Moulded FRP seating, planters, themed furniture and large commercial-space objects for malls, attractions and public-facing interiors.",
      categories: ["spatial-frp"],
      stat: "Spatial FRP",
      curatedCount: 5,
      tone:
        "border-[#526c0c] bg-[radial-gradient(circle_at_top_right,rgba(204,255,0,0.14),transparent_34%),linear-gradient(180deg,rgba(14,15,10,0.98),rgba(7,8,6,0.98))]",
      startExpanded: false,
    },
    {
      id: "stainless-group",
      title: "Stainless-Steel & Mirror-Finish Sculpture",
      description:
        "Abstract, figurative and landscape sculpture references using formed stainless steel, welding, polishing, electroplating and export-ready assembly.",
      categories: ["stainless-steel"],
      stat: "Metal / mirror finish",
      curatedCount: 6,
      tone:
        "border-[#6f7d55] bg-[radial-gradient(circle_at_top_left,rgba(216,229,199,0.13),transparent_34%),linear-gradient(180deg,rgba(15,16,14,0.98),rgba(7,8,7,0.98))]",
      startExpanded: false,
    },
    {
      id: "multi-material-group",
      title: "Multi-Material & Specialist Sculpture Processes",
      description:
        "An expanded production network for metal, FRP, foam, GRG/GRC, relief, large-format 3D printing, water features and painted sculpture.",
      categories: ["multi-material"],
      stat: "Specialist processes",
      curatedCount: 7,
      tone:
        "border-[#486f23] bg-[radial-gradient(circle_at_bottom_left,rgba(147,213,77,0.15),transparent_34%),linear-gradient(180deg,rgba(12,15,10,0.98),rgba(6,8,5,0.98))]",
      startExpanded: false,
    },
    {
      id: "small-group",
      title: "Small Sculpture & Decorative Objects",
      description:
        "Tabletop-to-display scale decorative pieces, custom props and commercial decor items suitable for retail, gifting or interior display.",
      categories: ["small-scale"],
      stat: "Small-scale",
      curatedCount: 5,
      tone:
        "border-[#384d00] bg-[radial-gradient(circle_at_top_left,rgba(204,255,0,0.1),transparent_32%),linear-gradient(180deg,rgba(12,12,12,0.98),rgba(7,7,7,0.98))]",
      startExpanded: false,
    },
    {
      id: "collectibles-group",
      title: "Collectibles, Blind Box & Special-Finish Series",
      description:
        "Collectibles, batch production references and finish-driven work such as plated, transparent resin or special-effect decorative items.",
      categories: ["collectibles", "special-finish"],
      stat: "Product / finish-led",
      curatedCount: 4,
      tone:
        "border-[#6d7a18] bg-[radial-gradient(circle_at_bottom_right,rgba(204,255,0,0.16),transparent_34%),linear-gradient(180deg,rgba(14,14,14,0.98),rgba(8,8,8,0.98))]",
      startExpanded: false,
    },
  ];

  const PRIMARY_BUTTON_CLASS =
    "primary-cta button-elevated inline-flex items-center justify-center rounded-full border border-accent bg-accent px-5 py-3 text-sm font-semibold text-black shadow-[0_0_28px_rgba(204,255,0,0.16)] hover:bg-[#d7ff57] hover:text-black";
  const SECONDARY_BUTTON_CLASS =
    "button-elevated inline-flex items-center justify-center rounded-full border border-line-strong bg-black px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.32)] hover:border-accent hover:text-accent";
  const PANEL_CLASS =
    "rounded-[1.8rem] border border-line bg-black/72 shadow-[0_20px_60px_rgba(0,0,0,0.36)]";
  const PANEL_SOFT_CLASS =
    "rounded-[1.6rem] border border-line bg-black/56 shadow-[0_18px_48px_rgba(0,0,0,0.32)]";
  const CONTROL_BUTTON_BASE =
    "case-action button-elevated inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold";
  const CONTROL_PRIMARY_BUTTON_CLASS =
    `${CONTROL_BUTTON_BASE} border border-accent bg-accent text-black shadow-[0_0_34px_rgba(204,255,0,0.24)] hover:bg-[#d7ff57] hover:text-black`;
  const CONTROL_SECONDARY_BUTTON_CLASS =
    `${CONTROL_BUTTON_BASE} border border-accent/70 bg-black text-white shadow-[0_22px_55px_rgba(0,0,0,0.38)] hover:border-accent hover:text-accent`;
  const preloadedImages = new Set();

  function trackPortfolioAction(name, label, details) {
    if (window.ACTInquiryAttribution?.trackAction) {
      window.ACTInquiryAttribution.trackAction(name, label, details);
    }
  }

  function getProjectProfile(project) {
    switch (project.category) {
      case "large-scale":
        return {
          scale: "Large-scale",
          type: "Brand / IP installation",
        };
      case "public-art":
        return {
          scale: "Medium to large",
          type: "Public art / exhibition",
        };
      case "small-scale":
        return {
          scale: "Small-scale",
          type: "Decor / custom object",
        };
      case "collectibles":
        return {
          scale: "Product scale",
          type: "Collectible series",
        };
      case "special-finish":
        return {
          scale: "Small to medium",
          type: "Special-finish fabrication",
        };
      case "museum":
        return {
          scale: "Medium-scale",
          type: "Museum display",
        };
      case "spatial-frp":
        return {
          scale: "Furniture to landmark",
          type: "Spatial FRP / public realm",
        };
      case "stainless-steel":
        return {
          scale: "Medium to large",
          type: "Stainless-steel sculpture",
        };
      case "multi-material":
        return {
          scale: "Custom scale",
          type: "Specialist fabrication route",
        };
      default:
        return {
          scale: "Custom scale",
          type: "Custom fabrication",
        };
    }
  }

  function getBrandInitials(name) {
    return name
      .split(/[\s&.-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function getDisplayClient(project) {
    if (!project.client || project.client === "Project Name Pending") {
      return "Custom Project";
    }

    return project.client;
  }

  function getDisplayLocation(project) {
    if (!project.location || project.location === "To Be Confirmed") {
      return "Project location available on request";
    }

    return project.location;
  }

  function selectCuratedProjects(items, limit) {
    const featured = items.filter((project) => project.featured);
    const remaining = items.filter((project) => !project.featured);
    return [...featured, ...remaining].slice(0, limit);
  }

  function preloadProjectImages(project) {
    if (!project) {
      return;
    }

    project.images.forEach((imagePath) => {
      if (preloadedImages.has(imagePath)) {
        return;
      }

      const image = new Image();
      image.decoding = "async";
      image.src = imagePath;
      preloadedImages.add(imagePath);
    });
  }

  function SectionHeader(props) {
    return html`
      <div className="max-w-3xl space-y-4">
        <p className="eyebrow">${props.eyebrow}</p>
        <div className="space-y-4">
          <h2 className="headline-lg">${props.title}</h2>
          <p className="body-muted max-w-2xl">${props.description}</p>
        </div>
      </div>
    `;
  }

  function Topbar() {
    const navItems = [
      { label: "Home", href: "/" },
      { label: "Portfolio", href: "#cases" },
      { label: "Process", href: "#workflow" },
      { label: "Pricing", href: "#pricing" },
    ];

    return html`
      <header className="sticky top-4 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 rounded-full border border-line bg-black/78 px-5 py-3 shadow-[0_22px_60px_rgba(0,0,0,0.42)] backdrop-blur">
          <a className="min-w-0" href="/" aria-label="ACT Creative home">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-accent">
              ${site.company.shortName}
            </p>
            <p className="truncate text-xs text-zinc-200">Custom sculpture fabrication</p>
          </a>
          <nav className="hidden items-center gap-5 lg:flex">
            ${navItems.map(
              (item) => html`<a className="nav-link" href=${item.href}>${item.label}</a>`
            )}
          </nav>
          <a className=${PRIMARY_BUTTON_CLASS} href="#contact">
            Contact
          </a>
        </div>
      </header>
    `;
  }

  function Hero(props) {
    const heroStats = site.hero.stats.map((stat, index) =>
      index === 0
        ? {
            ...stat,
            value: String(props.curatedReferenceCount),
          }
        : stat
    );

    return html`
      <section
        id="top"
        className="section-anchor-offset section-shell section-pad soft-gradient relative overflow-hidden"
      >
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div className="space-y-8">
            <div className="space-y-5">
              <p className="eyebrow rise-in">${site.hero.eyebrow}</p>
              <div className="space-y-5">
                <h1 className="headline-xl rise-in rise-delay-1">${site.hero.title}</h1>
                <p className="body-muted max-w-2xl rise-in rise-delay-2">${site.hero.subtitle}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 rise-in rise-delay-3">
              <a href=${site.hero.ctaPrimary.href} className=${PRIMARY_BUTTON_CLASS}>
                ${site.hero.ctaPrimary.label}
              </a>
              <a href=${site.hero.ctaSecondary.href} className=${SECONDARY_BUTTON_CLASS}>
                ${site.hero.ctaSecondary.label}
              </a>
            </div>
            <div className="grid gap-3 border-t border-line pt-5 md:grid-cols-3">
              ${heroStats.map(
                (stat, index) => html`
                  <div className=${`rise-in rise-delay-${Math.min(index + 1, 3)}`}>
                    <span className="text-3xl font-semibold leading-none text-accent">${stat.value}</span>
                    <p className="mt-2 text-sm text-zinc-300">${stat.label}</p>
                  </div>
                `
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
            <div className="image-frame glass-line aspect-[4/5] rounded-[2rem] bg-charcoal">
              <img alt="Hero project reference" src=${site.hero.imagery.primary} />
            </div>
            <div className="grid gap-4">
              <div className="image-frame glass-line aspect-[4/3] rounded-[1.75rem] bg-charcoal">
                <img alt="Secondary project reference" src=${site.hero.imagery.secondaryA} />
              </div>
              <div className="image-frame glass-line aspect-[4/3] rounded-[1.75rem] bg-charcoal">
                <img alt="Secondary project reference" src=${site.hero.imagery.secondaryB} />
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function ProjectCard(props) {
    const project = props.project;
    const profile = getProjectProfile(project);
    const clientLabel = getDisplayClient(project);
    const locationLabel = getDisplayLocation(project);
    return html`
      <button
        type="button"
        className="project-card button-elevated overflow-hidden rounded-[1.8rem] border border-line bg-black/74 text-left shadow-[0_20px_55px_rgba(0,0,0,0.4)]"
        onClick=${() => {
          trackPortfolioAction("Sculpture project opened", project.id, {
            category: project.category,
          });
          props.onSelect(project.id);
        }}
        onMouseEnter=${() => props.onPreview(project)}
        onFocus=${() => props.onPreview(project)}
      >
        <div className="image-frame case-frame aspect-[5/4] rounded-b-none p-3 md:aspect-[4/3] xl:aspect-[6/5]">
          <img alt=${project.title} src=${project.images[0]} loading="lazy" />
        </div>
        <div className="space-y-3 p-4 md:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-accent">
                ${clientLabel}
              </p>
              <h3 className="mt-2 text-xl font-semibold leading-tight text-ink">${project.title}</h3>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-line pt-3 text-xs text-zinc-300">
            <span className="truncate">${locationLabel}</span>
            <span className="shrink-0">${profile.type}${project.images.length > 1 ? ` · ${project.images.length} images` : ""}</span>
          </div>
        </div>
      </button>
    `;
  }

  function FilterTabs(props) {
    const counts = props.counts;
    return html`
      <div className="flex flex-wrap gap-3">
        ${filters.map((filter) => {
          const active = props.active === filter.key;
          return html`
            <button
              type="button"
              className=${`filter-pill ${active ? "filter-pill-active" : ""}`}
              onClick=${() => {
                trackPortfolioAction("Sculpture filter used", filter.key, {
                  visible_projects: counts[filter.key] || 0,
                });
                props.onChange(filter.key);
              }}
            >
              ${filter.label}
              <span className=${`ml-2 rounded-full px-2 py-0.5 text-[0.68rem] ${active ? "bg-black/18 text-black" : "bg-black text-white"}`}>
                ${counts[filter.key]}
              </span>
            </button>
          `;
        })}
      </div>
    `;
  }

  function CaseGroupSection(props) {
    const { group, items, totalItems, isOpen, onToggle, onSelect, onPreview } = props;
    const lead = items.slice(0, 3);
    return html`
      <section className=${`overflow-hidden rounded-[1.9rem] border shadow-[0_22px_60px_rgba(17,19,24,0.06)] ${group.tone}`}>
        <button
          type="button"
          className="w-full text-left"
          onClick=${() => onToggle(group.id)}
          aria-expanded=${isOpen}
        >
          <div className="grid gap-6 px-5 py-5 md:px-6 md:py-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium text-accent">${items.length} featured · ${totalItems} references</span>
                <span className=${`section-toggle-pill ${isOpen ? "section-toggle-pill-open" : ""}`}>
                  <span className="section-toggle-icon">${isOpen ? "-" : "+"}</span>
                  <span>${isOpen ? "Collapse section" : "Expand section"}</span>
                </span>
              </div>
              <div className="space-y-3">
                <h3 className="text-[1.8rem] font-semibold leading-tight text-white md:text-[2.25rem]">
                  ${group.title}
                </h3>
                <p className="max-w-2xl text-sm leading-7 text-zinc-200">${group.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              ${lead.map(
                (project) => html`
                  <div className="image-frame case-frame aspect-[4/5] rounded-[1.2rem] border border-line p-2 shadow-[0_14px_35px_rgba(0,0,0,0.3)]">
                    <img alt=${project.title} src=${project.images[0]} loading="lazy" />
                  </div>
                `
              )}
            </div>
          </div>
        </button>
        ${isOpen
          ? html`
              <div className="border-t border-line bg-black/38 px-5 py-5 md:px-6 md:py-6">
                <div className="grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
                  ${items.map(
                    (project) => html`
                      <${ProjectCard}
                        key=${project.id}
                        project=${project}
                        onSelect=${onSelect}
                        onPreview=${onPreview}
                      />
                    `
                  )}
                </div>
              </div>
            `
          : null}
      </section>
    `;
  }

  function ProjectModal(props) {
    const project = props.project;

    if (!project) {
      return null;
    }

    const profile = getProjectProfile(project);
    const clientLabel = getDisplayClient(project);
    const locationLabel = getDisplayLocation(project);

    return html`
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-6 md:px-8 md:py-10"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          className="modal-backdrop fixed inset-0 cursor-default"
          onClick=${props.onClose}
          aria-label="Close modal"
        ></button>
        <div className="relative z-10 w-full max-w-[92rem] overflow-hidden rounded-[2rem] border border-line-strong bg-charcoal shadow-[0_28px_120px_rgba(0,0,0,0.62)]">
          <div className="flex items-start justify-between gap-5 border-b border-line px-6 py-5 md:px-8">
            <div className="space-y-3">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-accent">
                ${clientLabel}
              </p>
              <h3 className="text-3xl font-semibold leading-tight text-white">
                ${project.title}
              </h3>
              <p className="max-w-2xl text-sm leading-7 text-zinc-100">${project.summary}</p>
            </div>
            <button
              type="button"
              className="button-elevated rounded-full border border-line bg-black/66 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:border-accent hover:text-accent"
              onClick=${props.onClose}
            >
              Close
            </button>
          </div>
          <div className="grid gap-0 lg:grid-cols-[1.18fr_0.82fr]">
            <div className="modal-image-rail max-h-[82vh] overflow-y-auto bg-[#080808] p-4 md:p-6">
              <div className="grid gap-4">
                ${project.images.map(
                  (image, index) => html`
                    <a
                      className="modal-image-stage overflow-hidden rounded-[1.4rem] border border-line bg-black/20"
                      href=${image}
                      target="_blank"
                      rel="noreferrer"
                      title="Open full-resolution image"
                    >
                      <img
                        className="w-full"
                        alt=${`${project.title} image ${index + 1}`}
                        src=${image}
                        loading="eager"
                        decoding=${index === 0 ? "sync" : "async"}
                        fetchPriority=${index === 0 ? "high" : "auto"}
                      />
                    </a>
                  `
                )}
              </div>
            </div>
            <div className="space-y-6 p-6 md:p-8">
              <div className="rounded-[1.5rem] border border-line bg-black/55 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">
                  Project context
                </p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-100">
                  <div>
                    <span className="font-semibold text-white">Scale:</span> ${profile.scale}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Type:</span> ${profile.type}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Location:</span> ${locationLabel}
                  </div>
                  <div>
                    <span className="font-semibold text-white">Category:</span> ${project.category}
                  </div>
                </div>
              </div>
              <p className="text-sm leading-7 text-zinc-300">Click an image to open the full-size reference.</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function WorkflowSection() {
    return html`
      <section id="workflow" className="section-anchor-offset section-shell section-pad soft-gradient">
        <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <${SectionHeader}
              eyebrow=${site.workflow.eyebrow}
              title=${site.workflow.title}
              description=${site.workflow.description}
            />
            <div className="rounded-[1.8rem] border border-line bg-black/72 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Service coverage
              </p>
              <div className="mt-5 grid gap-x-6 gap-y-3 md:grid-cols-2">
                ${site.workflow.coverage.slice(0, 6).map(
                  (item) => html`
                    <div className="flex items-start gap-3 text-sm leading-6 text-zinc-200">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                      <span>${item}</span>
                    </div>
                  `
                )}
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            ${site.workflow.steps.map(
              (step) => html`
                <article className="rounded-[1.7rem] border border-line bg-black/72 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
                  <div className="flex items-center gap-4">
                    <span className="number-orb">${step.number}</span>
                    <h3 className="text-lg font-semibold text-ink">${step.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-zinc-200">${step.detail}</p>
                </article>
              `
            )}
          </div>
        </div>
      </section>
    `;
  }

  function PricingSection() {
    return html`
      <section id="pricing" className="section-anchor-offset section-shell section-pad soft-gradient">
        <div className="grid gap-8 xl:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-6">
            <${SectionHeader}
              eyebrow=${site.pricing.eyebrow}
              title=${site.pricing.title}
              description=${site.pricing.description}
            />
            <div className="rounded-[1.8rem] border border-accent bg-accent p-6 text-black shadow-[0_22px_60px_rgba(0,0,0,0.42)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/70">
                Pricing note
              </p>
              <p className="mt-4 text-sm leading-7 text-black/80">${site.pricing.disclaimer}</p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-3">
              ${site.pricing.cards.map(
                (card) => html`
                  <article className="rounded-[1.7rem] border border-line bg-black/72 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.34)]">
                    <p className="text-xs font-semibold text-accent">
                      ${card.title}
                    </p>
                    <p className="mt-4 text-2xl font-semibold leading-tight text-accent">
                      ${card.metric}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-zinc-200">${card.detail}</p>
                  </article>
                `
              )}
            </div>
            <div className="rounded-[1.8rem] border border-line bg-black/72 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.34)]">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Reference lead time
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-ink">Indicative production windows</h3>
                </div>
                <p className="text-sm text-zinc-300">Use as expectation-setting only.</p>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                ${site.pricing.leadTime.map(
                  (item) => html`
                    <div className="rounded-[1.4rem] border border-line bg-black/70 px-4 py-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">
                        ${item.title}
                      </p>
                      <p className="mt-3 text-sm font-semibold leading-6 text-ink">${item.value}</p>
                    </div>
                  `
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function BrandsSection() {
    const repeated = [...brands, ...brands];
    return html`
      <section id="brands" className="section-anchor-offset section-shell section-pad soft-gradient">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Brand wall</p>
            <h2 className="mt-4 headline-lg">Selected project references</h2>
          </div>
        </div>
        <div className="marquee-shell">
          <div className="marquee-track gap-4 pr-4">
            ${repeated.map(
              (brand, index) => html`
                <div className="brand-tile" key=${`${brand.name}-${index}`}>
                  <div className="brand-logo-panel">
                    ${brand.logo
                      ? html`<img alt=${brand.name} src=${brand.logo} loading="lazy" />`
                      : html`<span className="brand-mark">${getBrandInitials(brand.name)}</span>`}
                  </div>
                  <div className="brand-copy">
                    <span className="brand-name">${brand.name}</span>
                  </div>
                </div>
              `
            )}
          </div>
        </div>
      </section>
    `;
  }

  function ContactSection() {
    return html`
      <section id="contact" className="section-anchor-offset section-shell section-pad soft-gradient">
        <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-5">
            <${SectionHeader}
              eyebrow=${site.contact.eyebrow}
              title=${site.contact.title}
              description=${site.contact.description}
            />
            <div className="flex flex-wrap gap-3">
              ${site.contact.actions.map(
                (action, index) => html`
                  <a href=${action.href} className=${index === 0 ? PRIMARY_BUTTON_CLASS : SECONDARY_BUTTON_CLASS}>
                    ${action.label}
                  </a>
                `
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.8rem] border border-line bg-black/72 p-6 shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Company
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-200">
                <div>
                  <span className="font-semibold text-ink">Name:</span> ${site.company.name}
                </div>
                <div>
                  <span className="font-semibold text-ink">Contact:</span> ${site.company.contactName}
                </div>
                <div>
                  <span className="font-semibold text-ink">Email:</span> ${site.company.email}
                </div>
                <div>
                  <span className="font-semibold text-ink">WhatsApp:</span> ${site.company.whatsapp}
                </div>
                <div>
                  <span className="font-semibold text-ink">Location:</span> ${site.company.location}
                </div>
              </div>
            </div>
            <div className="rounded-[1.8rem] border border-accent bg-accent p-6 text-black shadow-[0_22px_60px_rgba(0,0,0,0.42)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-black/70">
                Solutions integration model
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-black/80">
                <p>
                  ACT Creative is the client-facing systems and solutions integration platform. We define the scope, select the appropriate material and specialist production route from a vetted network, then coordinate fabrication, quality checks, logistics and site delivery under one project plan.
                </p>
                <p>
                  Reference media demonstrates available production capabilities rather than a single supplier brand. Initial enquiries can include drawings, dimensions, finish references, target venue, destination market and timeline to speed up technical review and quotation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function Footer() {
    return html`
      <footer className="rounded-[1.8rem] border border-line-strong bg-black px-6 py-5 text-sm text-zinc-200 shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
        ${site.footer}
      </footer>
    `;
  }

  function App() {
    const [selectedId, setSelectedId] = React.useState(null);
    const [openGroups, setOpenGroups] = React.useState(() =>
      CASE_GROUPS.reduce((accumulator, group) => {
        accumulator[group.id] = group.startExpanded;
        return accumulator;
      }, {})
    );
    const selectedProject = projects.find((project) => project.id === selectedId) || null;

    React.useEffect(() => {
      const onKeyDown = (event) => {
        if (event.key === "Escape") {
          setSelectedId(null);
        }
      };

      if (selectedProject) {
        preloadProjectImages(selectedProject);
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      window.addEventListener("keydown", onKeyDown);
      return () => {
        window.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = "";
      };
    }, [selectedProject]);

    const groupedProjects = CASE_GROUPS.map((group) => {
      const allItems = projects.filter((project) => group.categories.includes(project.category));
      return {
        ...group,
        allItems,
        items: selectCuratedProjects(allItems, group.curatedCount),
      };
    });
    const curatedReferenceCount = groupedProjects.reduce(
      (total, group) => total + group.items.length,
      0
    );

    const toggleGroup = (groupId) => {
      setOpenGroups((current) => ({
        ...current,
        [groupId]: !current[groupId],
      }));
    };

    const expandAll = () => {
      setOpenGroups(
        CASE_GROUPS.reduce((accumulator, group) => {
          accumulator[group.id] = true;
          return accumulator;
        }, {})
      );
    };

    const collapseAll = () => {
      setOpenGroups(
        CASE_GROUPS.reduce((accumulator, group) => {
          accumulator[group.id] = false;
          return accumulator;
        }, {})
      );
    };

    return html`
      <div className="page-shell px-4 pb-14 pt-4 md:px-6 md:pb-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <${Topbar} />
          <${Hero} curatedReferenceCount=${curatedReferenceCount} />
          <${BrandsSection} />
          <section id="cases" className="section-anchor-offset section-shell section-pad soft-gradient">
            <div>
              <${SectionHeader}
                eyebrow=${site.caseSection.eyebrow}
                title=${site.caseSection.title}
                description=${site.caseSection.description}
              />
            </div>
            <div className="mt-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.6rem] border border-line-strong bg-black px-5 py-4 shadow-[0_18px_48px_rgba(0,0,0,0.34)]">
                <p className="text-sm text-zinc-200">${curatedReferenceCount} featured · ${projects.length} total references</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className=${CONTROL_SECONDARY_BUTTON_CLASS}
                    onClick=${expandAll}
                  >
                    <span className="text-xl leading-none text-accent">+</span>
                    <span>Expand all</span>
                  </button>
                  <button
                    type="button"
                    className=${CONTROL_PRIMARY_BUTTON_CLASS}
                    onClick=${collapseAll}
                  >
                    <span className="text-xl leading-none">-</span>
                    <span>Collapse all</span>
                  </button>
                </div>
              </div>
              <div className="space-y-5">
                ${groupedProjects.map(
                  (group) => html`
                    <${CaseGroupSection}
                      key=${group.id}
                      group=${group}
                      items=${group.items}
                      totalItems=${group.allItems.length}
                      isOpen=${openGroups[group.id]}
                      onToggle=${toggleGroup}
                      onSelect=${setSelectedId}
                      onPreview=${preloadProjectImages}
                    />
                  `
                )}
              </div>
            </div>
          </section>

          <${WorkflowSection} />
          <${PricingSection} />
          <${ContactSection} />
          <${Footer} />
        </div>
        <${ProjectModal} project=${selectedProject} onClose=${() => setSelectedId(null)} />
      </div>
    `;
  }

  ReactDOM.createRoot(document.getElementById("app")).render(html`<${App} />`);
})();
