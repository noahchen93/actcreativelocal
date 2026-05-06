import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Facebook } from "lucide-react";
import { Button } from "../components/ui/button";
import { SEO, breadcrumbJsonLd } from "../components/SEO";
import { siteConfig, whatsappLink } from "../config/site";
import { trackEvent } from "../lib/analytics";

const socialLinks = [
  {
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
    icon: Linkedin,
    event: "linkedin_click",
  },
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    icon: Instagram,
    event: "instagram_click",
  },
  {
    label: "YouTube",
    href: siteConfig.social.youtube,
    icon: Youtube,
    event: "youtube_click",
  },
  {
    label: "Facebook",
    href: siteConfig.social.facebook,
    icon: Facebook,
    event: "facebook_click",
  },
];

export function ContactPage() {
  return (
    <>
      <SEO
        title="Contact | ACT Creative"
        description="Get in touch with ACT Creative for event fabrication, custom props, FRP sculpture, exhibition booth components and event merchandise production support in Singapore."
        path="/contact"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <section style={{ paddingTop: "5rem", paddingBottom: "5rem" }} className="bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl" style={{ marginBottom: "3rem" }}>
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-3">
              Contact
            </p>
            <h1 className="text-4xl md:text-5xl text-white mb-6">Let's talk production</h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              For RFQ submissions, please use the form on{" "}
              <Link to="/request-a-quote" className="text-[#CCFF00] hover:underline">
                Request a Quote
              </Link>
              . For everything else, reach us through the channels below.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-2xl p-6">
              <Mail className="w-7 h-7 text-[#CCFF00] mb-3" />
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                Email
              </p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                onClick={() => trackEvent("email_click", { location: "contact_page" })}
                className="text-white hover:text-[#CCFF00] transition-colors"
              >
                {siteConfig.contact.email}
              </a>
            </div>

            <div className="bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-2xl p-6">
              <Phone className="w-7 h-7 text-[#CCFF00] mb-3" />
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                Phone & WhatsApp
              </p>
              <p className="text-white mb-2">{siteConfig.contact.phone}</p>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click", { location: "contact_page" })}
                className="text-[#CCFF00] hover:underline text-sm"
              >
                Open WhatsApp →
              </a>
            </div>

            <div className="bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-2xl p-6">
              <MapPin className="w-7 h-7 text-[#CCFF00] mb-3" />
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">
                Service Area
              </p>
              <p className="text-white">Singapore</p>
              <p className="text-gray-400 text-sm">Southeast Asia · China-to-SG production</p>
            </div>

            <div className="bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-2xl p-6">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">
                Social
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {socialLinks.map(({ label, href, icon: Icon, event }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    onClick={() => trackEvent(event, { location: "contact_page" })}
                    className="w-10 h-10 rounded-lg bg-black border border-[#CCFF00]/20 flex items-center justify-center text-gray-300 hover:text-[#CCFF00] hover:border-[#CCFF00]/60 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Button
              asChild
              size="lg"
              className="bg-[#CCFF00] hover:bg-[#b8e600] text-black px-8 py-6 h-auto text-base"
            >
              <Link to="/request-a-quote">Submit an RFQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
