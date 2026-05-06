import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, Facebook } from "lucide-react";
import logo from "figma:asset/9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png";
import { siteConfig } from "../config/site";
import { services } from "../config/services";
import { trackEvent } from "../lib/analytics";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Insights", to: "/insights" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Request a Quote", to: "/request-a-quote" },
];

const socialLinks = [
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: Linkedin, event: "linkedin_click" },
  { label: "Instagram", href: siteConfig.social.instagram, icon: Instagram, event: "instagram_click" },
  { label: "YouTube", href: siteConfig.social.youtube, icon: Youtube, event: "youtube_click" },
  { label: "Facebook", href: siteConfig.social.facebook, icon: Facebook, event: "facebook_click" },
];

export function Footer() {
  return (
    <footer className="bg-black text-gray-300 relative overflow-hidden border-t border-[#CCFF00]/20">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#CCFF00] rounded-full mix-blend-screen filter blur-3xl opacity-5 pointer-events-none" />

      <div
        className="container mx-auto px-6 lg:px-8 relative z-10"
        style={{ paddingTop: "4rem", paddingBottom: "3rem" }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <img src={logo} alt="ACT Creative" className="h-12 w-auto mb-5" />
            <p className="text-sm mb-5 text-gray-400 max-w-xs" style={{ lineHeight: 1.6 }}>
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon, event }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  onClick={() => trackEvent(event)}
                  className="text-gray-400 hover:text-[#CCFF00] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white mb-5" style={{ fontWeight: 600 }}>
              Quick Links
            </h4>
            <nav className="space-y-2.5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-gray-400 hover:text-[#CCFF00] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-white mb-5" style={{ fontWeight: 600 }}>
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="text-gray-400 hover:text-[#CCFF00] transition-colors"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-5" style={{ fontWeight: 600 }}>
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  onClick={() => trackEvent("email_click", { location: "footer" })}
                  className="text-gray-400 hover:text-[#CCFF00] transition-colors break-all"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#CCFF00] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400">Singapore · Southeast Asia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#CCFF00]/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <Link to="/privacy-policy" className="hover:text-[#CCFF00] transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
