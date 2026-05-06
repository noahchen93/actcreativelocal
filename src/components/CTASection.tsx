import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { whatsappLink } from "../config/site";
import { trackEvent } from "../lib/analytics";

interface CTASectionProps {
  title?: string;
  description?: string;
  variant?: "dark" | "highlight";
}

export function CTASection({
  title = "Ready to start your next production?",
  description = "Send us your RFQ, BOQ or reference images. We'll review feasibility, timeline and quotation requirements.",
  variant = "highlight",
}: CTASectionProps) {
  const isHighlight = variant === "highlight";
  return (
    <section
      style={{ paddingTop: "5rem", paddingBottom: "5rem" }}
      className={
        isHighlight
          ? "bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0a0a0a] border-y border-[#CCFF00]/20"
          : "bg-black"
      }
    >
      <div className="container mx-auto px-6 lg:px-8 text-center max-w-3xl">
        <h2
          className="text-white mb-5"
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            lineHeight: 1.2,
            fontWeight: 600,
          }}
        >
          {title}
        </h2>
        <p
          className="text-gray-400 mb-10"
          style={{ fontSize: "1.0625rem", lineHeight: 1.65 }}
        >
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-[#CCFF00] hover:bg-[#b8e600] text-black px-8 py-6 h-auto text-base"
          >
            <Link to="/request-a-quote">
              Request a Quote
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black bg-transparent px-8 py-6 h-auto text-base"
          >
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("whatsapp_click", { location: "cta_section" })}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Us
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
