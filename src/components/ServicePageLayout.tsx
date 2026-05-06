import { Link } from "react-router-dom";
import { ArrowRight, Check, HelpCircle } from "lucide-react";
import { SEO, breadcrumbJsonLd, serviceJsonLd, faqJsonLd } from "./SEO";
import { CTASection } from "./CTASection";
import type { Service } from "../config/services";

export interface ServiceSection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface ServiceFAQ {
  q: string;
  a: string;
}

export interface ServicePageProps {
  service: Service;
  intro: string;
  sections: ServiceSection[];
  whyPoints?: string[];
  relatedSlugs?: string[];
  relatedServices?: Service[];
  faqs?: ServiceFAQ[];
}

const sectionStyle = { paddingTop: "6rem", paddingBottom: "6rem" } as const;
const tightSectionStyle = { paddingTop: "5rem", paddingBottom: "5rem" } as const;

export function ServicePageLayout({
  service,
  intro,
  sections,
  whyPoints,
  relatedServices,
  faqs,
}: ServicePageProps) {
  const ldArray: object[] = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.title, path: `/services/${service.slug}` },
    ]),
    serviceJsonLd({
      name: service.title,
      description: service.metaDescription,
      slug: service.slug,
    }),
  ];
  if (faqs && faqs.length > 0) ldArray.push(faqJsonLd(faqs));

  return (
    <>
      <SEO
        title={service.metaTitle}
        description={service.metaDescription}
        path={`/services/${service.slug}`}
        jsonLd={ldArray}
      />

      <section style={sectionStyle} className="bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
              <Link to="/" className="hover:text-[#CCFF00]">Home</Link>
              <span>/</span>
              <Link to="/services" className="hover:text-[#CCFF00]">Services</Link>
              <span>/</span>
              <span className="text-gray-300">{service.shortTitle}</span>
            </nav>

            <h1
              className="text-white mb-8"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.15,
                fontWeight: 600,
              }}
            >
              {service.title}
            </h1>

            <p
              className="text-gray-300 mb-10"
              style={{ fontSize: "1.125rem", lineHeight: 1.65 }}
            >
              {intro}
            </p>

            <div className="flex flex-wrap gap-2">
              {service.keywords.map((k) => (
                <span
                  key={k}
                  className="text-xs text-[#CCFF00]/80 bg-[#CCFF00]/5 border border-[#CCFF00]/20 rounded-full px-3 py-1"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        style={tightSectionStyle}
        className="bg-[#0a0a0a] border-y border-[#CCFF00]/10"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl space-y-16">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2
                  className="text-white mb-6"
                  style={{
                    fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                    lineHeight: 1.25,
                    fontWeight: 600,
                  }}
                >
                  {section.heading}
                </h2>
                {section.body && (
                  <p
                    className="text-gray-400 mb-5"
                    style={{ fontSize: "1rem", lineHeight: 1.7 }}
                  >
                    {section.body}
                  </p>
                )}
                {section.bullets && (
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {section.bullets.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-gray-300 bg-black border border-[#CCFF00]/10 rounded-lg px-5 py-4"
                      >
                        <Check className="w-5 h-5 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                        <span style={{ lineHeight: 1.55 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {whyPoints && whyPoints.length > 0 && (
        <section style={sectionStyle} className="bg-black">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl">
              <h2
                className="text-white mb-8"
                style={{
                  fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                  lineHeight: 1.25,
                  fontWeight: 600,
                }}
              >
                Why ACT Creative
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {whyPoints.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 text-gray-300 bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-lg px-5 py-4"
                  >
                    <Check className="w-5 h-5 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                    <span style={{ lineHeight: 1.55 }}>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {faqs && faqs.length > 0 && (
        <section style={tightSectionStyle} className="bg-[#0a0a0a] border-t border-[#CCFF00]/10">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-8">
                <HelpCircle className="w-7 h-7 text-[#CCFF00]" />
                <h2
                  className="text-white"
                  style={{
                    fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                    lineHeight: 1.25,
                    fontWeight: 600,
                  }}
                >
                  Frequently asked questions
                </h2>
              </div>
              <div className="space-y-4">
                {faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group bg-black border border-[#CCFF00]/10 rounded-xl px-6 py-5 open:border-[#CCFF00]/40 transition-colors"
                  >
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4 text-white" style={{ fontWeight: 600 }}>
                      <span>{f.q}</span>
                      <span className="text-[#CCFF00] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p
                      className="text-gray-400 mt-4"
                      style={{ fontSize: "1rem", lineHeight: 1.7 }}
                    >
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {relatedServices && relatedServices.length > 0 && (
        <section
          style={tightSectionStyle}
          className="bg-[#0a0a0a] border-t border-[#CCFF00]/10"
        >
          <div className="container mx-auto px-6 lg:px-8">
            <h2
              className="text-white mb-10"
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
                lineHeight: 1.25,
                fontWeight: 600,
              }}
            >
              Related services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedServices.map((s) => (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="group bg-black border border-[#CCFF00]/10 rounded-2xl p-7 hover:border-[#CCFF00]/40 transition-all"
                >
                  <h3 className="text-white text-lg mb-3" style={{ fontWeight: 600 }}>
                    {s.shortTitle}
                  </h3>
                  <p className="text-gray-400 text-sm mb-5" style={{ lineHeight: 1.6 }}>
                    {s.oneLiner}
                  </p>
                  <span className="inline-flex items-center text-[#CCFF00] text-sm group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection title={`Need ${service.shortTitle.toLowerCase()} support?`} />
    </>
  );
}
