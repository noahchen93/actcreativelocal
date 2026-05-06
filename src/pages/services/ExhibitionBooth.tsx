import { ServicePageLayout } from "../../components/ServicePageLayout";
import { getServiceBySlug, services } from "../../config/services";

export function ExhibitionBooth() {
  const service = getServiceBySlug("exhibition-booth-production-support")!;
  const related = services.filter((s) =>
    [
      "event-fabrication-singapore",
      "china-production-support-for-event-agencies",
      "custom-props-display-fabrication",
    ].includes(s.slug),
  );

  return (
    <ServicePageLayout
      service={service}
      intro="Booth components, counters, display cabinets, plinths, graphic panels and modular event hardware — pre-fabricated in China and coordinated for installation on site. We provide production support for booth contractors, not on-the-ground main contracting."
      sections={[
        {
          heading: "Components we produce",
          bullets: [
            "Counters and reception desks",
            "Display cabinets and plinths",
            "Graphic panels and printed walls",
            "Custom structures and feature pieces",
            "Modular hardware for re-use across shows",
            "Pre-fabricated wall systems and edge cases",
          ],
        },
        {
          heading: "Where we add value",
          bullets: [
            "Cost-effective production for repeating components",
            "Materials and finishes that aren't easily sourced locally",
            "Sampling and QC before shipment",
            "Crating designed for show floor access",
            "Local installation coordination where required",
          ],
        },
        {
          heading: "Note on contracting scope",
          body:
            "ACT Creative provides production support and supplier coordination. For builds that require local main contractor licensing in Singapore, we work alongside your appointed booth contractor rather than replacing them.",
        },
      ]}
      whyPoints={[
        "Familiar with show schedules and load-in windows",
        "Modular thinking for re-usable hardware",
        "Clean shipment documentation for customs",
      ]}
      relatedServices={related}
    />
  );
}
