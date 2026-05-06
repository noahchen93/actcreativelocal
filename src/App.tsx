import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { ServicesHubPage } from "./pages/ServicesHubPage";
import { EventFabricationSingapore } from "./pages/services/EventFabricationSingapore";
import { ChinaProductionSupport } from "./pages/services/ChinaProductionSupport";
import { FRPSculpture } from "./pages/services/FRPSculpture";
import { CustomPropsDisplay } from "./pages/services/CustomPropsDisplay";
import { EventMerchandise } from "./pages/services/EventMerchandise";
import { ExhibitionBooth } from "./pages/services/ExhibitionBooth";
import { BrandActivation } from "./pages/services/BrandActivation";
import { ProjectsPage } from "./pages/ProjectsPage";
import { InsightsPage } from "./pages/InsightsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { RequestQuotePage } from "./pages/RequestQuotePage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesHubPage />} />
        <Route
          path="services/event-fabrication-singapore"
          element={<EventFabricationSingapore />}
        />
        <Route
          path="services/china-production-support-for-event-agencies"
          element={<ChinaProductionSupport />}
        />
        <Route
          path="services/custom-props-display-fabrication"
          element={<CustomPropsDisplay />}
        />
        <Route
          path="services/frp-sculpture-installation-fabrication"
          element={<FRPSculpture />}
        />
        <Route
          path="services/event-merchandise-sourcing-from-china"
          element={<EventMerchandise />}
        />
        <Route
          path="services/exhibition-booth-production-support"
          element={<ExhibitionBooth />}
        />
        <Route
          path="services/brand-activation-production-partner-singapore"
          element={<BrandActivation />}
        />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="request-a-quote" element={<RequestQuotePage />} />
        <Route path="privacy-policy" element={<PrivacyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
