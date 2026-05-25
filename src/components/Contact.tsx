import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Check,
  Copy,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const EMAIL = "contact@actcreative.net";
const WHATSAPP = "6584515268";
const MAILTO_SUBJECT = "Project Inquiry - ACT Creative";

type InquiryAttributionBridge = {
  formatLines?: (channel: string) => string;
  track?: (channel: string, label?: string) => void;
};

declare global {
  interface Window {
    ACTInquiryAttribution?: InquiryAttributionBridge;
  }
}

type BriefOption = {
  id: string;
  zh: string;
  en: string;
};

const projectTypes: BriefOption[] = [
  { id: "event-buildout", zh: "活动搭建", en: "Event buildout" },
  { id: "custom-props", zh: "定制道具", en: "Custom props" },
  { id: "booth", zh: "展台制作", en: "Booth production" },
  { id: "sculpture", zh: "雕塑装置", en: "Sculpture / installation" },
  { id: "merchandise", zh: "活动周边", en: "Event merchandise" },
];

const locations: BriefOption[] = [
  { id: "singapore", zh: "新加坡", en: "Singapore" },
  { id: "sea", zh: "东南亚", en: "Southeast Asia" },
  { id: "hong-kong", zh: "香港 / 澳门", en: "Hong Kong / Macau" },
  { id: "china", zh: "中国大陆", en: "Mainland China" },
];

const scopes: BriefOption[] = [
  { id: "design", zh: "设计深化", en: "Design development" },
  { id: "fabrication", zh: "制作生产", en: "Fabrication" },
  { id: "logistics", zh: "物流运输", en: "Logistics" },
  { id: "install", zh: "现场安装", en: "On-site installation" },
];

const budgets: BriefOption[] = [
  { id: "advice", zh: "需要建议", en: "Need advice" },
  { id: "under-20k", zh: "S$20k 以下", en: "Under S$20k" },
  { id: "20k-50k", zh: "S$20k - S$50k", en: "S$20k - S$50k" },
  { id: "50k-plus", zh: "S$50k 以上", en: "S$50k+" },
];

const getOption = (options: BriefOption[], id: string) =>
  options.find((option) => option.id === id) ?? options[0];

const getAttributionLines = (channel: string) =>
  typeof window !== "undefined"
    ? window.ACTInquiryAttribution?.formatLines?.(channel) ?? ""
    : "";

const trackInquiryIntent = (channel: string, label: string) => {
  if (typeof window === "undefined") {
    return;
  }

  window.ACTInquiryAttribution?.track?.(channel, label);
};

