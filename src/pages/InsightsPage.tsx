import { SEO, breadcrumbJsonLd } from "../components/SEO";
import { CTASection } from "../components/CTASection";

const upcoming = [
  "Why B2B Sourcing Is Not the Same as Buying Online",
  "Common Risks When Sourcing Custom Event Items from China",
  "How to Prepare an RFQ for Custom Event Fabrication",
  "Why Reference Images Are Not Enough for Accurate Quotation",
  "What Event Agencies Should Prepare Before Requesting Fabrication Quotes",
  "How Custom Props Are Produced for Brand Activations",
  "What Affects the Cost of Event Fabrication",
  "Rush Production: What Can and Cannot Be Compressed",
  "FRP Sculpture Production: What Clients Should Know",
  "Foam, FRP, Resin and Wood: Choosing the Right Material",
  "How to Ship Large-Scale Props and Sculptures Safely",
  "Why Local Installation Coordination Matters",
];

export function InsightsPage() {
  return (
    <>
      <SEO
        title="Insights | ACT Creative"
        description="Notes on event fabrication, China sourcing, sculpture production, B2B procurement and project risk control — written for agencies, brand teams and exhibition contractors."
        path="/insights"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
        ])}
      />

      <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }} className="bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl" style={{ marginBottom: "3rem" }}>
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-3">
              Insights
            </p>
            <h1 className="text-4xl md:text-5xl text-white mb-6">
              Notes from the production side of events
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Long-form notes on event fabrication, China sourcing, sculpture production,
              B2B procurement and project risk control — written for agencies, brand
              teams and exhibition contractors.
            </p>
          </div>

          <div className="bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-2xl p-8 max-w-3xl">
            <p className="text-[#CCFF00] uppercase tracking-widest text-xs mb-4">
              Coming soon
            </p>
            <ul className="space-y-3">
              {upcoming.map((title) => (
                <li key={title} className="text-gray-300 flex items-start gap-3">
                  <span className="text-[#CCFF00] mt-1">·</span>
                  <span>{title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
