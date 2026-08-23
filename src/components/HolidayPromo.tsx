import { ArrowRight, Gift, Mail } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { FESTIVE_INQUIRY_MAILTO } from "../lib/contactLinks";

const previewImages = [
  {
    src: "/holiday-decorations-singapore/assets/holiday-hero.webp",
    alt: "Commercial festive decoration concept with Christmas tree, lighting and seasonal installation",
  },
];

export function HolidayPromo() {
  const { t } = useLanguage();

  return (
    <section className="holiday-promo-home" aria-label="Holiday decorations promotion">
      <style>{`
        .holiday-promo-home {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 60;
          height: var(--holiday-promo-height, 72px);
          padding: 0.35rem 0.75rem;
          overflow: hidden;
          border-bottom: 1px solid rgba(255, 209, 102, 0.28);
          background:
            linear-gradient(90deg, rgba(7, 24, 14, 0.96), rgba(42, 7, 16, 0.98) 38%, rgba(38, 22, 4, 0.96) 68%, rgba(4, 18, 26, 0.98));
        }
        .holiday-promo-shell {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          gap: 0.65rem;
          width: 100%;
          height: 100%;
          max-width: min(92vw, 1760px);
          margin: 0 auto;
          padding: 0.32rem 0.6rem;
          overflow: hidden;
          border: 1px solid transparent;
          border-radius: 8px;
          background:
            linear-gradient(108deg, rgba(30, 8, 14, 0.95), rgba(7, 21, 17, 0.92) 44%, rgba(37, 18, 5, 0.94)) padding-box,
            linear-gradient(90deg, #ccff00 0%, #ffd166 24%, #ff3d71 52%, #2ee6a6 76%, #35d7ff 100%) border-box;
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.04),
            0 14px 34px -28px rgba(255, 61, 113, 0.9),
            0 14px 36px -30px rgba(53, 215, 255, 0.8);
          animation: holiday-promo-enter 320ms ease-out both;
        }
        .holiday-promo-shell::after {
          content: "";
          position: absolute;
          left: 0.6rem;
          right: 0.6rem;
          bottom: 0;
          height: 2px;
          border-radius: 999px;
          pointer-events: none;
          background: linear-gradient(90deg, #ccff00, #ffd166 28%, #ff3d71 56%, #35d7ff);
          opacity: 0.95;
        }
        .holiday-promo-copy {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 0.65rem;
        }
        .holiday-promo-title {
          min-width: 0;
          overflow: hidden;
          color: #fff7dd;
          font-size: clamp(0.88rem, 1.25vw, 1.06rem);
          line-height: 1.1;
          font-weight: 850;
          letter-spacing: 0;
          text-shadow: 0 0 18px rgba(255, 209, 102, 0.22);
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .holiday-promo-actions {
          display: flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 0.45rem;
        }
        .holiday-promo-button {
          display: inline-flex;
          min-height: 30px;
          align-items: center;
          justify-content: center;
          gap: 0.42rem;
          border-radius: 8px;
          padding: 0.35rem 0.62rem;
          font-size: 0.72rem;
          font-weight: 760;
          line-height: 1.1;
          white-space: nowrap;
          transition: transform 180ms ease, border-color 180ms ease, background 180ms ease, color 180ms ease;
        }
        .holiday-promo-button:focus-visible {
          outline: 2px solid rgba(204, 255, 0, 0.9);
          outline-offset: 2px;
        }
        .holiday-promo-button-primary {
          border: 1px solid #d8ff29;
          background: linear-gradient(90deg, #ccff00, #fff06a);
          color: #050505;
          box-shadow: 0 0 22px -16px rgba(204, 255, 0, 0.95);
        }
        .holiday-promo-button-primary:hover {
          background: linear-gradient(90deg, #dfff42, #fff49a);
          transform: translateY(-1px);
        }
        .holiday-promo-button-secondary {
          border: 1px solid rgba(53, 215, 255, 0.48);
          background: rgba(53, 215, 255, 0.07);
          color: #fff;
        }
        .holiday-promo-button-secondary:hover {
          border-color: rgba(255, 61, 113, 0.8);
          background: rgba(255, 61, 113, 0.12);
          transform: translateY(-1px);
        }
        .holiday-promo-media {
          display: none;
          flex: 0 0 auto;
          width: 116px;
          height: 38px;
          overflow: hidden;
          border: 1px solid rgba(255, 209, 102, 0.32);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.055);
        }
        .holiday-promo-media img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        @media (min-width: 768px) {
          .holiday-promo-home {
            padding: 0.32rem 0.75rem;
          }
          .holiday-promo-shell {
            grid-template-columns: minmax(0, 1fr) auto auto;
            gap: 0.75rem;
            padding: 0.28rem 0.7rem;
          }
          .holiday-promo-media {
            display: block;
          }
        }
        @media (min-width: 1180px) {
          .holiday-promo-title {
            font-size: clamp(0.92rem, 1vw, 1.08rem);
          }
          .holiday-promo-button {
            min-height: 32px;
            padding-inline: 0.72rem;
            font-size: 0.76rem;
          }
          .holiday-promo-media {
            width: 132px;
            height: 40px;
          }
        }
        @media (max-width: 640px) {
          .holiday-promo-shell {
            gap: 0.5rem;
            padding: 0.42rem 0.55rem;
          }
          .holiday-promo-copy {
            gap: 0;
          }
          .holiday-promo-title {
            display: -webkit-box;
            font-size: 0.86rem;
            line-height: 1.12;
            white-space: normal;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .holiday-promo-button {
            min-height: 30px;
            padding: 0.34rem 0.5rem;
            font-size: 0.68rem;
          }
          .holiday-promo-button-primary span {
            display: none;
          }
          .holiday-promo-button-secondary {
            display: none;
          }
        }
        @keyframes holiday-promo-enter {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .holiday-promo-shell { animation: none; }
          .holiday-promo-button { transition: none; }
        }
      `}</style>
      <div className="holiday-promo-shell">
        <div className="holiday-promo-copy">
          <h2 className="holiday-promo-title">
            {t(
              "Christmas trees and CNY sculpture decor for commercial spaces",
              "Christmas trees and CNY sculpture decor for commercial spaces",
            )}
          </h2>
        </div>
        <div className="holiday-promo-actions">
          <a className="holiday-promo-button holiday-promo-button-primary" href="/holiday-decorations-singapore/">
            <Gift className="h-4 w-4" />
            <span>{t("View Christmas & CNY decor", "View Christmas & CNY decor")}</span>
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            className="holiday-promo-button holiday-promo-button-secondary"
            href={FESTIVE_INQUIRY_MAILTO}
          >
            <Mail className="h-4 w-4" />
            <span>{t("Email festive brief", "Email festive brief")}</span>
          </a>
        </div>
        <div className="holiday-promo-media" aria-hidden="true">
          {previewImages.map((image) => (
            <img key={image.src} src={image.src} alt={image.alt} width="132" height="40" loading="eager" decoding="async" />
          ))}
        </div>
      </div>
    </section>
  );
}
