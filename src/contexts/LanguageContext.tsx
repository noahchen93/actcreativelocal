import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Language = "zh" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (zh: string, en: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const META_COPY = {
  en: {
    title: "ACT Creative Singapore | Event Solutions & Fabrication",
    description:
      "Singapore event solutions partner for fabrication, booth design and build, venue sourcing, supplier coordination, cross-border logistics, permits and installation.",
  },
  zh: {
    title: "及物创意 ACT Creative | 新加坡跨境活动制作与中国生产支持伙伴",
    description:
      "及物创意（ACT Creative）为活动公司与品牌团队提供定制制作、道具、展览组件、FRP 雕塑和活动周边跨境生产支持，覆盖新加坡、东南亚与中国供应链。",
  },
};

function isLanguage(value: string | null): value is Language {
  return value === "zh" || value === "en";
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const urlLanguage = new URLSearchParams(window.location.search).get("lang");
  if (isLanguage(urlLanguage)) {
    return urlLanguage;
  }

  if (window.location.pathname === "/zh" || window.location.pathname.startsWith("/zh/")) {
    return "zh";
  }

  return "en";
}

export function LanguageProvider({
  children,
  manageDocumentMetadata = true,
}: {
  children: ReactNode;
  manageDocumentMetadata?: boolean;
}) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    if (!manageDocumentMetadata) return;

    const meta = META_COPY[language];
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    document.documentElement.lang = language === "zh" ? "zh-Hans-SG" : "en-SG";
    document.title = meta.title;
    description?.setAttribute("content", meta.description);
  }, [language, manageDocumentMetadata]);

  const t = (zh: string, en: string) => {
    return language === "zh" ? zh : en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
