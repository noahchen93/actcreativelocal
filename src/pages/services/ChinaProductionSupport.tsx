import { ServicePageLayout } from "../../components/ServicePageLayout";
import { getServiceBySlug, services } from "../../config/services";

export function ChinaProductionSupport() {
  const service = getServiceBySlug("china-production-support-for-event-agencies")!;
  const related = services.filter((s) =>
    [
      "event-fabrication-singapore",
      "event-merchandise-sourcing-from-china",
      "exhibition-booth-production-support",
    ].includes(s.slug),
  );

  return (
    <ServicePageLayout
      service={service}
      intro="We act as your Singapore-based production desk for China-side custom fabrication. The goal is not to be the cheapest factory — it's to make production routes through China feasible for an agency that can't afford to manage them directly."
      sections={[
        {
          heading: "Why agencies use China production",
          body:
            "Local Singapore fabrication can be expensive, slow or capacity-constrained on tight timelines. Chinese suppliers offer breadth of materials and craft, but communication, accountability and shipment logistics often become a deal-breaker for agencies running multiple events at once.",
        },
        {
          heading: "Common risks when working with overseas factories directly",
          bullets: [
            "Specs lost in translation or interpreted differently",
            "Sampling and approvals dragging past event timelines",
            "Quality drift between sample and bulk production",
            "Hidden cost in packing, shipping and customs",
            "No accountability when things slip on-site",
          ],
        },
        {
          heading: "How ACT Creative reduces friction",
          bullets: [
            "Single Singapore-based contact for the whole project",
            "Translation and clarification before the supplier quotes",
            "Pre-production samples reviewed against your reference",
            "QC photos and videos before shipment",
            "Packing and crating planned for event load-in",
            "Issue resolution accountability through delivery",
          ],
        },
        {
          heading: "Typical production items we route through China",
          bullets: [
            "Custom props, display units, photo-op installations",
            "FRP/foam/resin sculpture and large-scale installations",
            "Booth components, counters, plinths, graphic panels",
            "Branded merchandise and event retail items",
            "Themed décor and campaign elements",
            "Specialty packaging and giveaways",
          ],
        },
      ]}
      whyPoints={[
        "We pre-screen factories for the type of work you need",
        "We don't quote until specs and route are clear",
        "We hold the supplier accountable, not you",
        "We plan packing and shipping around your event date",
        "Mandarin–English production communication built in",
      ]}
      faqs={[
        {
          q: "Which parts of China do you work with?",
          a: "Production network spans the major fabrication hubs — Yiwu (small goods, merchandise), Shenzhen and Dongguan (props, displays, electronics), Guangzhou and Foshan (FRP, sculpture, finishing), and Shanghai/Suzhou (premium and large-format). We pick the route based on the job, not a fixed factory.",
        },
        {
          q: "Can you ship directly to Singapore, Hong Kong, Malaysia or other Southeast Asian destinations?",
          a: "Yes. Sea freight is the default for cost-effective shipments to Singapore, Port Klang, Hong Kong and other regional ports. Air freight is available for tight timelines or fragile items. Customs documentation is prepared in advance for both.",
        },
        {
          q: "Do you handle the supplier directly or do I still need to talk to them?",
          a: "We handle supplier communication end to end — clarifying specs, reviewing samples, running QC and managing changes. You only deal with us. If you want supplier visibility for transparency, we can share QC photos, video walk-throughs or arrange factory visits.",
        },
        {
          q: "How is your pricing structured?",
          a: "We quote line-item: production cost, packing, freight, customs handling, and our coordination fee. No hidden margins on freight or sample stages. You can see exactly what each part of the route costs.",
        },
        {
          q: "What happens if production goes wrong?",
          a: "We hold the supplier accountable, not you. If items fail QC, we negotiate rework or rejection with the factory before shipment. If issues surface after delivery, we coordinate the resolution — replacement, refund or rework — through the original supplier relationship.",
        },
      ]}
      relatedServices={related}
    />
  );
}
