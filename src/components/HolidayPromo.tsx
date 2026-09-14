import { useLanguage } from "../contexts/LanguageContext";

export function HolidayPromo() {
  const { t } = useLanguage();
  return <aside style={{background:'#151810',borderBottom:'1px solid #303626',textAlign:'center',padding:'9px 16px',fontSize:'13px',lineHeight:'22px'}}>
    <a href="/holiday-decorations-singapore/" style={{color:'#d8dfc3',textDecoration:'none'}}>{t("圣诞与新年商业空间装饰", "Christmas & CNY decor for commercial spaces")} <span style={{color:'#ccff00'}}>→</span></a>
  </aside>;
}
