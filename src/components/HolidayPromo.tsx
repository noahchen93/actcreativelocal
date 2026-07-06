import { ArrowRight, CalendarDays, Gift, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../contexts/LanguageContext";

const previewImages = [
  {
    src: "/holiday-decorations-singapore/assets/holiday-hero.webp",
    alt: "Commercial festive decoration concept with Christmas tree, lighting and seasonal installation",
  },
];

export function HolidayPromo() {
  const { t } = useLanguage();

  return (
    <section className="holiday-promo-home bg-black">
      <style>{`
        .holiday-promo-home {
          position: relative;
          padding: calc(86px + 1rem) 1rem 1rem;
          border-bottom: 1px solid rgba(204, 255, 0, 0.12);
          overflow: hidden;
        }
        .holiday-promo-shell {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 1rem;
          max-width: min(92vw, 1760px);
          margin: 0 auto;
          padding: clamp(1rem, 2.2vw, 1.5rem);
          border: 1px solid rgba(204, 255, 0, 0.2);
          border-radius: 8px;
          background:
            linear-gradient(135deg, rgba(174, 20, 34, 0.24), rgba(10, 10, 10, 0.94) 42%),
            linear-gradient(90deg, rgba(204, 255, 0, 0.1), rgba(204, 255, 0, 0) 34%),
            #0a0a0a;
          box-shadow: 0 22px 72px -54px rgba(204, 255, 0, 0.72);
        }
        .holiday-promo-copy {
          min-width: 0;
        }
        .holiday-promo-kicker {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.65rem;
          color: #f1d078;
          font-size: 0.78rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: 0;
        }
        .holiday-promo-title {
          color: #fff;
          font-size: clamp(1.45rem, 4.8vw, 2.45rem);
          line-height: 1.06;
          font-weight: 850;
          letter-spacing: 0;
          text-wrap: balance;
        }
        .holiday-promo-body {
          max-width: 64rem;
          margin-top: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: clamp(0.92rem, 1vw, 1.02rem);
          line-height: 1.58;
        }
        .holiday-promo-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.7rem;
          margin-top: 1rem;
        }
        .holiday-promo-button {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border-radius: 8px;
          padding: 0.72rem 1rem;
          font-size: 0.9rem;
          font-weight: 760;
          line-height: 1.15;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, color 180ms ease;
        }
        .holiday-promo-button:focus-visible {
          outline: 2px solid rgba(204, 255, 0, 0.9);
          outline-offset: 3px;
        }
        .holiday-promo-button-primary {
          background: #ccff00;
          color: #050505;
          border: 1px solid #ccff00;
        }
        .holiday-promo-button-primary:hover {
          background: #d7ff4d;
          transform: translateY(-1px);
        }
        .holiday-promo-button-secondary {
          color: #fff;
          border: 1px solid rgba(241, 208, 120, 0.46);
          background: rgba(255, 255, 255, 0.045);
        }
        .holiday-promo-button-secondary:hover {
          border-color: rgba(241, 208, 120, 0.88);
          background: rgba(241, 208, 120, 0.1);
          transform: translateY(-1px);
        }
        .holiday-promo-media {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 0.5rem;
          min-width: 0;
        }
        .holiday-promo-image {
          aspect-ratio: 16 / 7;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: #111;
        }
        .holiday-promo-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        @media (min-width: 960px) {
          .holiday-promo-home {
            padding-top: calc(86px + 1.25rem);
            padding-bottom: 1.25rem;
          }
          .holiday-promo-shell {
            grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.55fr);
            align-items: center;
          }
        }
        @media (max-width: 520px) {
          .holiday-promo-home {
            padding-left: 0.75rem;
            padding-right: 0.75rem;
          }
          .holiday-promo-shell {
            padding: 0.9rem;
          }
          .holiday-promo-actions {
            display: grid;
          }
          .holiday-promo-button {
            width: 100%;
          }
        }
      `}</style>
      <motion.div
        className="holiday-promo-shell"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="holiday-promo-copy">
          <div className="holiday-promo-kicker">
            <CalendarDays className="h-4 w-4" />
            <span>{t("节庆装饰项目咨询已开放", "Festive decoration consultation is open")}</span>
          </div>
          <h2 className="holiday-promo-title">
            {t(
              "商场、品牌、办公楼与公共空间节庆装饰",
              "Christmas trees and CNY sculpture decor for commercial spaces",
            )}
          </h2>
          <p className="holiday-promo-body">
            {t(
              "从圣诞树、春节雕塑、灯笼与灯光装置，到采购、定制制作、安装、维护和拆除，我们把节庆装饰作为一个可落地的商业空间项目来统筹。",
              "From custom Christmas trees and Year of the Goat / Ram CNY sculptures to lanterns, lighting, sourcing, fabrication, installation, maintenance and dismantling, we coordinate festive decor as a buildable commercial-space project.",
            )}
          </p>
          <div className="holiday-promo-actions">
            <a className="holiday-promo-button holiday-promo-button-primary" href="/holiday-decorations-singapore/">
              <Gift className="h-4 w-4" />
              <span>{t("查看节庆装饰服务", "View Christmas & CNY decor")}</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              className="holiday-promo-button holiday-promo-button-secondary"
              href="https://wa.me/6584515268?text=Hi%20ACT%20Creative%2C%20I%20would%20like%20to%20discuss%20Christmas%2C%20New%20Year%20or%20Chinese%20New%20Year%20decor%20support."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Sparkles className="h-4 w-4" />
              <span>{t("WhatsApp 发送节庆需求", "WhatsApp a festive brief")}</span>
            </a>
          </div>
        </div>
        <div className="holiday-promo-media" aria-hidden="true">
          {previewImages.map((image) => (
            <div className="holiday-promo-image" key={image.src}>
              <img src={image.src} alt={image.alt} loading="eager" decoding="async" />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
