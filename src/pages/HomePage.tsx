import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe,
  ShieldCheck,
  Boxes,
  PackageCheck,
  Truck,
  ClipboardCheck,
  MapPin,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { SEO, localBusinessJsonLd, websiteJsonLd, faqJsonLd } from "../components/SEO";
import { CTASection } from "../components/CTASection";
import { siteConfig } from "../config/site";
import { services } from "../config/services";

const homeFaqs = [
  {
    q: "Where is ACT Creative based and where do you deliver?",
    a: "We're based in Singapore with production support across China. We deliver to Singapore, Malaysia, Indonesia, Thailand, Vietnam, the Philippines, Hong Kong and Macau — anywhere we can ship and coordinate within reasonable event timelines.",
  },
  {
    q: "Are you a fabrication factory yourself?",
    a: "No. We're a Singapore-based production desk. We coordinate fabrication through a vetted network of Chinese factories and Singapore-side finishing partners, so agencies and brands don't have to manage suppliers directly.",
  },
  {
    q: "What types of projects do you take on?",
    a: "Custom event fabrication, props, exhibition booth components, FRP/sculpture, branded merchandise, brand activation setups and themed décor. We work with event agencies, PR agencies, brand activation teams, exhibition contractors, retail and mall activation teams.",
  },
  {
    q: "Can you work with Chinese-speaking clients launching in Singapore?",
    a: "Yes. The team is bilingual (Mandarin and English). For Chinese brands launching events in Singapore or Southeast Asia, we cover both the local Singapore execution side and China-side production in one workflow.",
  },
];

const serviceRegions = [
  {
    title: "Singapore (primary)",
    body:
      "Our home base. Direct local coordination for events at MBS, Suntec, Sands Expo, Marina Bay, Gardens by the Bay, Resorts World Sentosa, Funan, ION and major mall venues.",
    cities: ["Marina Bay", "Sentosa", "Orchard", "Suntec", "Changi", "Jewel"],
  },
  {
    title: "Southeast Asia",
    body:
      "Cross-border delivery to ASEAN markets. Used by regional event agencies routing production through a single Singapore desk.",
    cities: ["Kuala Lumpur", "Jakarta", "Bangkok", "Manila", "Ho Chi Minh City", "Bali"],
  },
  {
    title: "Hong Kong & Macau",
    body:
      "Greater Bay Area projects routed via our China supply chain. Shorter transit times for sea freight from southern China factories.",
    cities: ["Hong Kong Island", "Kowloon", "AsiaWorld-Expo", "HKCEC", "Macau Cotai"],
  },
  {
    title: "China (production hub)",
    body:
      "Where we manufacture. Specialist clusters in Yiwu, Dongguan, Shenzhen, Guangzhou, Foshan, Shanghai and Suzhou matched to your job type.",
    cities: ["Shenzhen", "Guangzhou", "Foshan", "Dongguan", "Yiwu", "Shanghai"],
  },
];

const homeServices = services.slice(0, 6);

const whyPoints = [
  {
    icon: Globe,
    title: "Singapore-based, China-connected",
    body:
      "Local coordination in Singapore with direct access to a vetted network of fabrication and merchandise suppliers in China.",
  },
  {
    icon: ShieldCheck,
    title: "Project-grade accountability",
    body:
      "We act as your production desk: feasibility review, sampling, QC, packing and shipment — under one point of contact.",
  },
  {
    icon: Boxes,
    title: "Built for event timelines",
    body:
      "Tight schedules, evolving briefs, last-minute revisions — we plan production routes around real event delivery dates.",
  },
];

const howItWorks = [
  {
    icon: ClipboardCheck,
    title: "Send us your RFQ",
    body: "Share your BOQ, drawings, reference images or brief.",
  },
  {
    icon: PackageCheck,
    title: "Feasibility & quotation",
    body: "We review materials, production route, timeline and cost structure.",
  },
  {
    icon: Boxes,
    title: "Sampling & production",
    body: "Sampling, pre-production checks, supplier coordination and QC.",
  },
  {
    icon: Truck,
    title: "Delivery & local handover",
    body: "Packing, shipment, customs coordination and on-site handover.",
  },
];