export function Contact() {
  const { t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [projectType, setProjectType] = useState(projectTypes[0].id);
  const [location, setLocation] = useState(locations[0].id);
  const [scopeIds, setScopeIds] = useState<string[]>(["fabrication", "install"]);
  const [budget, setBudget] = useState(budgets[0].id);
  const [timeline, setTimeline] = useState("");
  const [notes, setNotes] = useState("");

  const selectedScopes = scopes.filter((scope) => scopeIds.includes(scope.id));

  const briefMessage = useMemo(() => {
    const rows = [
      "Hi ACT Creative, I'd like to discuss a project.",
      "",
      `Project type: ${getOption(projectTypes, projectType).en}`,
      `Location: ${getOption(locations, location).en}`,
      `Timeline: ${timeline.trim() || "To be confirmed"}`,
      `Scope: ${
        selectedScopes.length
          ? selectedScopes.map((scope) => scope.en).join(", ")
          : "To be confirmed"
      }`,
      `Budget: ${getOption(budgets, budget).en}`,
    ];

    const trimmedNotes = notes.trim();
    if (trimmedNotes) {
      rows.push(`Notes: ${trimmedNotes}`);
    }

    return rows.join("\n");
  }, [budget, location, notes, projectType, selectedScopes, timeline]);

  const toggleScope = (id: string) => {
    setScopeIds((current) =>
      current.includes(id)
        ? current.filter((scopeId) => scopeId !== id)
        : [...current, id],
    );
  };

  const handleWhatsApp = () => {
    trackInquiryIntent("whatsapp", "contact_brief_builder");
    const message = `${briefMessage}${getAttributionLines("whatsapp")}`;

    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener",
    );
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopiedEmail(true);
      toast.success(t("邮箱已复制到剪贴板", "Email copied to clipboard"), {
        description: EMAIL,
      });
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      toast(t("请手动复制邮箱", "Please copy the email manually"), {
        description: EMAIL,
      });
    }
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefMessage);
      setCopiedBrief(true);
      toast.success(t("项目需求已复制", "Project brief copied"));
      setTimeout(() => setCopiedBrief(false), 2200);
    } catch {
      toast(t("请手动复制项目需求", "Please copy the project brief manually"));
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(MAILTO_SUBJECT);
    const body = encodeURIComponent(
      `${briefMessage}${getAttributionLines("email")}\n\nBest,\n`,
    );
    trackInquiryIntent("email", "contact_brief_builder");
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    copyEmail();
  };

  return (
    <section
      id="contact"
      className="py-14 md:py-20 bg-[#0a0a0a] relative overflow-hidden"
    >
      <style>{`
        .brief-shell {
          display: grid;
          gap: 1.25rem;
        }
        .brief-panel {
          position: relative;
          border: 1px solid rgba(204,255,0,0.2);
          border-radius: 0.75rem;
          background: rgba(26,26,26,0.9);
          overflow: hidden;
        }
        .brief-field + .brief-field {
          margin-top: 1.35rem;
        }
        .brief-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.7rem;
          color: rgba(255,255,255,0.72);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .brief-option-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.6rem;
        }
        .brief-option {
          min-height: 44px;
          border: 1px solid rgba(204,255,0,0.18);
          border-radius: 0.55rem;
          padding: 0.7rem 0.85rem;
          color: rgba(255,255,255,0.82);
          background: rgba(10,10,10,0.58);
          font-size: 0.88rem;
          font-weight: 650;
          text-align: left;
          transition: border-color 180ms ease, background 180ms ease, color 180ms ease;
        }
        .brief-option:hover,
        .brief-option:focus-visible {
          border-color: rgba(204,255,0,0.58);
          color: #fff;
          outline: none;
        }
        .brief-option[data-active="true"] {
          border-color: #CCFF00;
          color: #000;
          background: #CCFF00;
        }
        .brief-input,
        .brief-textarea {
          width: 100%;
          border: 1px solid rgba(204,255,0,0.22);
          border-radius: 0.55rem;
          background: rgba(10,10,10,0.62);
          color: #fff;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 180ms ease, background 180ms ease;
        }
        .brief-input {
          height: 46px;
          padding: 0 0.9rem;
        }
        .brief-textarea {
          min-height: 108px;
          resize: vertical;
          padding: 0.85rem 0.9rem;
          line-height: 1.5;
        }
        .brief-input:focus,
        .brief-textarea:focus {
          border-color: #CCFF00;
          background: rgba(0,0,0,0.72);
        }
        .brief-input::placeholder,
        .brief-textarea::placeholder {
          color: rgba(255,255,255,0.38);
        }
        .brief-preview {
          min-height: 220px;
          white-space: pre-wrap;
          border-radius: 0.65rem;
          border: 1px solid rgba(204,255,0,0.16);
          background: #070707;
          color: rgba(255,255,255,0.78);
          padding: 1rem;
          font-size: 0.86rem;
          line-height: 1.6;
        }
        .contact-social-link {
          display: inline-flex;
          min-height: 44px;
          min-width: 150px;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid rgba(204,255,0,0.35);
          border-radius: 0.5rem;
          padding: 0 1rem;
          color: #fff;
          font-size: 0.92rem;
          font-weight: 650;
          line-height: 1;
          transition: border-color 180ms ease, color 180ms ease, background 180ms ease;
        }
        .contact-social-link:hover,
        .contact-social-link:focus-visible {
          border-color: #CCFF00;
          color: #CCFF00;
          background: rgba(204,255,0,0.1);
          outline: none;
        }
        @media (min-width: 1024px) {
          .brief-shell {
            grid-template-columns: minmax(0, 1.15fr) minmax(360px, 0.85fr);
            align-items: start;
          }
        }
        @media (max-width: 639px) {
          .brief-option-grid {
            grid-template-columns: 1fr;
          }
          .contact-social-link {
            width: 100%;
          }
        }
      `}</style>

      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(204,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl text-white mb-4 tracking-wide">
            {t("发送项目需求", "SEND A PROJECT BRIEF")}
          </h2>
          <div className="w-32 h-1 bg-[#CCFF00] mx-auto"></div>
        </motion.div>

        <div className="brief-shell max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="brief-panel p-5 md:p-7"
          >
            <div className="brief-field">
              <div className="brief-label">
                <span>{t("项目类型", "Project type")}</span>
                <Send className="w-4 h-4 text-[#CCFF00]" />
              </div>
              <div className="brief-option-grid">
                {projectTypes.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="brief-option"
                    data-active={projectType === option.id}
                    aria-pressed={projectType === option.id}
                    onClick={() => setProjectType(option.id)}
                  >
                    {t(option.zh, option.en)}
                  </button>
                ))}
              </div>
            </div>

            <div className="brief-field">
              <div className="brief-label">
                <span>{t("地点", "Location")}</span>
                <MapPin className="w-4 h-4 text-[#CCFF00]" />
              </div>
              <div className="brief-option-grid">
                {locations.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="brief-option"
                    data-active={location === option.id}
                    aria-pressed={location === option.id}
                    onClick={() => setLocation(option.id)}
                  >
                    {t(option.zh, option.en)}
                  </button>
                ))}
              </div>
            </div>

            <div className="brief-field grid md:grid-cols-2 gap-4">
              <div>
                <div className="brief-label">
                  <span>{t("时间", "Timeline")}</span>
                </div>
                <input
                  className="brief-input"
                  value={timeline}
                  onChange={(event) => setTimeline(event.target.value)}
                  placeholder={t("例如：2026 年 8 月", "e.g. August 2026")}
                />
              </div>
              <div>
                <div className="brief-label">
                  <span>{t("预算", "Budget")}</span>
                </div>
                <div className="brief-option-grid">
                  {budgets.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className="brief-option"
                      data-active={budget === option.id}
                      aria-pressed={budget === option.id}
                      onClick={() => setBudget(option.id)}
                    >
                      {t(option.zh, option.en)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="brief-field">
              <div className="brief-label">
                <span>{t("服务范围", "Scope")}</span>
              </div>
              <div className="brief-option-grid">
                {scopes.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="brief-option"
                    data-active={scopeIds.includes(option.id)}
                    aria-pressed={scopeIds.includes(option.id)}
                    onClick={() => toggleScope(option.id)}
                  >
                    {t(option.zh, option.en)}
                  </button>
                ))}
              </div>
            </div>

            <div className="brief-field">
              <div className="brief-label">
                <span>{t("补充说明", "Notes")}</span>
              </div>
              <textarea
                className="brief-textarea"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={t(
                  "尺寸、数量、参考图片、场地限制或交付要求",
                  "Size, quantity, references, venue constraints or delivery notes",
                )}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="brief-panel p-5 md:p-7"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-[#CCFF00] text-sm font-bold tracking-[0.14em] uppercase mb-2">
                  {t("需求预览", "Brief preview")}
                </p>
                <p className="text-gray-400 text-sm">
                  {t("快速整理成可发送信息", "Formatted for a faster reply")}
                </p>
              </div>
              <button
                type="button"
                onClick={copyBrief}
                className="w-11 h-11 rounded-lg border border-[#CCFF00]/30 inline-flex items-center justify-center text-[#CCFF00] hover:bg-[#CCFF00]/10 transition-colors"
                aria-label={t("复制项目需求", "Copy project brief")}
              >
                {copiedBrief ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            <div className="brief-preview" aria-live="polite">
              {briefMessage}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-5">
              <Button
                onClick={handleWhatsApp}
                className="bg-[#CCFF00] hover:bg-[#b8e600] text-black h-12"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {t("WhatsApp 发送", "Send via WhatsApp")}
              </Button>
              <Button
                onClick={handleEmail}
                variant="outline"
                className="border-[#CCFF00] text-[#CCFF00] hover:bg-[#CCFF00] hover:text-black h-12 bg-transparent"
              >
                <Mail className="w-4 h-4 mr-2" />
                {t("发送邮件", "Send Email")}
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-[#CCFF00]/10">
              <div className="grid gap-3 text-sm text-gray-300">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center justify-between gap-3 rounded-lg border border-[#CCFF00]/15 px-4 py-3 text-left hover:border-[#CCFF00]/45 hover:text-white transition-colors"
                >
                  <span>{EMAIL}</span>
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-[#CCFF00]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#CCFF00]" />
                  )}
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between gap-3 rounded-lg border border-[#CCFF00]/15 px-4 py-3 hover:border-[#CCFF00]/45 hover:text-white transition-colors"
                >
                  <span>+65 8451 5268</span>
                  <MessageCircle className="w-4 h-4 text-[#CCFF00]" />
                </a>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#CCFF00]/10">
              <p className="text-gray-400 text-sm mb-3">
                {t(
                  "关注 ACT Creative 新加坡官方项目动态",
                  "Follow ACT Creative Singapore official project updates",
                )}
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href="https://www.instagram.com/act_creative_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link"
                  aria-label="Follow ACT Creative Singapore on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61590057715328"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-link"
                  aria-label="Follow ACT Creative Singapore on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
