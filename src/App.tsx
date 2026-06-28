import { lazy, Suspense, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HolidayPromo } from "./components/HolidayPromo";
import { LanguageProvider } from "./contexts/LanguageContext";

const EventAiAssistant = lazy(() =>
  import("./components/EventAiAssistant").then((module) => ({
    default: module.EventAiAssistant,
  })),
);
const CaseStudies = lazy(() =>
  import("./components/CaseStudies").then((module) => ({
    default: module.CaseStudies,
  })),
);
const ProductCategories = lazy(() =>
  import("./components/ProductCategories").then((module) => ({
    default: module.ProductCategories,
  })),
);
const Services = lazy(() =>
  import("./components/Services").then((module) => ({
    default: module.Services,
  })),
);
const Contact = lazy(() =>
  import("./components/Contact").then((module) => ({
    default: module.Contact,
  })),
);
const Footer = lazy(() =>
  import("./components/Footer").then((module) => ({
    default: module.Footer,
  })),
);
const Toaster = lazy(() =>
  import("./components/ui/sonner").then((module) => ({
    default: module.Toaster,
  })),
);

function SectionFallback({ minHeight = "18rem" }: { minHeight?: string }) {
  return (
    <div
      aria-hidden="true"
      className="bg-[#0a0a0a]"
      style={{ minHeight }}
    />
  );
}

function HashScrollRestorer() {
  useEffect(() => {
    if (!window.location.hash) return;

    const targetId = decodeURIComponent(window.location.hash.slice(1));
    let frameId = 0;
    let attempts = 0;

    const scrollWhenReady = () => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }

      attempts += 1;
      if (attempts < 120) {
        frameId = window.requestAnimationFrame(scrollWhenReady);
      }
    };

    frameId = window.requestAnimationFrame(scrollWhenReady);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <main>
          <HolidayPromo />
          <Hero />
          <Suspense fallback={<SectionFallback minHeight="48rem" />}>
            <CaseStudies />
          </Suspense>
          <Suspense fallback={<SectionFallback minHeight="48rem" />}>
            <ProductCategories />
          </Suspense>
          <Suspense fallback={<SectionFallback minHeight="48rem" />}>
            <Services />
          </Suspense>
          <Suspense fallback={<SectionFallback minHeight="40rem" />}>
            <Contact />
          </Suspense>
        </main>
        <Suspense fallback={<SectionFallback minHeight="12rem" />}>
          <Footer />
        </Suspense>
        <Suspense fallback={null}>
          <Toaster />
        </Suspense>
        <HashScrollRestorer />
        <Suspense fallback={null}>
          <EventAiAssistant />
        </Suspense>
        <Analytics />
      </div>
    </LanguageProvider>
  );
}
