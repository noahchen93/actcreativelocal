import { useEffect } from "react";
import { siteConfig } from "../config/site";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: object | object[];
}

const MARK = "data-seo-managed";

function setMetaByName(name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"][${MARK}]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    el.setAttribute(MARK, "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setMetaByProp(prop: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${prop}"][${MARK}]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", prop);
    el.setAttribute(MARK, "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function clearManaged(selector: string) {
  document.head
    .querySelectorAll(`${selector}[${MARK}]`)
    .forEach((n) => n.parentNode?.removeChild(n));
}

function appendLink(rel: string, href: string, attrs: Record<string, string> = {}) {
  const el = document.createElement("link");
  el.setAttribute("rel", rel);
  el.setAttribute("href", href);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  el.setAttribute(MARK, "");
  document.head.appendChild(el);
}

function appendScript(json: string) {
  const el = document.createElement("script");
  el.setAttribute("type", "application/ld+json");
  el.setAttribute(MARK, "");
  el.textContent = json;
  document.head.appendChild(el);
}

export function SEO({ title, description, path, ogImage, noindex, jsonLd }: SEOProps) {
  useEffect(() => {
    const url = `${siteConfig.url}${path}`;
    const image = ogImage
      ? `${siteConfig.url}${ogImage}`
      : `${siteConfig.url}/og-default.jpg`;

    // Title
    document.title = title;

    // Clear out previously-managed tags so we don't duplicate on route change
    clearManaged("meta");
    clearManaged("link");
    clearManaged("script");

    // Standard meta
    setMetaByName("description", description);
    if (noindex) setMetaByName("robots", "noindex,nofollow");

    // Geo meta (kept fresh per page; index.html also has these but managed copies
    // override and stay consistent with config)
    setMetaByName("geo.region", siteConfig.geo.region);
    setMetaByName("geo.placename", siteConfig.geo.placename);
    setMetaByName(
      "geo.position",
      `${siteConfig.geo.latitude};${siteConfig.geo.longitude}`,
    );
    setMetaByName("ICBM", `${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`);

    // Open Graph
    setMetaByProp("og:title", title);
    setMetaByProp("og:description", description);
    setMetaByProp("og:url", url);
    setMetaByProp("og:type", "website");
    setMetaByProp("og:image", image);
    setMetaByProp("og:site_name", siteConfig.name);
    setMetaByProp("og:locale", "en_SG");
    ["en_HK", "zh_CN", "zh_HK"].forEach((loc) => {
      const el = document.createElement("meta");
      el.setAttribute("property", "og:locale:alternate");
      el.setAttribute("content", loc);
      el.setAttribute(MARK, "");
      document.head.appendChild(el);
    });

    // Twitter
    setMetaByName("twitter:card", "summary_large_image");
    setMetaByName("twitter:title", title);
    setMetaByName("twitter:description", description);
    setMetaByName("twitter:image", image);

    // Canonical
    appendLink("canonical", url);

    // hreflang
    if (!noindex) {
      siteConfig.hreflang.forEach(({ code }) => {
        appendLink("alternate", url, { hreflang: code });
      });
    }

    // JSON-LD
    if (jsonLd) {
      const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      arr.forEach((ld) => appendScript(JSON.stringify(ld)));
    }

    return () => {
      // Clean managed tags on unmount so the next page can replace them.
      clearManaged("meta");
      clearManaged("link");
      clearManaged("script");
    };
  }, [title, description, path, ogImage, noindex, JSON.stringify(jsonLd)]);

  return null;
}

const sameAs = [
  siteConfig.social.linkedin,
  siteConfig.social.instagram,
  siteConfig.social.youtube,
  siteConfig.social.facebook,
];

const areaServedJsonLd = siteConfig.serviceAreas.map((a) => ({
  "@type": "Country",
  name: a.name,
  identifier: a.country,
}));

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${siteConfig.url}/#business`,
  name: siteConfig.legalName,
  alternateName: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo.png`,
  image: `${siteConfig.url}/og-default.jpg`,
  description: siteConfig.description,
  email: siteConfig.contact.email,
  telephone: siteConfig.contact.phone,
  priceRange: "$$-$$$",
  knowsLanguage: ["en", "zh-Hans", "zh-Hant"],
  address: {
    "@type": "PostalAddress",
    addressCountry: siteConfig.contact.address.country,
    addressLocality: siteConfig.contact.address.locality,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.geo.latitude,
    longitude: siteConfig.geo.longitude,
  },
  areaServed: areaServedJsonLd,
  serviceArea: {
    "@type": "GeoShape",
    name: "Singapore, Southeast Asia, Greater China and Hong Kong",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cross-Border Event Fabrication & Production Services",
    itemListElement: [
      "Event Fabrication Singapore",
      "China Production Support for Event Agencies",
      "Custom Props & Display Fabrication",
      "FRP Sculpture & Installation Fabrication",
      "Event Merchandise Sourcing from China",
      "Exhibition & Booth Production Support",
      "Brand Activation Production Partner Singapore",
    ].map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s },
    })),
  },
  sameAs,
};

export const organizationJsonLd = localBusinessJsonLd;

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  url: siteConfig.url,
  publisher: { "@id": `${siteConfig.url}/#business` },
  inLanguage: ["en-SG", "en-HK", "zh-CN", "zh-HK"],
};

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: `${siteConfig.url}${item.path}`,
  })),
});

export const serviceJsonLd = (input: {
  name: string;
  description: string;
  slug: string;
  serviceType?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: input.name,
  serviceType: input.serviceType || input.name,
  description: input.description,
  url: `${siteConfig.url}/services/${input.slug}`,
  provider: { "@id": `${siteConfig.url}/#business` },
  areaServed: areaServedJsonLd,
  availableLanguage: ["en", "zh-Hans", "zh-Hant"],
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
});
