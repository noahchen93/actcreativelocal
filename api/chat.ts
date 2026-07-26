const MAX_REQUEST_BYTES = 64 * 1024;
const UPSTREAM_TIMEOUT_MS = 55_000;
const ALLOWED_PRODUCTION_HOSTS = new Set(["actcreative.net", "www.actcreative.net"]);

function jsonResponse(payload: unknown, status = 200, headers?: HeadersInit) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers,
    },
  });
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    if (ALLOWED_PRODUCTION_HOSTS.has(hostname)) return true;
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;

    const deploymentHostname = process.env.VERCEL_URL?.toLowerCase();
    return Boolean(deploymentHostname && hostname === deploymentHostname);
  } catch {
    return false;
  }
}

function gatewayConfiguration() {
  const url = process.env.AI_GATEWAY_URL?.trim().replace(/\/$/, "");
  const secret = process.env.AI_GATEWAY_SECRET?.trim();
  return url && secret ? { url, secret } : null;
}

async function fetchGateway(pathname: string, init: RequestInit = {}) {
  const gateway = gatewayConfiguration();
  if (!gateway) {
    throw new Error("AI gateway is not configured");
  }

  const timeoutSignal = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);
  const signal = init.signal
    ? AbortSignal.any([init.signal, timeoutSignal])
    : timeoutSignal;
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${gateway.secret}`);

  return fetch(`${gateway.url}${pathname}`, {
    ...init,
    headers,
    signal,
  });
}

async function healthResponse() {
  try {
    const upstream = await fetchGateway("/api/chat/health", {
      headers: { Accept: "application/json" },
    });
    const payload = await upstream.json().catch(() => null);

    if (!upstream.ok || !payload) {
      throw new Error(`AI gateway health check returned ${upstream.status}`);
    }

    return jsonResponse({
      ok: Boolean(payload.ok),
      status: payload.status || "offline",
      detail: payload.detail || "",
      rag: {
        ready: Boolean(payload.rag?.ready),
        embeddingStatus: payload.rag?.embeddingStatus || "offline",
        documentCount: Number(payload.rag?.documentCount || 0),
        chunkCount: Number(payload.rag?.chunkCount || 0),
      },
    });
  } catch (error) {
    console.error("[ai-proxy-health]", error);
    return jsonResponse(
      {
        ok: false,
        status: "offline",
        detail: "The AI assistant is temporarily unavailable.",
        rag: { ready: false, embeddingStatus: "offline", documentCount: 0, chunkCount: 0 },
      },
      503,
    );
  }
}

async function chatResponse(request: Request) {
  if (!isAllowedOrigin(request)) {
    return jsonResponse({ error: "Forbidden" }, 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ error: "Content-Type must be application/json" }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ error: "Request is too large" }, 413);
  }

  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > MAX_REQUEST_BYTES) {
    return jsonResponse({ error: "Request is too large" }, 413);
  }

  try {
    JSON.parse(body);
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  try {
    const upstream = await fetchGateway("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
      },
      body,
      signal: request.signal,
    });

    const headers = new Headers({
      "Cache-Control": "no-store",
      "Content-Type":
        upstream.headers.get("content-type") || "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    });

    for (const name of [
      "X-Act-Session-Id",
      "X-Act-Rag-Used",
      "X-Act-Rag-Sources",
      "Retry-After",
    ]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    console.error("[ai-proxy-chat]", error);
    return jsonResponse(
      { error: "The AI assistant is temporarily unavailable. Please try again later." },
      503,
      { "Retry-After": "30" },
    );
  }
}

export default {
  async fetch(request: Request) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.searchParams.get("health") === "1") {
      return healthResponse();
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, { Allow: "GET, POST" });
    }

    return chatResponse(request);
  },
};
