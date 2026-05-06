import { ServicePageLayout } from "../../components/ServicePageLayout";
import { getServiceBySlug, services } from "../../config/services";

export function EventMerchandise() {
  const service = getServiceBySlug("event-merchandise-sourcing-from-china")!;
  const related = services.filter((s) =>
    [
      "brand-activation-production-partner-singapore",
      "china-production-support-for-event-agencies",
      "custom-props-display-fabrication",
    ].includes(s.slug),
  );

  return (
    <ServicePageLayout
      service={service}
      intro="Branded bags, acrylic charms, plush, packaging and event retail items — sampled, QC'd and shipped from trusted suppliers in China. Selected merchandise samples produced and delivered for event retail and activation contexts."
      sections={[
        {
          heading: "Merchandise categories",
          bullets: [
            "Branded bags and totes",
            "Acrylic charms and standees",
            "Plush toys and soft goods",
            "Folding chairs, camping tables and event hardware",
            "Giveaways and premium gifts",
            "Custom packaging and gift boxes",
            "Event retail items and limited-edition runs",
          ],
        },
        {
          heading: "Sampling and QC",
          body:
            "Merchandise lives or dies on quality consistency across hundreds of units. We run samples first and QC photos before shipment, so what arrives matches what was approved.",
          bullets: [
            "Pre-production samples for approval",
            "Color, material and packaging check before bulk",
            "QC photos and videos before shipment",
            "Final piece-count check on arrival",
          ],
        },
        {
          heading: "Logistics coordination",
          bullets: [
            "Sea or air freight depending on event date",
            "Customs documentation prepared in advance",
            "Singapore-side warehousing and final delivery",
            "Returns and re-runs handled where feasible",
          ],
        },
      ]}
      whyPoints={[
        "Used to event retail timelines and SKU complexity",
        "Sampling is non-negotiable before bulk runs",
        "Singapore-side handover removes import friction",
      ]}
      relatedServices={related}
    />
  );
}
