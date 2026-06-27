import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONVERSATION_DIR = path.join(ROOT, "local-ai", "conversations");
const PRIVATE_INSIGHTS_DIR = path.join(ROOT, "local-ai", "insights");
const PUBLIC_INSIGHTS_DIR = path.join(ROOT, "public", "ai-insights");
const PRIVATE_INSIGHTS_PATH = path.join(
  PRIVATE_INSIGHTS_DIR,
  "conversation-insights.json",
);
const PUBLIC_TOP_QUESTIONS_PATH = path.join(PUBLIC_INSIGHTS_DIR, "top-questions.json");

const DEFAULT_MIN_TOPIC_COUNT = 3;
const MAX_PUBLIC_QUESTIONS = 4;
const MAX_PRIVATE_SAMPLES = 5;

const options = parseOptions(process.argv.slice(2));
const envMinTopicCount = Number.parseInt(
  process.env.AI_INSIGHTS_MIN_TOPIC_COUNT || "",
  10,
);
const minTopicCount =
  options.minTopicCount ??
  (Number.isFinite(envMinTopicCount) && envMinTopicCount > 0
    ? envMinTopicCount
    : DEFAULT_MIN_TOPIC_COUNT);

const DEFAULT_QUESTIONS = [
  {
    id: "services",
    question: {
      zh: "ACT Creative 主要提供哪些服务？",
      en: "What services does ACT Creative provide?",
    },
  },
  {
    id: "cases_sentosa",
    question: {
      zh: "介绍一下你们在圣淘沙做过的项目案例。",
      en: "Tell me about your Sentosa project cases.",
    },
  },
  {
    id: "venue_planning",
    question: {
      zh: "如何选择适合 200 人企业活动的场地？",
      en: "How should I choose a venue for a 200-person corporate event?",
    },
  },
];

const TOPIC_DEFINITIONS = [
  {
    id: "cases_sentosa",
    names: { zh: "圣淘沙项目案例", en: "Sentosa project cases" },
    question: {
      zh: "介绍一下你们在圣淘沙做过的项目案例。",
      en: "Tell me about your Sentosa project cases.",
    },
    keywords: [
      "sentosa",
      "圣淘沙",
      "pacman",
      "big big world",
      "project case",
      "cases",
      "case study",
      "案例",
      "项目案例",
    ],
  },
  {
    id: "services",
    names: { zh: "公司服务范围", en: "Service scope" },
    question: {
      zh: "ACT Creative 主要提供哪些服务？",
      en: "What services does ACT Creative provide?",
    },
    keywords: [
      "service",
      "services",
      "what does",
      "what do you do",
      "provide",
      "提供",
      "服务",
      "业务",
      "做什么",
    ],
  },
  {
    id: "custom_fabrication",
    names: { zh: "定制道具与玻璃钢制作", en: "Custom fabrication and fiberglass" },
    question: {
      zh: "你们可以定制玻璃钢道具、模型或活动装置吗？",
      en: "Can you fabricate custom fiberglass props, replicas or event installations?",
    },
    keywords: [
      "fabrication",
      "fiberglass",
      "fibre glass",
      "frp",
      "replica",
      "props",
      "uav",
      "drone",
      "定制",
      "玻璃钢",
      "道具",
      "模型",
      "雕塑",
      "装置",
    ],
  },
  {
    id: "venue_planning",
    names: { zh: "新加坡活动场地", en: "Singapore venue planning" },
    question: {
      zh: "如何选择适合 200 人企业活动的场地？",
      en: "How should I choose a venue for a 200-person corporate event?",
    },
    keywords: [
      "venue",
      "venues",
      "200-person",
      "200 person",
      "corporate event",
      "场地",
      "会场",
      "企业活动",
      "200 人",
      "200人",
    ],
  },
  {
    id: "china_sourcing",
    names: { zh: "中国采购与供应链", en: "China sourcing and suppliers" },
    question: {
      zh: "你们如何协助中国采购、打样和供应商跟进？",
      en: "How can ACT Creative help with China sourcing, samples and supplier follow-up?",
    },
    keywords: [
      "china sourcing",
      "supplier",
      "suppliers",
      "procurement",
      "sample",
      "factory",
      "中国采购",
      "供应商",
      "打样",
      "工厂",
      "采购",
    ],
  },
  {
    id: "logistics",
    names: { zh: "跨境物流协调", en: "Cross-border logistics" },
    question: {
      zh: "你们能协调从中国到新加坡或东南亚的活动物流吗？",
      en: "Can you coordinate event logistics from China to Singapore or Southeast Asia?",
    },
    keywords: [
      "logistics",
      "shipping",
      "freight",
      "delivery",
      "southeast asia",
      "物流",
      "运输",
      "海运",
      "空运",
      "东南亚",
    ],
  },
  {
    id: "booth_exhibition",
    names: { zh: "展位与展览制作", en: "Booth and exhibition production" },
    question: {
      zh: "你们可以做新加坡展位设计、制作和搭建吗？",
      en: "Can you support booth design, production and build in Singapore?",
    },
    keywords: [
      "booth",
      "exhibition",
      "trade show",
      "stand",
      "展位",
      "展台",
      "展览",
      "搭建",
    ],
  },
  {
    id: "merchandise",
    names: { zh: "活动周边与礼品", en: "Event merchandise" },
    question: {
      zh: "你们可以协助活动周边、礼品或品牌物料定制吗？",
      en: "Can you help source custom event merchandise, gifts or branded materials?",
    },
    keywords: [
      "merchandise",
      "gift",
      "branded material",
      "premium",
      "周边",
      "礼品",
      "纪念品",
      "品牌物料",
    ],
  },
  {
    id: "greeting",
    names: { zh: "初次问候", en: "Opening greetings" },
    question: {
      zh: "我可以问 ACT AI 哪些活动制作问题？",
      en: "What event production questions can I ask ACT AI?",
    },
    keywords: ["hi", "hello", "hey", "你好", "您好"],
  },
];

