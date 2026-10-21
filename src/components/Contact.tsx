import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Check,
  Copy,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Send,
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { formatProjectBrief, projectBriefMailto, projectBriefSubject } from "../lib/projectBrief";

const EMAIL = "contact@actcreative.net";
const MAILTO_SUBJECT = "Project Inquiry - ACT Creative";

type InquiryAttributionBridge = {
  formatLines?: (channel: string) => string;
  track?: (channel: string, label?: string) => void;
  trackAction?: (
    name: string,
    label?: string,
    details?: Record<string, string | number | boolean>,
  ) => void;
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
  { id: "not-sure", zh: "需要建议", en: "Need advice" },
  { id: "event-buildout", zh: "活动搭建", en: "Event buildout" },
  { id: "custom-props", zh: "定制道具", en: "Custom props" },
  { id: "booth", zh: "展台制作", en: "Booth production" },
  { id: "sculpture", zh: "雕塑装置", en: "Sculpture / installation" },
  { id: "merchandise", zh: "活动周边", en: "Event merchandise" },
  { id: "food-truck", zh: "餐车与移动活动", en: "Food truck / mobile activation" },
  { id: "interactive", zh: "互动展示", en: "Interactive display" },
  { id: "seasonal", zh: "节庆装饰", en: "Seasonal decoration" },
];

const stages: BriefOption[] = [
  { id: "exploring", zh: "初步了解 / 需要建议", en: "Exploring / need advice" },
  { id: "budgeting", zh: "方案已有，正在做预算", en: "Concept ready / budgeting" },
  { id: "ready", zh: "图纸或需求已定，准备采购", en: "Brief / drawings ready to source" },
];

