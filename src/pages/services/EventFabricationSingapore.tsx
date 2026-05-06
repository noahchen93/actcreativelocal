import { ServicePageLayout } from "../../components/ServicePageLayout";
import { getServiceBySlug, services } from "../../config/services";

export function EventFabricationSingapore() {
  const service = getServiceBySlug("event-fabrication-singapore")!;
  const related = services
    .filter((s) =>
      [
        "china-production-support-for-event-agencies",
        "custom-props-display-fabrication",
        "frp-sculpture-installation-fabrication",
      ].includes(s.slug),
    );

  return (
    <ServicePageLayout
      service={service}
      intro="ACT Creative supports event agencies, brand activation teams and exhibition contractors in Singapore with custom event fabrication. We handle production through our China supply chain and coordinate locally so the work lands on time, on brief and on site."
      sections={[
        {
          heading: "What we support",
          bullets: [
            "Custom props and themed décor",
            "Backdrops, gantries and photo-op installations",
            "Display units, plinths and counters",
            "Booth components and modular event hardware",
            "FRP, foam and resin sculpture elements",
            "Branded merchandise and event retail items",
          ],
        },
        {
          heading: "Who we work with",
          bullets: [
            "Event agencies and producers",
            "PR and brand activation agencies",
            "Exhibition booth contractors",
            "Retail and mall activation teams",
            "Chinese brands launching in Singapore",
            "Public art and placemaking teams",
          ],
        },
        {
          heading: "How it works",
          body:
            "We work in five steps. The intent is simple: agencies should not have to manage Chinese factories directly, but they should retain visibility on cost, timeline and risk.",
          bullets: [
            "Send RFQ, BOQ or reference images",
            "Feasibility review and material recommendation",
            "Cost and timeline planning aligned to your event date",
            "Sampling, production and QC follow-up",
            "Packing, shipment and Singapore-side handover",
          ],
        },
      ]}
      whyPoints={[
        "Singapore-based point of contact for every project",
        "Vetted Chinese fabrication and merchandise suppliers",
        "Project coordination across timezones and languages",
        "Final QC and packing checks before shipment",
        "Familiar with event timelines and on-site constraints",
        "Transparent quotation with line-item breakdowns",
      ]}
      faqs={[
        {
          q: "Do you only serve clients in Singapore?",
          a: "Singapore is our home base, but we regularly handle event fabrication projects across Southeast Asia (Malaysia, Indonesia, Thailand, Vietnam, the Philippines), as well as Hong Kong and Macau. Production runs through our China supply chain, so cross-border coordination is core to how we operate.",
        },
        {
          q: "Can you fabricate locally in Singapore if a project can't go through China?",
          a: "Yes. For tight timelines, on-site rework, or items that don't make sense to ship internationally, we coordinate with local Singapore fabricators and finishing partners. We'll always recommend the route that fits your timeline, budget and risk tolerance.",
        },
        {
          q: "What information do you need to quote a fabrication project?",
          a: "Ideally we'd like a BOQ or item list, reference images or drawings, target delivery date, delivery location, and any material/finish constraints. We can review feasibility from a brief alone, but pricing accuracy improves with more detail. Use the Request a Quote form to send everything in one go.",
        },
        {
          q: "How early should I send an RFQ before my event?",
          a: "For complex custom fabrication routed through China, 6–10 weeks before the event is comfortable. 3–4 weeks is doable for simpler items with air freight. Anything tighter is case-by-case — we'll be honest about whether the timeline is realistic.",
        },
        {
          q: "Do you handle on-site installation in Singapore?",
          a: "We coordinate installation through trusted local partners in Singapore and other Southeast Asian markets. For Singapore venues that require licensed main contractors (e.g. Suntec, MBS, Sands Expo), we work alongside your appointed contractor rather than replacing them.",
        },
      ]}
      relatedServices={related}
    />
  );
}
