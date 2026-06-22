import fs from "node:fs/promises";

export async function loadRagIndex(indexPath) {
  try {
    const raw = await fs.readFile(indexPath, "utf8");
    const index = JSON.parse(raw);

    if (!Array.isArray(index.chunks) || !index.chunks.length) {
      return null;
    }

    return index;
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.error("[rag] Unable to load index", error);
    }
    return null;
  }
}

export async function embedTexts({
  ollamaUrl,
  model,
  inputs,
  keepAlive = "24h",
}) {
  if (!inputs.length) return [];

  const response = await fetch(`${ollamaUrl}/api/embed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      input: inputs,
      truncate: true,
      keep_alive: keepAlive,
    }),
  });

  if (!response.ok) {
    throw new Error((await response.text()) || `Embedding request returned ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload.embeddings) || payload.embeddings.length !== inputs.length) {
    throw new Error("Embedding response did not match the requested input count");
  }

  return payload.embeddings;
}

function cosineSimilarity(left, right) {
  if (!left?.length || left.length !== right?.length) return -1;

  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] * left[index];
    rightNorm += right[index] * right[index];
  }

  if (!leftNorm || !rightNorm) return -1;
  return dot / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

const QUERY_EXPANSIONS = [
  [/圣淘沙/iu, " Sentosa "],
  [/案例|项目案例|做过什么/iu, " case study project portfolio "],
  [/服务|业务|能做什么/iu, " services capabilities "],
  [/场地|会场/iu, " venue event space "],
  [/展位|展台/iu, " booth exhibition "],
  [/搭建|制作/iu, " fabrication production build "],
  [/道具/iu, " custom props "],
  [/雕塑|装置/iu, " sculpture installation "],
  [/采购|供应商/iu, " sourcing supplier "],
  [/物流|运输/iu, " logistics shipping "],
];

export function expandRetrievalQuery(query) {
  let expanded = query;
  for (const [pattern, addition] of QUERY_EXPANSIONS) {
    if (pattern.test(query)) expanded += addition;
  }
  return expanded.replace(/\s+/g, " ").trim();
}

function lexicalTokens(query) {
  return Array.from(
    new Set(
      query
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .split(/\s+/)
        .filter((token) => token.length >= 3),
    ),
  );
}

function categoryBoost(query, category) {
  const normalized = query.toLowerCase();
  if (/\b(case|project|portfolio)\b|案例/u.test(normalized)) {
    return category === "cases" ? 0.11 : 0;
  }
  if (/\b(venue|space)\b|场地/u.test(normalized)) {
    return category === "venues" ? 0.09 : 0;
  }
  if (/\b(service|capabilities)\b|服务/u.test(normalized)) {
    return category === "services" || category === "company" ? 0.06 : 0;
  }
  return 0;
}

export function retrieveRelevantChunks(index, queryEmbedding, options = {}) {
  const topK = options.topK || 5;
  const minimumScore = options.minimumScore ?? 0.35;
  const maxPerDocument = options.maxPerDocument || 2;
  const queryText = options.queryText || "";
  const tokens = lexicalTokens(queryText);
  const documentCounts = new Map();

  return index.chunks
    .map((chunk) => {
      const semanticScore = cosineSimilarity(queryEmbedding, chunk.embedding);
      const titleText = chunk.title.toLowerCase();
      const bodyText = chunk.text.toLowerCase();
      const titleMatches = tokens.reduce(
        (count, token) => count + (titleText.includes(token) ? 1 : 0),
        0,
      );
      const bodyMatches = tokens.reduce(
        (count, token) => count + (bodyText.includes(token) ? 1 : 0),
        0,
      );
      const lexicalBoost = Math.min(titleMatches * 0.07 + bodyMatches * 0.015, 0.2);
      const score =
        semanticScore + lexicalBoost + categoryBoost(queryText, chunk.category);

      return {
        ...chunk,
        semanticScore,
        score,
      };
    })
    .filter((chunk) => chunk.score >= minimumScore)
    .sort((left, right) => right.score - left.score)
    .filter((chunk) => {
      const currentCount = documentCounts.get(chunk.documentId) || 0;
      if (currentCount >= maxPerDocument) return false;
      documentCounts.set(chunk.documentId, currentCount + 1);
      return true;
    })
    .slice(0, topK);
}
