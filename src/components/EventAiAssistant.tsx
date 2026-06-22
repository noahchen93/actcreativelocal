import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Bot,
  ExternalLink,
  MessageCircle,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import "./EventAiAssistant.css";

type ChatRole = "user" | "assistant";

type RagSource = {
  title: string;
  url: string;
  category: string;
  sourceType: string;
  score: number;
};

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  sources?: RagSource[];
};

type ServiceStatus = "checking" | "warming" | "ready" | "offline";

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const SESSION_STORAGE_KEY = "act-event-ai-session-v1";

function getSessionId() {
  if (typeof window === "undefined") return createId();

  const existing = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (existing) return existing;

  const sessionId =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : createId();
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  return sessionId;
}

function parseRagSources(value: string | null): RagSource[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function EventAiAssistant() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>("checking");
  const [ragReady, setRagReady] = useState(false);
  const [sessionId] = useState(getSessionId);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const greeting = t(
    "你好，我是 ACT Creative 活动 AI 助理。你可以问我公司服务、项目案例、新加坡活动策划、场地、搭建或制作方面的问题。",
    "Hello, I am the ACT Creative Event AI Assistant. Ask me about our services, project cases, Singapore event planning, venues, fabrication or production.",
  );

  const suggestions =
    language === "zh"
      ? [
          "ACT Creative 主要提供哪些服务？",
          "介绍一下你们在圣淘沙做过的项目案例。",
          "如何选择适合 200 人企业活动的场地？",
        ]
      : [
          "What services does ACT Creative provide?",
          "Tell me about your Sentosa project cases.",
          "How should I choose a venue for a 200-person corporate event?",
        ];

  const isEnabled =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_EVENT_AI === "true";

  useEffect(() => {
    if (!isEnabled) return;

    let isActive = true;
    const checkHealth = async () => {
      try {
        const response = await fetch("/api/chat/health", { cache: "no-store" });
        const payload = await response.json();
        if (!isActive) return;

        setServiceStatus(
          payload.status === "ready"
            ? "ready"
            : payload.status === "warming"
              ? "warming"
              : "offline",
        );
        setRagReady(Boolean(payload.rag?.ready));
      } catch {
        if (isActive) {
          setServiceStatus("offline");
          setRagReady(false);
        }
      }
    };

    void checkHealth();
    const intervalId = window.setInterval(checkHealth, 10_000);
    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [isEnabled]);

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading || serviceStatus !== "ready") return;

    const userMessage: ChatMessage = { id: createId(), role: "user", content: trimmed };
    const assistantId = createId();
    const conversation = [...messages, userMessage];

    setMessages([
      ...conversation,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setError("");
    setIsLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          pageUrl: window.location.href,
          language,
          messages: conversation.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || `Request failed with status ${response.status}`);
      }

      const sources = parseRagSources(response.headers.get("X-Act-Rag-Sources"));
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        assistantContent += decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? { ...message, content: assistantContent, sources }
              : message,
          ),
        );
      }

      assistantContent += decoder.decode();
      if (!assistantContent.trim()) {
        throw new Error("The model returned an empty response.");
      }
    } catch (requestError) {
      if (requestError instanceof Error && requestError.name === "AbortError") return;

      setMessages((current) => current.filter((message) => message.id !== assistantId));
      setError(
        t(
          "暂时无法连接本地 Qwen 3.6。请确认 Ollama 和本地 AI 网关正在运行。",
          "Unable to reach local Qwen 3.6. Check that Ollama and the local AI gateway are running.",
        ),
      );
    } finally {
      abortRef.current = null;
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  if (!isEnabled) return null;

  const statusLabel =
    serviceStatus === "ready"
      ? ragReady
        ? t("Qwen 3.6 · 网站知识库已连接", "Qwen 3.6 · Website knowledge connected")
        : t("Qwen 3.6 已就绪", "Qwen 3.6 ready")
      : serviceStatus === "warming"
        ? t("Qwen 3.6 正在预热", "Warming up Qwen 3.6")
        : serviceStatus === "offline"
          ? t("本地 AI 未连接", "Local AI offline")
          : t("正在检查本地 AI", "Checking local AI");

  if (!isOpen) {
    return (
      <div className="event-ai-shell">
        <button
          type="button"
          className="event-ai-launcher"
          aria-label={t("打开 ACT 活动 AI 助理", "Open ACT Event AI Assistant")}
          title={t("问问 ACT AI", "Ask ACT AI")}
          onClick={() => setIsOpen(true)}
        >
          <span className="event-ai-launcher-icon" aria-hidden="true">
            <MessageCircle size={22} strokeWidth={2.1} />
          </span>
          <span className="event-ai-launcher-copy">
            <strong>{t("问问 ACT AI", "Ask ACT AI")}</strong>
            <small>{t("活动问题与公司案例", "Event help & project cases")}</small>
          </span>
          <span
            className="event-ai-launcher-badge"
            data-state={serviceStatus}
            aria-hidden="true"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="event-ai-shell">
      <section
        className="event-ai-panel"
        role="dialog"
        aria-modal="false"
        aria-label={t("ACT Creative 活动 AI 助理", "ACT Creative Event AI Assistant")}
      >
        <header className="event-ai-header">
          <div className="event-ai-identity">
            <span className="event-ai-mark" aria-hidden="true">
              <Bot size={21} />
            </span>
            <div>
              <div className="event-ai-title">
                {t("ACT 活动 AI 助理", "ACT Event AI Assistant")}
              </div>
              <div className="event-ai-status">
                <span
                  className="event-ai-status-dot"
                  data-state={serviceStatus}
                  aria-hidden="true"
                />
                {statusLabel}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="event-ai-icon-button"
            aria-label={t("关闭聊天", "Close chat")}
            title={t("关闭", "Close")}
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </header>

        <div className="event-ai-messages" aria-live="polite">
          <div className="event-ai-message-row" data-role="assistant">
            <div className="event-ai-message">{greeting}</div>
          </div>
          <p className="event-ai-disclaimer">
            {t(
              "网站知识库用于公司与案例问答；对话会保存在本地用于改进服务，请勿输入敏感资料。法规与档期仍需人工核实。",
              "Website knowledge supports company and case questions. Chats are saved locally to improve the service, so do not enter sensitive information. Regulations and availability still require human verification.",
            )}
          </p>

          {messages.length === 0 ? (
            <div className="event-ai-suggestions">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="event-ai-suggestion"
                  disabled={isLoading || serviceStatus !== "ready"}
                  onClick={() => void sendMessage(suggestion)}
                >
                  <Sparkles size={14} aria-hidden="true" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          ) : null}

          {messages.map((message) => (
            <div
              key={message.id}
              className="event-ai-message-row"
              data-role={message.role}
            >
              <div className="event-ai-message-stack">
                <div className="event-ai-message">
                  {message.content ||
                    (message.role === "assistant" && isLoading ? (
                      <span className="event-ai-loading" aria-label={t("正在思考", "Thinking")}>
                        <span />
                        <span />
                        <span />
                      </span>
                    ) : null)}
                </div>
                {message.role === "assistant" && message.sources?.length ? (
                  <div className="event-ai-sources">
                    <div className="event-ai-sources-title">
                      <BookOpen size={13} aria-hidden="true" />
                      {t("参考网站内容", "Website references")}
                    </div>
                    {message.sources.map((source) =>
                      source.url ? (
                        <a
                          key={`${source.url}-${source.title}`}
                          className="event-ai-source-link"
                          href={source.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span>{source.title}</span>
                          <ExternalLink size={12} aria-hidden="true" />
                        </a>
                      ) : (
                        <span
                          key={`${source.sourceType}-${source.title}`}
                          className="event-ai-source-link"
                        >
                          <span>{source.title}</span>
                        </span>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="event-ai-composer" onSubmit={handleSubmit}>
          <div className="event-ai-input-wrap">
            <textarea
              ref={inputRef}
              className="event-ai-input"
              rows={1}
              maxLength={4_000}
              value={input}
              disabled={isLoading || serviceStatus !== "ready"}
              aria-label={t("输入活动问题", "Enter an event question")}
              placeholder={t("询问服务、案例或活动问题...", "Ask about services, cases or your event...")}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
            />
            <button
              type="submit"
              className="event-ai-send"
              disabled={!input.trim() || isLoading || serviceStatus !== "ready"}
              aria-label={t("发送问题", "Send question")}
              title={t("发送", "Send")}
            >
              <Send size={18} />
            </button>
          </div>
          {error ? <div className="event-ai-error" role="alert">{error}</div> : null}
          {serviceStatus === "warming" ? (
            <div className="event-ai-composer-note">
              {t(
                "36B 模型首次加载约需 3 分钟，完成后即可开始测试。",
                "The 36B model can take about 3 minutes to load the first time.",
              )}
            </div>
          ) : null}
          <div className="event-ai-composer-note">
            {t("Enter 发送，Shift + Enter 换行", "Enter to send, Shift + Enter for a new line")}
          </div>
        </form>
      </section>
    </div>
  );
}
