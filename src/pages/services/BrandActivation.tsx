import { ServicePageLayout } from "../../components/ServicePageLayout";
import { getServiceBySlug, services } from "../../config/services";

export function BrandActivation() {
  const service = getServiceBySlug("brand-activation-production-partner-singapore")!;
  const related = services.filter((s) =>
    [
      "custom-props-display-fabrication",
      "event-fabrication-singapore",
      "event-merchandise-sourcing-from-china",
    ].includes(s.slug),
  );

  return (
    <ServicePageLayout
      service={service}
      intro="Pop-up setups, launch event props, sampling counters, photo opportunities and custom-built campaign elements for PR agencies, brand teams and activation specialists in Singapore."
      sections={[
        {
          heading: "What we build",
          bullets: [
            "Pop-up store setups and shopfronts",
            "Launch event props and feature pieces",
            "Sampling counters and demo units",
            "Photo opportunities and selfie installations",
            "Mall activation materials",
            "Branded merchandise tied to the campaign",
            "Custom-built campaign elements",
          ],
        },
        {
          heading: "Why brand and PR teams use us",
          bullets: [
            "Tight campaign timelines treated seriously",
            "Designs translated into producible specs",
            "Materials chosen for finish and shipping reality",
            "Sampling where the finish has to be on-brand",
            "Consistent quality across activation touchpoints",
          ],
        },
      ]}
      whyPoints={[
        "Comfortable with brand guidelines and tone",
        "Used to balancing visual ambition with delivery dates",
        "Single point of contact for production and merchandise",
      ]}
      relatedServices={related}
    />
  );
}
