/**
 * Site-wide configuration.
 * Replace placeholder values when real accounts/IDs are available.
 */

export const siteConfig = {
  name: "ACT Creative",
  legalName: "ACT Creative Pte. Ltd.",
  url: "https://actcreative.net",
  description:
    "ACT Creative helps event agencies and brands manage custom fabrication, props, exhibition components, FRP/sculpture works and event merchandise from China, with local coordination in Singapore and Southeast Asia.",
  tagline: "Cross-Border Event Fabrication & Production Partner Based in Singapore",
  contact: {
    email: "contact@actcreative.net",
    phone: "+65 84515268",
    whatsapp: "6584515268",
    address: {
      country: "SG",
      locality: "Singapore",
    },
  },
  // Approximate Singapore CBD coordinates — used for geo meta + LocalBusiness schema
  geo: {
    latitude: 1.3521,
    longitude: 103.8198,
    region: "SG-01",          // ISO-3166-2:SG (Central Singapore)
    placename: "Singapore",
  },
  // Service areas - primary first.
  serviceAreas: [
    { name: "Singapore", country: "SG", primary: true },
    { name: "Malaysia", country: "MY" },
    { name: "Indonesia", country: "ID" },
    { name: "Thailand", country: "TH" },
    { name: "Vietnam", country: "VN" },
    { name: "Philippines", country: "PH" },
    { name: "Hong Kong", country: "HK" },
    { name: "Macau", country: "MO" },
    { name: "China", country: "CN" },
  ],
  // Languages we can work in.
  languages: ["en", "zh-Hans", "zh-Hant"],
  // hreflang map — keys map to URL suffix or absolute. Single canonical site,
  // all languages point to the same English content; "x-default" included.
  hreflang: [
    { code: "en-sg", href: "" },
    { code: "en-hk", href: "" },
    { code: "en-my", href: "" },
    { code: "en-th", href: "" },
    { code: "en-id", href: "" },
    { code: "en-ph", href: "" },
    { code: "en-vn", href: "" },
    { code: "zh-hk", href: "" },
    { code: "zh-cn", href: "" },
    { code: "x-default", href: "" },
  ] as { code: string; href: string }[],
  // Replace these placeholder URLs when accounts are available.
  social: {
    linkedin: "https://www.linkedin.com/company/actcreative", // TODO: replace
    instagram: "https://www.instagram.com/actcreative", // TODO: replace
    youtube: "https://www.youtube.com/@actcreative", // TODO: replace
    facebook: "https://www.facebook.com/actcreative", // TODO: replace
  },
  // Analytics - replace when GA4 is set up.
  analytics: {
    ga4MeasurementId: "G-XXXXXXXXXX", // TODO: replace with real GA4 ID
  },
  // Form submission - replace when Formspree (or similar) is set up.
  forms: {
    rfqEndpoint: "https://formspree.io/f/REPLACE_WITH_FORM_ID", // TODO: replace
  },
};

export const whatsappLink = (
  message = "Hi ACT Creative, I would like to request a fabrication quote.",
) =>
  `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;
