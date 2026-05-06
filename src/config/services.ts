/**
 * Service catalog — single source of truth for service pages, navigation,
 * and homepage cards.
 */

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  oneLiner: string;
  keywords: string[];
  metaTitle: string;
  metaDescription: string;
}

export const services: Service[] = [
  {
    slug: "event-fabrication-singapore",
    title: "Event Fabrication Singapore",
    shortTitle: "Event Fabrication",
    oneLiner:
      "Custom event fabrication, props, display units and booth components — produced in China, coordinated locally in Singapore.",
    keywords: [
      "event fabrication Singapore",
      "custom props fabrication",
      "event production Singapore",
      "display fabrication",
      "brand activation production",
    ],
    metaTitle: "Event Fabrication Singapore | ACT Creative",
    metaDescription:
      "ACT Creative supports event agencies and brands in Singapore with custom event fabrication, props, display units, booth components and China-side production coordination.",
  },
  {
    slug: "china-production-support-for-event-agencies",
    title: "China Production Support for Event Agencies",
    shortTitle: "China Production Support",
    oneLiner:
      "Your Singapore-based production desk for China-side custom fabrication. Communication, accountability and risk control built in.",
    keywords: [
      "China production support Singapore",
      "China sourcing for event agencies",
      "custom fabrication from China",
      "China factory coordination",
    ],
    metaTitle: "China Production Support for Event Agencies | ACT Creative Singapore",
    metaDescription:
      "Singapore-based support for event agencies managing custom fabrication, props, merchandise, display units and booth components from China.",
  },
  {
    slug: "custom-props-display-fabrication",
    title: "Custom Props & Display Fabrication",
    shortTitle: "Custom Props & Display",
    oneLiner:
      "Props, display units, photo-op installations, retail display stands and themed décor — built to brief, delivered ready to install.",
    keywords: [
      "custom props fabrication",
      "event props fabrication",
      "display fabrication",
      "brand activation props",
      "retail display units",
    ],
    metaTitle: "Custom Props & Display Fabrication | ACT Creative",
    metaDescription:
      "Custom props, display units, photo-op installations and retail display fabrication for events, brand activations and mall campaigns in Singapore and Southeast Asia.",
  },
  {
    slug: "frp-sculpture-installation-fabrication",
    title: "FRP Sculpture & Installation Fabrication",
    shortTitle: "FRP Sculpture & Installation",
    oneLiner:
      "FRP, foam, resin and mixed-material sculpture fabrication for events, malls, exhibitions and commercial installations.",
    keywords: [
      "FRP sculpture Singapore",
      "sculpture fabrication",
      "foam sculpture",
      "fiberglass props",
      "mall installation",
    ],
    metaTitle: "FRP Sculpture & Custom Installation Fabrication | ACT Creative",
    metaDescription:
      "Custom FRP, foam, resin and mixed-material sculpture fabrication support for events, malls, exhibitions and commercial installations in Singapore and Southeast Asia.",
  },
  {
    slug: "event-merchandise-sourcing-from-china",
    title: "Event Merchandise Sourcing from China",
    shortTitle: "Event Merchandise",
    oneLiner:
      "Branded bags, acrylic charms, plush, packaging and event retail items — sampled, QC'd and shipped from trusted China suppliers.",
    keywords: [
      "event merchandise supplier",
      "custom event merchandise from China",
      "branded merchandise sourcing",
      "event retail items",
    ],
    metaTitle: "Event Merchandise Sourcing from China | ACT Creative",
    metaDescription:
      "Branded merchandise, premium gifts, event retail items and packaging — sourced and produced from China with sampling and QC handled in Singapore.",
  },
  {
    slug: "exhibition-booth-production-support",
    title: "Exhibition & Booth Production Support",
    shortTitle: "Exhibition & Booth",
    oneLiner:
      "Booth components, counters, display cabinets, plinths, graphic panels and modular event hardware, with local installation coordination.",
    keywords: [
      "exhibition booth production",
      "booth components",
      "counters and plinths",
      "graphic panels",
      "exhibition contractors Singapore",
    ],
    metaTitle: "Exhibition & Booth Production Support | ACT Creative",
    metaDescription:
      "Booth components, counters, plinths, display cabinets and graphic panels — pre-fabricated from China and coordinated for installation in Singapore.",
  },
  {
    slug: "brand-activation-production-partner-singapore",
    title: "Brand Activation Production Partner in Singapore",
    shortTitle: "Brand Activation",
    oneLiner:
      "Pop-up setups, launch event props, sampling counters and campaign elements for PR agencies and brand activation teams.",
    keywords: [
      "brand activation production Singapore",
      "pop-up production",
      "sampling counter fabrication",
      "campaign props",
    ],
    metaTitle: "Brand Activation Production Partner in Singapore | ACT Creative",
    metaDescription:
      "Pop-up setups, launch event props, sampling counters and custom campaign elements for PR agencies and brand activation teams in Singapore.",
  },
];

export const getServiceBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);