function parseOptions(args) {
  const parsed = {
    includeTests: false,
    minTopicCount: undefined,
  };

  for (const arg of args) {
    if (arg === "--include-tests") {
      parsed.includeTests = true;
      continue;
    }

    const minTopicMatch = arg.match(/^--min-topic-count=(\d+)$/);
    if (minTopicMatch) {
      parsed.minTopicCount = Number.parseInt(minTopicMatch[1], 10);
    }
  }

  return parsed;
}

function normalizeWhitespace(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function normalizeForMatching(value) {
  return normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[?!.,;:()[\]{}"'“”‘’。？！、，；：（）【】]/g, " ");
}

function classifyRecord(record) {
  const sessionId = String(record.sessionId || "");
  const pageUrl = String(record.pageUrl || "");
  const normalizedUrl = pageUrl.toLowerCase();

  if (
    normalizedUrl.startsWith("http://127.0.0.1") ||
    normalizedUrl.startsWith("http://localhost") ||
    normalizedUrl.startsWith("https://127.0.0.1") ||
    normalizedUrl.startsWith("https://localhost")
  ) {
    return { included: false, reason: "local-page" };
  }

  if (/^(rag-|productiontest)/i.test(sessionId)) {
    return { included: false, reason: "test-session" };
  }

  if (!normalizeWhitespace(record.userMessage)) {
    return { included: false, reason: "empty-question" };
  }

  return { included: true, reason: "included" };
}

function detectTopic(question, pageUrl = "") {
  const haystack = `${normalizeForMatching(question)} ${normalizeForMatching(pageUrl)}`;
  let bestTopic = null;
  let bestScore = 0;

  for (const topic of TOPIC_DEFINITIONS) {
    const score = topic.keywords.reduce(
      (total, keyword) => total + (haystack.includes(keyword.toLowerCase()) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      bestTopic = topic;
      bestScore = score;
    }
  }

  return bestTopic || {
    id: "other",
    names: { zh: "其他问题", en: "Other questions" },
    question: {
      zh: "我可以怎样开始准备一个新加坡活动项目？",
      en: "How should I start planning an event project in Singapore?",
    },
    keywords: [],
  };
}

async function readConversationRecords() {
  const entries = await fs.readdir(CONVERSATION_DIR, { withFileTypes: true }).catch((error) => {
    if (error.code === "ENOENT") return [];
    throw error;
  });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ndjson"))
    .map((entry) => entry.name)
    .sort();
  const records = [];
  const parseErrors = [];

  for (const file of files) {
    const filePath = path.join(CONVERSATION_DIR, file);
    const text = await fs.readFile(filePath, "utf8");
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (!line.trim()) return;

      try {
        records.push({
          ...JSON.parse(line),
          _file: file,
          _line: index + 1,
        });
      } catch (error) {
        parseErrors.push({
          file,
          line: index + 1,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });
  }

  return { files, records, parseErrors };
}

function createEmptyTopic(topic) {
  return {
    id: topic.id,
    names: topic.names,
    question: topic.question,
    count: 0,
    sessions: new Set(),
    pages: new Map(),
    languages: new Map(),
    samples: [],
    firstSeenAt: "",
    lastSeenAt: "",
  };
}

function incrementMap(map, key) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + 1);
}

function toRankedEntries(map, limit = 8) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([value, count]) => ({ value, count }));
}