export function HomePage() {
  return (
    <>
      <SEO
        title="ACT Creative | Cross-Border Event Fabrication & Production Partner Based in Singapore"
        description={siteConfig.description}
        path="/"
        jsonLd={[localBusinessJsonLd, websiteJsonLd, faqJsonLd(homeFaqs)]}
      />

      <section
        className="relative flex items-center overflow-hidden bg-black"
        style={{ minHeight: "calc(100vh - 5rem)", paddingTop: "5rem", paddingBottom: "6rem" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-[480px] h-[480px] bg-[#CCFF00] rounded-full filter blur-3xl"
            style={{ opacity: 0.04 }}
          />
          <div
            className="absolute -bottom-40 -left-32 w-[480px] h-[480px] bg-[#CCFF00] rounded-full filter blur-3xl"
            style={{ opacity: 0.03 }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.025)_1px,transparent_1px)] bg-[size:100px_100px]" />
        </div>

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#1a1a1a]/90 backdrop-blur-xl rounded-full border border-[#CCFF00]/30 mb-8">
              <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse" />
              <span className="text-sm text-white">
                Singapore-based · Cross-border production · Event fabrication
              </span>
            </div>

            <h1
              className="text-white tracking-tight mb-8"
              style={{
                fontSize: "clamp(2rem, 4.4vw, 3.75rem)",
                lineHeight: 1.1,
                fontWeight: 600,
              }}
            >
              <span className="text-[#CCFF00]">Cross-Border Event Fabrication</span>
              <br />
              & Production Partner Based in Singapore
            </h1>

            <p
              className="text-gray-300 leading-relaxed max-w-3xl mb-10"
              style={{ fontSize: "1.125rem", lineHeight: 1.6 }}
            >
              ACT Creative helps event agencies and brands manage custom fabrication,
              props, exhibition components, FRP/sculpture works and event merchandise
              from China — with local coordination in Singapore and Southeast Asia.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-2xl hover:shadow-[#CCFF00]/50 transition-all text-base px-8 py-6 h-auto"
              >
                <Link to="/request-a-quote">
                  Request a Fabrication Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black bg-transparent text-base px-8 py-6 h-auto"
              >
                <Link to="/projects">View Portfolio</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: "7rem", paddingBottom: "7rem" }} className="bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl" style={{ marginBottom: "4rem" }}>
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-4">
              What We Do
            </p>
            <h2
              className="text-white mb-5"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.2, fontWeight: 600 }}
            >
              Six production tracks, one Singapore-based contact
            </h2>
            <p className="text-gray-400" style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}>
              From custom props to FRP sculpture, exhibition components to branded
              merchandise — production handled in China, coordination handled here.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeServices.map((service) => (
              <div
                key={service.slug}
                className="group bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-2xl p-7 hover:border-[#CCFF00]/40 transition-all"
              >
                <h3 className="text-white text-xl mb-3" style={{ fontWeight: 600 }}>
                  {service.shortTitle}
                </h3>
                <p className="text-gray-400 text-sm mb-5" style={{ lineHeight: 1.6 }}>
                  {service.oneLiner}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.keywords.slice(0, 3).map((k) => (
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
                  className="inline-flex items-center text-[#CCFF00] text-sm group-hover:gap-2 transition-all"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{ paddingTop: "7rem", paddingBottom: "7rem" }}
        className="bg-[#0a0a0a] border-y border-[#CCFF00]/10"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl" style={{ marginBottom: "4rem" }}>
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-4">
              Why ACT Creative
            </p>
            <h2
              className="text-white mb-5"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.2, fontWeight: 600 }}
            >
              A production partner that speaks both sides
            </h2>
            <p className="text-gray-400" style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}>
              Most agencies don't want to manage Chinese factories directly. We sit
              between you and the supply chain — translating briefs, controlling risk and
              owning delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {whyPoints.map((item) => (
              <div
                key={item.title}
                className="bg-black border border-[#CCFF00]/10 rounded-2xl p-7"
              >
                <div className="w-12 h-12 rounded-xl bg-[#CCFF00]/10 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-[#CCFF00]" />
                </div>
                <h3 className="text-white text-lg mb-3" style={{ fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm" style={{ lineHeight: 1.6 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{ paddingTop: "7rem", paddingBottom: "7rem" }}
        className="bg-black"
        aria-labelledby="where-we-work"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl" style={{ marginBottom: "4rem" }}>
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-4">
              Where We Work
            </p>
            <h2
              id="where-we-work"
              className="text-white mb-5"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.2, fontWeight: 600 }}
            >
              Singapore-led, Southeast Asia delivery, Greater China production
            </h2>
            <p className="text-gray-400" style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}>
              Our coordination desk is in Singapore. Production runs through China.
              Delivery covers Singapore, ASEAN, Hong Kong and Macau — wherever your event,
              activation or installation lands.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {serviceRegions.map((r) => (
              <div
                key={r.title}
                className="bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-2xl p-7"
              >
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-[#CCFF00]" />
                  <h3 className="text-white text-lg" style={{ fontWeight: 600 }}>
                    {r.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm mb-5" style={{ lineHeight: 1.65 }}>
                  {r.body}
                </p>
                <div className="flex flex-wrap gap-2">
                  {r.cities.map((city) => (
                    <span
                      key={city}
                      className="text-xs text-[#CCFF00]/80 bg-[#CCFF00]/5 border border-[#CCFF00]/20 rounded-full px-3 py-1"
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        style={{ paddingTop: "7rem", paddingBottom: "7rem" }}
        className="bg-[#0a0a0a] border-y border-[#CCFF00]/10"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl" style={{ marginBottom: "4rem" }}>
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-4">
              How It Works
            </p>
            <h2
              className="text-white mb-5"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.2, fontWeight: 600 }}
            >
              From RFQ to on-site handover
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div
                key={step.title}
                className="relative bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-2xl p-7"
              >
                <div
                  className="absolute top-4 right-5 text-[#CCFF00]/10"
                  style={{ fontSize: "2.25rem", fontWeight: 700 }}
                >
                  0{i + 1}
                </div>
                <step.icon className="w-8 h-8 text-[#CCFF00] mb-4" />
                <h3 className="text-white text-lg mb-2" style={{ fontWeight: 600 }}>
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm" style={{ lineHeight: 1.6 }}>
                  {step.body}
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
