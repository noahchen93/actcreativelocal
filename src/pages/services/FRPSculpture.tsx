import { ServicePageLayout } from "../../components/ServicePageLayout";
import { getServiceBySlug, services } from "../../config/services";

export function FRPSculpture() {
  const service = getServiceBySlug("frp-sculpture-installation-fabrication")!;
  const related = services.filter((s) =>
    [
      "custom-props-display-fabrication",
      "event-fabrication-singapore",
      "china-production-support-for-event-agencies",
    ].includes(s.slug),
  );

  return (
    <ServicePageLayout
      service={service}
      intro="Custom FRP, foam, resin and mixed-material sculpture fabrication for events, malls, exhibitions and commercial installations. We handle production through specialist fabrication partners in China and coordinate finishing, packing and on-site installation in Singapore and the region."
      sections={[
        {
          heading: "What we produce",
          bullets: [
            "FRP (fiberglass-reinforced plastic) sculpture",
            "EPS foam sculpture and themed structures",
            "Resin objects and detailed cast pieces",
            "Fiberglass props and large-scale shells",
            "Mall decoration and seasonal installations",
            "Photo-op installations and themed environments",
            "Commercial-scale art installations",
            "Production support for artist artworks",
          ],
        },
        {
          heading: "Materials and process",
          body:
            "Material choice drives cost, weight, finish and timeline. We help spec the right combination — FRP for hard finishes and durability, EPS foam for fast lightweight builds, resin for fine detail, mixed builds for large pieces. Sampling and reference reviews happen before bulk production starts.",
        },
        {
          heading: "Coordination and installation",
          bullets: [
            "Engineering review for transport and on-site installation",
            "Modular breakdowns for shipment by sea or air",
            "Crating designed for site access and reassembly",
            "Touch-up and finishing on arrival in Singapore",
            "On-site installation coordination where required",
          ],
        },
        {
          heading: "Note on credits",
          body:
            "Selected works may include highlights from the founder's prior professional experience. Project credits belong to respective clients and partners. No confidential information is disclosed.",
        },
      ]}
      whyPoints={[
        "Specialist FRP and foam fabrication network in China",
        "Engineering review before quotation",
        "Final finishing checks before shipment",
        "Singapore-side coordination through installation",
        "Comfortable working alongside artists, designers and developers",
      ]}
      faqs={[
        {
          q: "What sizes of FRP sculpture can you produce?",
          a: "From 1m photo-op pieces to 8m+ commercial installations. Larger sculptures are produced in modular sections, engineered for transport and reassembly on site. We'll engineer the breakdown alongside the design before sampling.",
        },
        {
          q: "Can you ship FRP sculptures from China to Singapore, Hong Kong or other Southeast Asian markets?",
          a: "Yes. Sea freight is standard for large pieces; we crate and palletise specifically for the destination's load-in access. We've handled deliveries to Singapore, Hong Kong, Macau, Bangkok, Kuala Lumpur, Jakarta and Manila.",
        },
        {
          q: "FRP, foam, resin or wood — how do I choose the right material?",
          a: "FRP is the workhorse for durable outdoor and high-traffic pieces. EPS foam (with hard coat) is fast and lightweight for short-run event installations. Resin gives the finest detail. Wood works for warm, crafted finishes. We recommend the right combination based on lifespan, budget, transport and finish requirements.",
        },
        {
          q: "Can you support artists or galleries on commercial fabrication?",
          a: "Yes. We work alongside artists, curators, scenographers and developers. Selected works may include highlights from the founder's prior professional experience — project credits remain with respective clients and partners.",
        },
        {
          q: "Do you arrange installation in Singapore?",
          a: "We coordinate installation through trusted local partners and rigging crews. For shopping mall installations and public venues that require licensed contractors in Singapore, we partner with the appointed main contractor for the install phase.",
        },
      ]}
      relatedServices={related}
    />
  );
}