function getIso(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function buildInsights(files, records, parseErrors) {
  const topics = new Map();
  const pages = new Map();
  const languages = new Map();
  const exclusionReasons = new Map();
  const includedRecords = [];

  for (const record of records) {
    const classification = options.includeTests
      ? { included: true, reason: "included-by-flag" }
      : classifyRecord(record);

    if (!classification.included) {
      incrementMap(exclusionReasons, classification.reason);
      continue;
    }

    const userMessage = normalizeWhitespace(record.userMessage);
    const pageUrl = normalizeWhitespace(record.pageUrl);
    const language = record.language === "zh" ? "zh" : "en";
    const topicDefinition = detectTopic(userMessage, pageUrl);
    const startedAt = getIso(record.startedAt);

    if (!topics.has(topicDefinition.id)) {
      topics.set(topicDefinition.id, createEmptyTopic(topicDefinition));
    }

    const topic = topics.get(topicDefinition.id);
    topic.count += 1;
    topic.sessions.add(String(record.sessionId || ""));
    incrementMap(topic.pages, pageUrl);
    incrementMap(topic.languages, language);
    if (topic.samples.length < MAX_PRIVATE_SAMPLES) topic.samples.push(userMessage);
    if (startedAt && (!topic.firstSeenAt || startedAt < topic.firstSeenAt)) {
      topic.firstSeenAt = startedAt;
    }
    if (startedAt && (!topic.lastSeenAt || startedAt > topic.lastSeenAt)) {
      topic.lastSeenAt = startedAt;
    }

    incrementMap(pages, pageUrl);
    incrementMap(languages, language);
    includedRecords.push(record);
  }

  const rankedTopics = Array.from(topics.values())
    .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id))
    .map((topic, index) => ({
      rank: index + 1,
      id: topic.id,
      names: topic.names,
      question: topic.question,
      count: topic.count,
      uniqueSessions: topic.sessions.size,
      languages: toRankedEntries(topic.languages),
      pages: toRankedEntries(topic.pages),
      sampleQuestions: topic.samples,
      firstSeenAt: topic.firstSeenAt || null,
      lastSeenAt: topic.lastSeenAt || null,
    }));

  return {
    privateInsights: {
      version: 1,
      generatedAt: new Date().toISOString(),
      filters: {
        includeTests: options.includeTests,
        minTopicCount,
        excludedLocalPages: !options.includeTests,
        excludedTestSessions: !options.includeTests,
      },
      source: {
        conversationDir: path.relative(ROOT, CONVERSATION_DIR).replace(/\\/g, "/"),
        files,
        totalRecords: records.length,
        includedRecords: includedRecords.length,
        excludedRecords: records.length - includedRecords.length,
        exclusionReasons: toRankedEntries(exclusionReasons),
        parseErrors,
      },
      summary: {
        uniqueSessions: new Set(includedRecords.map((record) => record.sessionId)).size,
        languages: toRankedEntries(languages),
        pages: toRankedEntries(pages),
      },
      topics: rankedTopics,
    },
    publicTopQuestions: {
      version: 1,
      generatedAt: new Date().toISOString(),
      minTopicCount,
      source: {
        totalRecords: records.length,
        includedRecords: includedRecords.length,
        excludedRecords: records.length - includedRecords.length,
      },
      questions: rankedTopics
        .filter((topic) => topic.count >= minTopicCount)
        .slice(0, MAX_PUBLIC_QUESTIONS)
        .map((topic, index) => ({
          rank: index + 1,
          id: topic.id,
          count: topic.count,
          uniqueSessions: topic.uniqueSessions,
          names: topic.names,
          question: topic.question,
        })),
      fallbackQuestions: DEFAULT_QUESTIONS,
    },
  };
}

async function writeJson(filePath, payload) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function main() {
  const { files, records, parseErrors } = await readConversationRecords();
  const { privateInsights, publicTopQuestions } = buildInsights(
    files,
    records,
    parseErrors,
  );

  await Promise.all([
    writeJson(PRIVATE_INSIGHTS_PATH, privateInsights),
    writeJson(PUBLIC_TOP_QUESTIONS_PATH, publicTopQuestions),
  ]);

  console.log(
    [
      `Analyzed ${privateInsights.source.includedRecords}/${privateInsights.source.totalRecords} conversation records.`,
      `Private insights: ${path.relative(ROOT, PRIVATE_INSIGHTS_PATH)}`,
      `Public top questions: ${path.relative(ROOT, PUBLIC_TOP_QUESTIONS_PATH)}`,
      `Public questions above threshold: ${publicTopQuestions.questions.length}`,
    ].join("\n"),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