const locations: BriefOption[] = [
  { id: "singapore", zh: "新加坡", en: "Singapore" },
  { id: "sea", zh: "东南亚", en: "Southeast Asia" },
  {
    id: "export",
    zh: "其他地区（仅生产与出口）",
    en: "Other market (production/export only)",
  },
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
  { id: "under-5k", zh: "S$5k 以下", en: "Under S$5k" },
  { id: "5k-20k", zh: "S$5k - S$20k", en: "S$5k - S$20k" },
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

const trackSiteAction = (
  name: string,
  label: string,
  details?: Record<string, string | number | boolean>,
) => {
  if (typeof window === "undefined") {
    return;
  }

  window.ACTInquiryAttribution?.trackAction?.(name, label, details);
};

export function Contact() {
  const { t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedBrief, setCopiedBrief] = useState(false);
  const [projectType, setProjectType] = useState(projectTypes[0].id);
  const [location, setLocation] = useState(locations[0].id);
  const [scopeIds, setScopeIds] = useState<string[]>([]);
  const [budget, setBudget] = useState(budgets[0].id);
  const [timeline, setTimeline] = useState("");
  const [notes, setNotes] = useState("");
  const [stage, setStage] = useState(stages[0].id);
  const [specifications, setSpecifications] = useState("");
  const [emailOpened, setEmailOpened] = useState(false);
  const previewRef = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const briefStarted = useRef(false);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const availableScopes = scopes.filter(scope => location !== "export" || scope.id !== "install");
  const selectedScopes = availableScopes.filter(scope => scopeIds.includes(scope.id));
  const brief = {
    projectType: getOption(projectTypes, projectType).en,
    location: getOption(locations, location).en,
    timeline, budget: getOption(budgets, budget).en,
    stage: getOption(stages, stage).en,
    scope: selectedScopes.map(scope => scope.en), specifications, notes,
  };
  const briefMessage = formatProjectBrief(brief);

  const toggleScope = (id: string) => {
    setScopeIds((current) =>
      current.includes(id)
        ? current.filter((scopeId) => scopeId !== id)
        : [...current, id],
    );
  };

  const trackBriefStart = () => {
    if (briefStarted.current) return;
    briefStarted.current = true;
    trackSiteAction("Brief started", "homepage_brief_builder");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      trackInquiryIntent("email_copy", "contact_email_copy");
      setCopiedEmail(true);
      toast.success(t("邮箱已复制到剪贴板", "Email copied to clipboard"), {
        description: EMAIL,
      });
      timers.current.push(setTimeout(() => setCopiedEmail(false), 2200));
    } catch {
      toast(t("请手动复制邮箱", "Please copy the email manually"), {
        description: EMAIL,
      });
    }
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(`${briefMessage}${getAttributionLines("brief_copy")}`);
      trackSiteAction("Brief copied", "homepage_brief_builder", {
        project_type: projectType, location, stage,
      });
      setCopiedBrief(true);
      toast.success(t("项目需求已复制", "Project brief copied"));
      timers.current.push(setTimeout(() => setCopiedBrief(false), 2200));
    } catch {
      previewRef.current?.focus();
      previewRef.current?.select();
      toast(t("请手动复制项目需求", "Please copy the project brief manually"));
    }
  };

  const handleEmail = () => {
    trackInquiryIntent("email", "contact_brief_builder");
    trackSiteAction("Brief email opened", "homepage_brief_builder", {
      project_type: projectType, location, stage,
      has_date: Boolean(timeline.trim()), has_specs: Boolean(specifications.trim()),
    });
    setEmailOpened(true);
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
          width: 100%;
          min-height: 330px;
          resize: vertical;
          white-space: pre-wrap;
          border-radius: 0.65rem;
          border: 1px solid rgba(204,255,0,0.16);
          background: #070707;
          color: rgba(255,255,255,0.78);
          padding: 1rem;
          font-size: 0.86rem;
          line-height: 1.6;
        }
        .brief-help { color: #b9b9b9; font-size: .875rem; line-height: 1.6; }
        .brief-status { margin-top: 1rem; padding: .85rem; border: 1px solid #CCFF00; border-radius: .5rem; }
        .brief-option-grid, .brief-panel { min-width: 0; }
        .brief-preview:focus-visible { outline: 2px solid #CCFF00; outline-offset: 3px; }
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
          <p className="brief-help mt-5 max-w-2xl mx-auto">
            {t("把已知的需求放在一起，方便我们判断制作范围与档期。不确定的项目可以留空；参考图可在邮件中附上。", "Share what you know so we can review scope and timing. Unsure details can stay blank; attach reference images in your email.")}
          </p>
          <p className="brief-help mt-3">
            {t("已有完整需求？", "Already have a brief?")} {" "}
            <a className="text-[#CCFF00] underline" href={`mailto:${EMAIL}?subject=${encodeURIComponent(MAILTO_SUBJECT)}`}>
              {t("直接发邮件", "Email us directly")}
            </a>
          </p>
        </motion.div>

        <div
          className="brief-shell max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="brief-panel p-5 md:p-7"
            onChangeCapture={trackBriefStart}
          >
            <div className="brief-field">
              <div className="brief-label">
                <label htmlFor="brief-type">{t("项目类型", "Project type")}</label>
                <Send className="w-4 h-4 text-[#CCFF00]" />
              </div>
              <select id="brief-type" className="brief-input" value={projectType} onChange={event => setProjectType(event.target.value)}>
                {projectTypes.map((option) => (
                  <option key={option.id} value={option.id}>{t(option.zh, option.en)}</option>
                ))}
              </select>
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
                    onClick={() => {
                      trackBriefStart();
                      setLocation(option.id);
                      if (option.id === "export") setScopeIds(ids => ids.filter(id => id !== "install"));
                    }}
                  >
                    {t(option.zh, option.en)}
                  </button>
                ))}
              </div>
              <p className="brief-help mt-3">
                {t("现场服务按地点及项目逐案确认；其他地区选项仅为生产与出口。", "On-site services depend on location and project review. Other markets: production and export only.")}
              </p>
              {location === "export" && <p className="brief-help mt-3">
                {t(
                  "香港项目仅可在逐案确认后协调中国工厂生产及出口；ACT Creative 在香港没有办公室或本地团队，不提供香港现场安装、仓储或活动执行。",
                  "Hong Kong briefs may be considered case by case for China-side production and export only. ACT Creative has no Hong Kong office or local crew and does not provide on-site installation, warehousing or event execution in Hong Kong.",
                )}
              </p>}
            </div>

            <div className="brief-field grid md:grid-cols-2 gap-4">
              <div>
                <label className="brief-label" htmlFor="brief-timeline">{t("需要交付的日期", "Required date")}</label>
                <input
                  id="brief-timeline"
                  className="brief-input"
                  maxLength={80}
                  value={timeline}
                  onChange={(event) => setTimeline(event.target.value)}
                  placeholder={t("活动日期 / 进场日期 / 待定", "Event date / setup date / TBC")}
                />
              </div>
              <div>
                <label className="brief-label" htmlFor="brief-budget">{t("预算", "Budget")}</label>
                <select id="brief-budget" className="brief-input" value={budget} onChange={event => setBudget(event.target.value)}>
                  {budgets.map((option) => (
                    <option key={option.id} value={option.id}>{t(option.zh, option.en)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="brief-field">
              <label className="brief-label" htmlFor="brief-stage">{t("项目进度", "Project stage")}</label>
              <select id="brief-stage" className="brief-input" value={stage} onChange={event => setStage(event.target.value)}>
                {stages.map(option => <option key={option.id} value={option.id}>{t(option.zh, option.en)}</option>)}
              </select>
            </div>

            <details className="brief-field">
              <summary className="text-[#CCFF00] cursor-pointer py-3">{t("补充制作细节（选填）", "Add production details (optional)")}</summary>
            <div className="brief-field mt-3">
              <div className="brief-label">
                <span>{t("服务范围", "Scope")}</span>
              </div>
              <div className="brief-option-grid">
                {availableScopes.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className="brief-option"
                    data-active={scopeIds.includes(option.id)}
                    aria-pressed={scopeIds.includes(option.id)}
                    onClick={() => { trackBriefStart(); toggleScope(option.id); }}
                  >
                    {t(option.zh, option.en)}
                  </button>
                ))}
              </div>
            </div>

            <div className="brief-field">
              <label className="brief-label" htmlFor="brief-specifications">{t("数量与尺寸", "Quantity / dimensions")}</label>
              <input id="brief-specifications" className="brief-input" maxLength={160} value={specifications} onChange={event => setSpecifications(event.target.value)} placeholder={t("例如：2 件，每件高 1.5 米 / 1 辆车，使用 3 天", "e.g. 2 props, 1.5m tall / 1 vehicle for 3 days")} />
            </div>
            <div className="brief-field">
              <label className="brief-label" htmlFor="brief-notes">{t("补充说明", "Notes")}</label>
              <textarea
                id="brief-notes"
                maxLength={1000}
                className="brief-textarea"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={t(
                  "尺寸、数量、参考图片、场地限制或交付要求",
                  "Size, quantity, references, venue constraints or delivery notes",
                )}
              />
            </div>
            </details>
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
                  {t("草稿预览，尚未发送", "Draft preview — not sent yet")}
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

            <p className="brief-help mb-3" style={{ overflowWrap: "anywhere" }}>{t("邮件主题：", "Subject: ")}{projectBriefSubject(brief)}</p>
            <textarea ref={previewRef} className="brief-preview" aria-label={t("项目需求预览", "Project brief preview")} value={briefMessage} readOnly />
            <p className="brief-help mt-3">{t("需求不会自动发送；自由填写的文字不会作为分析事件上传。打开邮件后请附上参考图，再点击发送。", "Your brief is not sent automatically. Free-text details are not included in analytics events. Open your email app, attach references, then send.")}</p>

            <div className="mt-5">
              <Button
                asChild
                className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black h-12"
              >
                <a href={projectBriefMailto(brief, getAttributionLines("email"))} onClick={handleEmail} data-act-inquiry-enhanced="true">
                <Mail className="w-4 h-4 mr-2" />
                {t("打开邮件草稿", "Open email draft")}
                </a>
              </Button>
              <button type="button" onClick={copyBrief} className="contact-social-link w-full mt-3">
                <Copy className="w-4 h-4" />{t("复制需求，粘贴到邮件或 WhatsApp", "Copy brief for email or WhatsApp")}
              </button>
              <p className="brief-help mt-3">{t("没有打开邮件软件？复制上方需求，用常用邮箱发送至 contact@actcreative.net。", "No email app opened? Copy the brief and send it from your usual inbox to contact@actcreative.net.")}</p>
              {emailOpened && <p className="brief-help brief-status" role="status">{t("已尝试打开邮件草稿；网站无法确认邮件是否已发出。请在邮件软件中完成发送。", "We tried to open your email draft. The website cannot confirm delivery; please send it from your email app.")}</p>}
            </div>

            <div className="mt-6 pt-6 border-t border-[#CCFF00]/10">
              <div className="grid gap-3 text-sm text-gray-300">
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(MAILTO_SUBJECT)}`}
                  className="inline-flex items-center justify-between gap-3 rounded-lg border border-[#CCFF00]/15 px-4 py-3 text-left hover:border-[#CCFF00]/45 hover:text-white transition-colors"
                >
                  <span>{EMAIL}</span>
                  <Mail className="w-4 h-4 text-[#CCFF00]" />
                </a>
              </div>
              <button type="button" onClick={copyEmail} className="contact-social-link mt-3">
                {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{t("复制邮箱地址", "Copy email address")}
              </button>
              <p className="brief-help mt-4">{t("收到邮件后，我们会先核对需求、档期与可承接范围，再确认下一步。提交需求不代表已接受订单或预留档期。", "After receiving your email, we review scope, timing and feasibility before confirming next steps. An enquiry does not reserve capacity or confirm an order.")}</p>
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
