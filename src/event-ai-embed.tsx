import { createRoot } from "react-dom/client";
import { EventAiAssistant } from "./components/EventAiAssistant";
import { LanguageProvider } from "./contexts/LanguageContext";

const ROOT_ATTRIBUTE = "data-act-event-ai-root";

if (
  !document.querySelector(`[${ROOT_ATTRIBUTE}]`) &&
  !document.querySelector(".event-ai-shell")
) {
  const container = document.createElement("div");
  container.setAttribute(ROOT_ATTRIBUTE, "");
  document.body.appendChild(container);

  createRoot(container).render(
    <LanguageProvider manageDocumentMetadata={false}>
      <EventAiAssistant />
    </LanguageProvider>,
  );
}
