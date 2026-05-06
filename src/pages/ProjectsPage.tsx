import { SEO, breadcrumbJsonLd } from "../components/SEO";
import { CTASection } from "../components/CTASection";

const categories = [
  {
    name: "Event & Activation",
    description:
      "Pop-ups, launches, sampling activations and brand campaigns produced for agencies and brand teams.",
  },
  {
    name: "Exhibition & Booth",
    description:
      "Booth components, counters, plinths and display structures pre-fabricated and shipped for show floors.",
  },
  {
    name: "Sculpture & Installation",
    description:
      "FRP, foam and resin sculpture and large-scale installations for malls, events and public spaces.",
  },
  {
    name: "Merchandise & Premium Gifts",
    description:
      "Branded bags, charms, plush, packaging and event retail items sampled and produced from China.",
  },
  {
    name: "Public Art / Art Projects",
    description:
      "Production support for artists, curators and developers on commercial-scale art works.",
  },
  {
    name: "China Production References",
    description:
      "Selected China-side production references where ACT Creative coordinated specs, sampling and shipment.",
  },
];

export function ProjectsPage() {
  return (
    <>
      <SEO
        title="Projects & Case Studies | ACT Creative"
        description="Selected event fabrication, sculpture, exhibition booth and merchandise projects produced through ACT Creative's Singapore-based coordination and China supply chain."
        path="/projects"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ])}
      />

      <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }} className="bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl" style={{ marginBottom: "3rem" }}>
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-3">
              Projects
            </p>
            <h1 className="text-4xl md:text-5xl text-white mb-6">
              Selected projects across event, exhibition and installation production
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Detailed case studies are being prepared. Below are the categories of work
              ACT Creative supports — full case pages with imagery, scope and outcomes
              are coming online progressively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div
                key={c.name}
                className="bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-2xl p-7"
              >
                <h3 className="text-white text-xl mb-3" style={{ fontWeight: 600 }}>
                  {c.name}
                </h3>
                <p className="text-gray-400 text-sm" style={{ lineHeight: 1.6 }}>
                  {c.description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-12 max-w-3xl">
            Selected works may include highlights from the founder's prior professional
            experience. Project credits belong to respective clients and partners. No
            confidential information is disclosed.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
