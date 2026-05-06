import { ServicePageLayout } from "../../components/ServicePageLayout";
import { getServiceBySlug, services } from "../../config/services";

export function CustomPropsDisplay() {
  const service = getServiceBySlug("custom-props-display-fabrication")!;
  const related = services.filter((s) =>
    [
      "frp-sculpture-installation-fabrication",
      "brand-activation-production-partner-singapore",
      "event-fabrication-singapore",
    ].includes(s.slug),
  );

  return (
    <ServicePageLayout
      service={service}
      intro="Custom props, display units, photo-op installations and themed décor — produced from your brief and reference, ready to install on site. We handle the production end so agencies and brand teams can focus on the campaign."
      sections={[
        {
          heading: "What we produce",
          bullets: [
            "Props for events and brand activations",
            "Display units, counters and plinths",
            "Photo-op installations and selfie moments",
            "Product display stands and demo units",
            "Retail and mall activation elements",
            "Themed décor for launches and campaigns",
            "Lightweight structures and modular setups",
          ],
        },
        {
          heading: "How we work",
          bullets: [
            "Brief, reference images or design files in",
            "Material and finish recommendations out",
            "Quotation with breakdown by item and process",
            "Sampling where finish or detail is critical",
            "Production, QC, packing and shipment",
            "On-site coordination as needed",
          ],
        },
      ]}
      whyPoints={[
        "Comfortable with both visual references and CAD files",
        "Realistic timelines tied to your event date",
        "Consistent finish across multiple identical units",
        "Transparent line-item quotation",
      ]}
      relatedServices={related}
    />
  );
}
