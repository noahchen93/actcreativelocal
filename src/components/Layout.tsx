import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { Toaster } from "./ui/sonner";
import { trackPageView } from "../lib/analytics";

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackPageView(location.pathname, document.title);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      <main className="flex-1" style={{ paddingTop: "5rem" }}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toaster />
    </div>
  );
}
