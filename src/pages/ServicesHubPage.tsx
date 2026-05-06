import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO, breadcrumbJsonLd } from "../components/SEO";
import { CTASection } from "../components/CTASection";
import { services } from "../config/services";

export function ServicesHubPage() {
  return (
    <>
      <SEO
        title="Event Fabrication, Custom Production & China Sourcing Support | ACT Creative"
        description="Custom event fabrication, props, FRP sculpture, exhibition booth components, event merchandise and brand activation production — all coordinated from Singapore."
        path="/services"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }} className="bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl" style={{ marginBottom: "3.5rem" }}>
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-4">
              Services
            </p>
            <h1
              className="text-white mb-6"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.15,
                fontWeight: 600,
              }}
            >
              Event Fabrication, Custom Production & China Sourcing Support
            </h1>
            <p className="text-gray-400" style={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              We support event agencies, PR agencies, brand activation teams, exhibition
              contractors and retail marketing teams across Singapore and Southeast Asia.
              Each service track below maps to a specific production capability and
              search intent.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div
                key={service.slug}
                className="group bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-2xl p-8 hover:border-[#CCFF00]/40 transition-all flex flex-col"
              >
                <h2 className="text-white text-2xl mb-4" style={{ fontWeight: 600 }}>
                  {service.title}
                </h2>
                <p className="text-gray-400 mb-6 flex-1" style={{ lineHeight: 1.65 }}>
                  {service.oneLiner}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.keywords.slice(0, 4).map((k) => (
                    <span
                      key={k}
                      className="text-xs text-[#CCFF00]/80 bg-[#CCFF00]/5 border border-[#CCFF00]/20 rounded-full px-3 py-1"
                    >
                      {k}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center text-[#CCFF00] group-hover:gap-2 transition-all"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Have a project in mind?"
        description="Send us your RFQ, BOQ or reference images. We'll review feasibility, route and quotation requirements."
      />
    </>
  );
}
