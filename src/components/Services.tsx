import { useLanguage } from "../contexts/LanguageContext";

const steps = [
  ['确认需求','Define the brief','尺寸、数量、预算、场地与时间线。','Dimensions, quantities, budget, venue and timeline.'],
  ['确认制作方案','Agree the build route','比较材料、供应商与交付范围。','Compare materials, specialist suppliers and delivery scope.'],
  ['制作与检查','Produce and check','确认样品、制作进度、表面处理与包装。','Review samples, production progress, finishes and packing.'],
  ['运输与交付','Deliver for the project','按确认范围协调运输、新加坡安装与交接。','Coordinate freight, Singapore installation and handover to the agreed scope.'],
];
export function Services() {
  const { t } = useLanguage();
  return <section id="process" className="solution-routes">
    <h2>{t("一位项目联系人，统筹制作与交付", "One project contact, from brief to delivery")}</h2>
    <p>{t("我们整合合适的专业合作伙伴，按确认的项目范围推进。", "We coordinate the specialist partners your project needs, with responsibilities agreed before production.")}</p>
    <div className="solution-grid">{steps.map(([zh,en,zhDetail,enDetail],index)=><div className="solution-card" key={en}><span>0{index+1}</span><h3>{t(zh,en)}</h3><p>{t(zhDetail,enDetail)}</p></div>)}</div>
  </section>;
}
