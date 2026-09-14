import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { HolidayPromo } from "./components/HolidayPromo";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ServiceRoutes } from "./components/ServiceRoutes";

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
    const onHashChange = () => {
      if (window.location.hash.slice(1) === targetId) setShouldRender(true);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [targetId]);

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
    <div ref={markerRef} id={targetId ? `section-${targetId}` : undefined} style={{ minHeight }}>
      {shouldRender ? children : null}
    </div>
  );
}

function HashScrollRestorer() {
  useEffect(() => {
    let frameId = 0;
    let layoutObserver: ResizeObserver | undefined;
    let settleTimer: number | undefined;
    const stopRestoring = () => {
      window.cancelAnimationFrame(frameId);
      layoutObserver?.disconnect();
      window.clearTimeout(settleTimer);
    };
    const restore = () => {
      stopRestoring();
      let targetId: string;
      try { targetId = decodeURIComponent(window.location.hash.slice(1)); }
      catch { return; }
      if (!targetId) return;
      const alignTarget = () => document.getElementById(targetId)?.scrollIntoView({ behavior: "auto", block: "start" });
      const main = document.querySelector("main");
      if (main && "ResizeObserver" in window) {
        layoutObserver = new ResizeObserver(alignTarget);
        layoutObserver.observe(main);
        settleTimer = window.setTimeout(stopRestoring, 5000);
      }
      let attempts = 0;
      const scrollWhenReady = () => {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: "auto", block: "start" });
          return;
        }
        if (++attempts < 300) frameId = window.requestAnimationFrame(scrollWhenReady);
      };
      frameId = window.requestAnimationFrame(scrollWhenReady);
    };
    restore();
    window.addEventListener("hashchange", restore);
    window.addEventListener("wheel", stopRestoring, { passive: true });
    window.addEventListener("touchstart", stopRestoring, { passive: true });
    window.addEventListener("keydown", stopRestoring);
    return () => {
      stopRestoring();
      window.removeEventListener("hashchange", restore);
      window.removeEventListener("wheel", stopRestoring);
      window.removeEventListener("touchstart", stopRestoring);
      window.removeEventListener("keydown", stopRestoring);
    };
  }, []);

  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <style>{`
        .site-shell {
          --holiday-promo-height: 40px;
          --site-header-height: 72px;
        }
        .site-main {
          padding-top: 0;
        }
        .site-main > section,
        .site-main > div > section {
          scroll-margin-top: calc(var(--site-header-height) + 1rem);
        }
        @media (min-width: 768px) {
          .site-shell {
            --holiday-promo-height: 40px;
          }
        }
      `}</style>
      <div className="site-shell min-h-screen bg-black">
        <HolidayPromo />
        <Header />
        <main className="site-main">
          <Hero />
          <ServiceRoutes />
          <DeferredSection minHeight="48rem" targetId="cases">
            <Suspense fallback={<SectionFallback minHeight="48rem" />}>
              <CaseStudies />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight="22rem" targetId="process">
            <Suspense fallback={<SectionFallback minHeight="22rem" />}>
              <Services />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight="40rem" targetId="contact">
            <Suspense fallback={<SectionFallback minHeight="40rem" />}>
              <Contact />
              <Toaster />
            </Suspense>
          </DeferredSection>
          <DeferredSection minHeight="24rem" targetId="products">
            <Suspense fallback={<SectionFallback minHeight="24rem" />}>
              <ProductCategories />
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
