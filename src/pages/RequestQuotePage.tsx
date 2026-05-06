import { useState } from "react";
import { motion } from "motion/react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { SEO, breadcrumbJsonLd } from "../components/SEO";
import { siteConfig, whatsappLink } from "../config/site";
import { trackEvent } from "../lib/analytics";

const projectTypes = [
  "Event Fabrication",
  "Custom Props / Display Units",
  "FRP / Sculpture / Installation",
  "Event Merchandise",
  "Exhibition Booth Components",
  "Brand Activation Setup",
  "China Production Support",
  "Other",
];

const installationOptions = ["Yes", "No", "Not sure"];

type FormState = "idle" | "submitting" | "success" | "error";

export function RequestQuotePage() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const endpoint = siteConfig.forms.rfqEndpoint;
    if (endpoint.includes("REPLACE_WITH_FORM_ID")) {
      // Form submission backend not configured yet — log values and treat as success
      console.warn(
        "[RFQ] Form endpoint not configured. Submission contents:",
        Object.fromEntries(formData.entries()),
      );
      trackEvent("rfq_submit", { status: "placeholder" });
      setState("success");
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Submission failed");
      trackEvent("rfq_submit", { status: "success" });
      setState("success");
      form.reset();
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "Submission failed. Please try again, or email us directly at " +
          siteConfig.contact.email +
          ".",
      );
      setState("error");
    }
  };

  return (
    <>
      <SEO
        title="Request a Fabrication Quote | ACT Creative"
        description="Send your RFQ, BOQ, reference images or project brief. We will review production feasibility, route, timeline and quotation requirements."
        path="/request-a-quote"
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Request a Quote", path: "/request-a-quote" },
        ])}
      />

      <section style={{ paddingTop: "5rem", paddingBottom: "4rem" }} className="bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-[#CCFF00] uppercase tracking-widest text-sm mb-4">
              Get a Quote
            </p>
            <h1
              className="text-white mb-6"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                lineHeight: 1.15,
                fontWeight: 600,
              }}
            >
              Request a Fabrication Quote
            </h1>
            <p
              className="text-gray-400"
              style={{ fontSize: "1.0625rem", lineHeight: 1.7 }}
            >
              Send us your RFQ, BOQ, reference images or project brief. We will review
              the production feasibility, estimated route, timeline and quotation
              requirements.
            </p>
          </div>
        </div>
      </section>

      <section style={{ paddingTop: "1rem", paddingBottom: "5rem" }} className="bg-black">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            {state === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0f0f0f] border border-[#CCFF00]/30 rounded-2xl p-10 text-center"
              >
                <CheckCircle2 className="w-16 h-16 text-[#CCFF00] mx-auto mb-4" />
                <h2 className="text-2xl text-white mb-3">Thank you</h2>
                <p className="text-gray-400 mb-6">
                  We have received your request and will review your project details.
                  Expect a reply within one business day.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    asChild
                    variant="outline"
                    className="border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black bg-transparent"
                  >
                    <a
                      href={whatsappLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        trackEvent("whatsapp_click", { location: "rfq_success" })
                      }
                    >
                      Continue on WhatsApp
                    </a>
                  </Button>
                  <Button
                    onClick={() => setState("idle")}
                    className="bg-[#CCFF00] hover:bg-[#b8e600] text-black"
                  >
                    Send another request
                  </Button>
                </div>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-[#0f0f0f] border border-[#CCFF00]/10 rounded-2xl p-7 md:p-10 flex flex-col"
                style={{ gap: "1.75rem" }}
              >
                <div className="grid md:grid-cols-2" style={{ columnGap: "1.5rem", rowGap: "1.75rem" }}>
                  <Field label="Name" name="name" required />
                  <Field label="Company" name="company" required />
                  <Field label="Email" name="email" type="email" required />
                  <Field label="WhatsApp / Phone" name="phone" required />
                </div>

                <div className="grid md:grid-cols-2" style={{ columnGap: "1.5rem", rowGap: "1.75rem" }}>
                  <div className="flex flex-col" style={{ gap: "0.625rem" }}>
                    <Label htmlFor="projectType" className="text-white text-sm">
                      Project Type<span className="text-[#CCFF00]"> *</span>
                    </Label>
                    <Select name="projectType" required>
                      <SelectTrigger className="bg-black border-[#CCFF00]/20 text-white h-12">
                        <SelectValue placeholder="Select a project type" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectTypes.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Field
                    label="Delivery Location"
                    name="deliveryLocation"
                    placeholder="e.g. Singapore"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2" style={{ columnGap: "1.5rem", rowGap: "1.75rem" }}>
                  <Field
                    label="Target Delivery Date"
                    name="deliveryDate"
                    type="date"
                    required
                  />
                  <Field label="Quantity" name="quantity" placeholder="Optional" />
                </div>

                <div className="grid md:grid-cols-2" style={{ columnGap: "1.5rem", rowGap: "1.75rem" }}>
                  <Field
                    label="Budget Range"
                    name="budget"
                    placeholder="Optional"
                  />
                  <div className="flex flex-col" style={{ gap: "0.625rem" }}>
                    <Label htmlFor="installation" className="text-white text-sm">
                      Installation Required?
                    </Label>
                    <Select name="installation">
                      <SelectTrigger className="bg-black border-[#CCFF00]/20 text-white h-12">
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                      <SelectContent>
                        {installationOptions.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col" style={{ gap: "0.625rem" }}>
                  <Label htmlFor="description" className="text-white text-sm">
                    Project Description<span className="text-[#CCFF00]"> *</span>
                  </Label>
                  <Textarea
                    name="description"
                    required
                    rows={6}
                    placeholder="Describe what you'd like to produce, materials, finishing, reference, timeline constraints, etc."
                    className="bg-black border-[#CCFF00]/20 text-white px-3 py-3"
                  />
                </div>

                <div className="flex flex-col" style={{ gap: "0.625rem" }}>
                  <Label htmlFor="message" className="text-white text-sm">
                    Additional Notes
                  </Label>
                  <Textarea
                    name="message"
                    rows={3}
                    placeholder="Anything else we should know? (optional)"
                    className="bg-black border-[#CCFF00]/20 text-white px-3 py-3"
                  />
                </div>

                {state === "error" && (
                  <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-300">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={state === "submitting"}
                    className="bg-[#CCFF00] hover:bg-[#b8e600] text-black px-8 py-6 h-auto text-base"
                  >
                    {state === "submitting" ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-4">
                    By submitting, you agree we may contact you about your project. We
                    don't share your details with third parties.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

function Field({ label, name, type = "text", required, placeholder }: FieldProps) {
  return (
    <div className="flex flex-col" style={{ gap: "0.625rem" }}>
      <Label htmlFor={name} className="text-white text-sm">
        {label}
        {required && <span className="text-[#CCFF00]"> *</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="bg-black border-[#CCFF00]/20 text-white h-12 px-3"
      />
    </div>
  );
}
