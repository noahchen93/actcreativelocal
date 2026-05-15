import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Services } from "./components/Services";
import { ProductCategories } from "./components/ProductCategories";
import { CaseStudies } from "./components/CaseStudies";
import { TeamSection } from "./components/TeamSection";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { LanguageProvider } from "./contexts/LanguageContext";

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-black">
        <Header />
        <main>
          <Hero />
          <CaseStudies />
          <ProductCategories />
          <Services />
          <TeamSection />
          <Contact />
        </main>
        <Footer />
        <Toaster />
      </div>
    </LanguageProvider>
  );
}
