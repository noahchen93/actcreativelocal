import { MapPin } from "lucide-react";
import { SEO, breadcrumbJsonLd, localBusinessJsonLd } from "../components/SEO";
import { CTASection } from "../components/CTASection";
import { siteConfig } from "../config/site";

const coverage = [
  {
    region: "Singapore (primary)",
    detail:
      "Local coordination at Marina Bay Sands, Suntec, Sands Expo, MBS, Resorts World Sentosa, Gardens by the Bay, ION, Funan and major mall venues.",
  },
  {
    region: "Southeast Asia",
    detail:
      "Cross-border delivery to Malaysia, Indonesia, Thailand, Vietnam and the Philippines — Kuala Lumpur, Jakarta, Bangkok, Manila, Bali, Ho Chi Minh City.",
  },
  {
    region: "Hong Kong, Macau & Greater Bay Area",
    detail:
      "Routed via our southern China supply chain — short transit times for AsiaWorld-Expo, HKCEC and Macau Cotai venues.",
  },
  {
    region: "China (production)",
    detail:
      "Production hubs across Shenzhen, Dongguan, Guangzhou, Foshan, Yiwu, Shanghai and Suzhou — matched to job type rather than a fixed factory.",
  },
];

export function AboutPage() {
  return (
    <>
      <SEO
        title="About | ACT Creative — Singapore-based Cross-Border Production Partner"
        description="ACT Creative is a Singapore-based cross-border event fabrication and production partner. We coordinate custom production through China for agencies and brands across Singapore, Southeast Asia, Hong Kong and Macau."
        path="/about"
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
          localBusinessJsonLd,
        ]}
      />

      <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }} className="bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-4">
              About
            </p>
            <h1
              className="text-white mb-8"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.15,
                fontWeight: 600,
              }}
            >
              A production desk between Singapore and China
            </h1>

            <div className="space-y-6 text-gray-300" style={{ fontSize: "1.0625rem", lineHeight: 1.7 }}>
              <p>
                {siteConfig.name} is a Singapore-based cross-border event fabrication
                and production partner. We help event agencies, PR agencies, brand
                activation teams, exhibition contractors and retail marketing teams
                across Singapore, Southeast Asia, Hong Kong and Macau produce custom
                fabrication, props, exhibition components, FRP/sculpture works and event
                merchandise — through a vetted supply chain in China.
              </p>
              <p>
                We are not the cheapest factory and we don't pretend to be a local main
                contractor. We sit in the middle: a Singapore point of contact for the
                client and a working relationship with the Chinese suppliers actually
                making the work. That's the gap we exist to close.
              </p>
              <p>
                The team is bilingual (Mandarin and English) and used to running projects
                across timezones, on tight event schedules. Every project is single-
                point-of-contact: from first RFQ through QC, packing, shipment and on-
                site handover.
              </p>
            </div>

            <div className="mt-12 grid sm:grid-cols-3 gap-6">
              <Stat label="Based in" value="Singapore" />
              <Stat label="Production" value="China" />
              <Stat label="Coordination" value="Bilingual" />
            </div>
          </div>
        </div>
      </section>

      <section
        style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
        className="bg-[#0a0a0a] border-y border-[#CCFF00]/10"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl" style={{ marginBottom: "3rem" }}>
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-4">
              Where We Work
            </p>
            <h2
              className="text-white mb-5"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.2, fontWeight: 600 }}
            >
              Singapore-led, regional delivery, China production
            </h2>
            <p className="text-gray-400" style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}>
              Coordination from Singapore. Production from China. Delivery wherever your
              project lands across Southeast Asia, Hong Kong and Macau.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            {coverage.map((c) => (
              <div
                key={c.region}
                className="bg-black border border-[#CCFF00]/10 rounded-2xl p-7"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-[#CCFF00]" />
                  <h3 className="text-white text-lg" style={{ fontWeight: 600 }}>
                    {c.region}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm" style={{ lineHeight: 1.65 }}>
                  {c.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-white text-xl">{value}</p>
    </div>
  );
}
