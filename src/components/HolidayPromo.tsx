import { useLanguage } from "../contexts/LanguageContext";

export function HolidayPromo() {
  const { t } = useLanguage();
  return <aside className="holiday-promo">
    <a href="/holiday-decorations-singapore/">{t("圣诞与新年商业空间装饰", "Christmas & CNY decor for commercial spaces")} <span>→</span></a>
  </aside>;
}
