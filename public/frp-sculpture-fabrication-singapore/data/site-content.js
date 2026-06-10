const slidePath = (slide) =>
  `assets/images/slides/slide-${String(slide).padStart(2, "0")}.webp`;

window.ACT_CREATIVE_SITE_CONTENT = {
  company: {
    name: "ACT Creative",
    shortName: "ACT Creative",
    contactName: "Noah Chen",
    email: "contact@actcreative.net",
    whatsapp: "+65 84515268",
    whatsappHref: "https://wa.me/6584515268",
    location: "Singapore coordination with China production and overseas delivery support.",
    legalLine: "ACT CREATIVE PTE. LTD.",
  },
  hero: {
    eyebrow: "Custom sculpture fabrication Singapore",
    title: "Custom Sculptures, Public Art & Installations",
    subtitle:
      "From custom fabrication in China to freight, Singapore delivery and installation support.",
    ctaPrimary: { label: "View Projects", href: "#cases" },
    ctaSecondary: { label: "View Workflow", href: "#workflow" },
    trustPoints: [
      "China factory production",
      "Specialist sculpture production",
      "Overseas delivery support",
      "Large-format custom builds",
      "Singapore installation coordination",
    ],
    stats: [
      {
        label: "Featured references",
        value: "20",
        detail: "curated references selected from a 49-project sculpture portfolio",
      },
      {
        label: "Core categories",
        value: "4",
        detail: "large sculpture, public art, decorative objects and collectibles",
      },
      {
        label: "Delivery model",
        value: "Global",
        detail: "China-based manufacturing with export-ready project support",
      },
    ],
    imagery: {
      primary: slidePath(8),
      secondaryA: slidePath(5),
      secondaryB: slidePath(14),
    },
  },
  productionTracks: [
    {
      title: "Large Sculptures",
      subtitle: "Landmark pieces, branded installations, and outdoor builds",
      image: slidePath(3),
      bullets: [
        "Mall activations and public art",
        "Large-format steel and fiberglass structures",
        "Engineered for shipment and site assembly",
      ],
    },
    {
      title: "Small Sculpture & Props",
      subtitle: "Decor items, display pieces, blind box and resin-based builds",
      image: slidePath(25),
      bullets: [
        "Small-batch and custom decorative objects",
        "Resin, plated, transparent and special-finish items",
        "Suitable for export packaging and retail display",
      ],
    },
    {
      title: "Clay & Museum Display",
      subtitle: "Historical scenes, dioramas, educational and museum fabrication",
      image: slidePath(55),
      bullets: [
        "Clay modeling and sculptural detailing",
        "Museum and institutional interpretation",
        "Custom scene building and presentation support",
      ],
    },
  ],
  caseSection: {
    eyebrow: "Sculpture portfolio",
    title: "Project references for commercial, cultural and IP-led work",
    description:
      "Browse large sculptures, public art, decorative fabrication and collectible production.",
  },
  workflow: {
    eyebrow: "Service workflow",
    title: "How overseas projects are typically delivered",
    description:
      "A practical route from brief and production to freight, delivery and installation.",
    steps: [
      {
        number: "01",
        title: "Project briefing & scope confirmation",
        detail:
          "Clarify use case, dimensions, finishes, target market, venue conditions, timeline and approval path before engineering starts.",
      },
      {
        number: "02",
        title: "Technical assessment",
        detail:
          "Review form, structure, material direction, modular split logic and transport feasibility to reduce downstream risk.",
      },
      {
        number: "03",
        title: "Quotation & value engineering",
        detail:
          "Provide a structured cost basis and adjust materials, segmentation or finishing method when budget or logistics require optimization.",
      },
      {
        number: "04",
        title: "Sampling & sign-off",
        detail:
          "Confirm surface treatment, paint, sample output and fabrication details before moving into main production.",
      },
      {
        number: "05",
        title: "Factory production in China",
        detail:
          "Carry out sculpting, mold work, metal structure, finishing and quality control at the fabrication stage.",
      },
      {
        number: "06",
        title: "Freight planning & packaging design",
        detail:
          "Arrange sea freight, air freight or special shipment routes, with modular breakdown and protective packing strategy.",
      },
      {
        number: "07",
        title: "Delivery & site handover",
        detail:
          "Coordinate shipment arrival, customs handling support and delivery sequencing based on the site schedule.",
      },
      {
        number: "08",
        title: "Local installation & construction management",
        detail:
          "Support on-site assembly, contractor coordination, hardware checks and finish touch-up where required.",
      },
    ],
    coverage: [
      "Travel and on-site support",
      "International freight coordination",
      "Modular structural split and export packaging",
      "Local installation management",
      "Compliance and certification support",
      "Structural proofing and engineering documents",
      "Coordination for local approvals",
      "Temporary project dismantling and recovery",
    ],
  },
  pricing: {
    eyebrow: "Pricing reference",
    title: "Commercial guidance for early-stage project discussions",
    description:
      "Early planning guidance before drawings, materials and delivery conditions are confirmed.",
    cards: [
      {
        title: "Large-scale custom projects",
        metric: "Quoted by scope",
        detail:
          "Usually estimated by size, structural method, complexity of form, number of colors, finishing system, packaging logic and installation difficulty.",
        bullets: [
          "Quoted by square meter plus structure and site conditions",
          "Complex curves, engineering loads and premium finishes add cost",
          "Freight and installation are typically quoted separately",
        ],
      },
      {
        title: "Small sculptures & display props",
        metric: "Quoted per piece",
        detail:
          "Suitable for one-off decorative items, resin objects and custom retail display pieces.",
        bullets: [
          "Pricing varies by material, size and hand-finishing time",
          "Low-volume custom work is possible",
          "MOQ depends on mold strategy and finish requirement",
        ],
      },
      {
        title: "Blind box / collectibles / batch items",
        metric: "Quoted by quantity and process",
        detail:
          "Used for figurines, blind box style products and repeatable decorative units.",
        bullets: [
          "Pricing depends on mold count, paint complexity and packaging scope",
          "MOQ is project-specific",
          "Best suited to early quantity planning before sampling",
        ],
      },
    ],
    leadTime: [
      { title: "Large-scale projects", value: "Approx. 6-12 weeks after drawing approval" },
      { title: "Small-scale custom items", value: "Approx. 4-8 weeks" },
      { title: "Collectibles / batch items", value: "Approx. 5-10 weeks" },
    ],
    disclaimer:
      "Reference only. Formal quotation is issued after project scope, drawings, materials, packaging and delivery conditions are confirmed.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Discuss scope, timeline and delivery conditions",
    description:
      "Share your brief, target dimensions, finish requirements, destination and timeline to start a project discussion.",
    actions: [
      { label: "Email Us", href: "mailto:contact@actcreative.net" },
      { label: "WhatsApp", href: "https://wa.me/6584515268" },
    ],
  },
  footer:
    "ACT Creative coordinates cross-border sculpture fabrication, export delivery and installation planning for commercial, cultural and IP-led projects.",
};
