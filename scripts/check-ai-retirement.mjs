import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const includeBuild = process.argv.includes("--build");
const failures = [];

const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

const mustNotExist = [
  "src/components/EventAiAssistant.tsx",
  "src/components/EventAiAssistant.css",
  "src/event-ai-embed.tsx",
];

for (const relativePath of mustNotExist) {
  if (fs.existsSync(path.join(root, relativePath))) {
    failures.push(`${relativePath} must remain deleted`);
  }
}

const sourceChecks = [
  {
    file: "src/App.tsx",
    forbidden: ["EventAiAssistant", "event-ai-embed", "/api/chat"],
  },
  {
    file: "vite.config.ts",
    forbidden: ["eventAiEmbed", "event-ai-root", "AI_GATEWAY", "/api/chat"],
  },
  {
    file: "package.json",
    forbidden: [
      '"dev:ai"',
      '"start:ai"',
      '"ai:prod:start"',
      '"ai:prod:install"',
      '"ai:prod:tunnel"',
      '"ai:prod:watch"',
      '"ollama:create"',
      '"ollama:embedding"',
      '"rag:index"',
    ],
  },
];

for (const check of sourceChecks) {
  const content = read(check.file);
  for (const marker of check.forbidden) {
    if (content.includes(marker)) {
      failures.push(`${check.file} contains retired assistant marker: ${marker}`);
    }
  }
}

const apiSource = read("api/chat.ts");
if (!apiSource.includes("status: 410") || !apiSource.includes('status: "retired"')) {
  failures.push("api/chat.ts must remain a 410 retired endpoint");
}

function listFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

if (includeBuild) {
  const buildRoot = path.join(root, "build");
  const generatedFiles = listFiles(buildRoot).filter((filePath) =>
    /\.(?:html|js|css)$/i.test(filePath),
  );
  const forbiddenBuildMarkers = [
    "EventAiAssistant",
    "eventAiEmbed",
    "event-ai-root",
    "ACT Creative AI assistant is ready",
  ];

  for (const filePath of generatedFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    for (const marker of forbiddenBuildMarkers) {
      if (content.includes(marker)) {
        failures.push(
          `${path.relative(root, filePath)} contains retired assistant marker: ${marker}`,
        );
      }
    }
  }
}

if (failures.length) {
  console.error("AI retirement guard failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `AI retirement guard passed${includeBuild ? " for source and build output" : " for source"}.`,
);
