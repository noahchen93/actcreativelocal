import { SEO, breadcrumbJsonLd } from "../components/SEO";
import { siteConfig } from "../config/site";

export function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy | ACT Creative"
        description="How ACT Creative handles personal information collected through this website."
        path="/privacy-policy"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />

      <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }} className="bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-3">
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl text-white mb-8">Privacy Policy</h1>

            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                This page explains how {siteConfig.legalName} ("ACT Creative", "we",
                "us") handles personal information collected through this website.
              </p>

              <h2 className="text-2xl text-white mt-8">Information we collect</h2>
              <p>
                When you submit a Request a Quote form or contact us, we collect the
                information you provide — name, company, email, phone/WhatsApp, project
                description and any attachments. We use it solely to respond to your
                request.
              </p>

              <h2 className="text-2xl text-white mt-8">Analytics</h2>
              <p>
                We use Google Analytics to understand how the site is used in aggregate.
                Analytics data is anonymized and not used to identify individual visitors.
                You can opt out via your browser's privacy settings.
              </p>

              <h2 className="text-2xl text-white mt-8">Data sharing</h2>
              <p>
                We don't sell or share your information with third parties. Your project
                details may be shared with relevant suppliers strictly for the purpose of
                quoting and producing your project.
              </p>

              <h2 className="text-2xl text-white mt-8">Contact</h2>
              <p>
                For privacy-related questions, email{" "}
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-[#CCFF00] hover:underline"
                >
                  {siteConfig.contact.email}
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
