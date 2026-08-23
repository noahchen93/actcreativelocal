import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HolidayPromo } from "./components/HolidayPromo";
import { LanguageProvider } from "./contexts/LanguageContext";

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

function DeferredSection({
  children,
  minHeight,
  targetId,
}: {
  children: ReactNode;
  minHeight: string;
  targetId?: string;
}) {
  const markerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(() => {
    if (!targetId || typeof window === "undefined") return false;
    return decodeURIComponent(window.location.hash.slice(1)) === targetId;
  });

  useEffect(() => {
    if (shouldRender) return;
    const marker = markerRef.current;
    if (!marker || !("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={markerRef} style={{ minHeight }}>
      {shouldRender ? children : null}
    </div>
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
      <style>{`
        .site-shell {
          --holiday-promo-height: 72px;
          --site-header-height: 86px;
        }
        .site-main {
          padding-top: calc(var(--holiday-promo-height) + var(--site-header-height));
        }
        .site-main > section,
        .site-main > div > section {
          scroll-margin-top: calc(var(--holiday-promo-height) + var(--site-header-height) + 1rem);
        }
        @media (min-width: 768px) {
          .site-shell {
            --holiday-promo-height: 58px;
          }
        }
      `}</style>
      <div className="site-shell min-h-screen bg-black">
        <HolidayPromo />
        <Header />
        <main className="site-main">
          <Hero />
          <DeferredSection minHeight="48rem" targetId="cases">
            <Suspense fallback={<SectionFallback minHeight="48rem" />}>
              <CaseStudies />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight="48rem" targetId="products">
            <Suspense fallback={<SectionFallback minHeight="48rem" />}>
              <ProductCategories />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight="48rem" targetId="services">
            <Suspense fallback={<SectionFallback minHeight="48rem" />}>
              <Services />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight="40rem" targetId="contact">
            <Suspense fallback={<SectionFallback minHeight="40rem" />}>
              <Contact />
              <Toaster />
            </Suspense>
          </DeferredSection>
        </main>
        <DeferredSection minHeight="12rem">
          <Suspense fallback={<SectionFallback minHeight="12rem" />}>
            <Footer />
          </Suspense>
        </DeferredSection>
        <HashScrollRestorer />
      </div>
    </LanguageProvider>
  );
}
