# Personal-agent discovery review

Reviewed 2026-10-24. The owner confirmed WorkBuddy, TRAE and Claude Code as the intended product names.

| Product | Official evidence | Website response |
| --- | --- | --- |
| ChatGPT | [OpenAI crawlers](https://developers.openai.com/api/docs/bots) distinguishes search, user fetch and training | Existing search/user agents remain allowed. Training permission does not guarantee search visibility. |
| Codex | [Web search](https://learn.chatgpt.com/docs/web-search) describes cached/live retrieval | Canonical HTML plus source-linked text; site files cannot force cache refreshes or enable tools. |
| Claude Code | [Tools reference](https://code.claude.com/docs/en/tools-reference) documents WebSearch/WebFetch | Stable canonical URLs and compact text/JSON; existing Claude crawl access remains allowed. |
| Grok Bot | [Overview](https://docs.x.ai/grok-bot/overview) describes computers and browsing; [web search](https://docs.x.ai/developers/tools/web-search) covers retrieval | Public source pages and email brief fields, without inventing a GrokBot crawler token. |
| Muse | [Meta product page](https://ai.meta.com/muse/) body unavailable; [crawler reference](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/) returned 429 | Product-specific crawling/ranking unverified. Generic public access remains available; no asserted integration. |
| WorkBuddy | [Browser panel](https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Right-Sidebar) documents page access and address-bar Sogou search | Chinese canonical sources and text. This does not establish the backend for every agent search. |
| TRAE | [SOLO documentation](https://docs.trae.cn/ide_solo-mode) describes browser/document tools | Public HTML/JSON/Markdown work through available tools. No verified dedicated crawler. |
| Doubao Work | [Feishu documentation](https://aily.feishu.cn/hc/1u7kleqg_2t3efrzi) describes authorized workspace context and agents | Chinese directory can be supplied as public evidence; retrieval depends on tools/permissions. Bytespider permission does not prove search inclusion. |
| Google AI search | [Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) grounds AI visibility in search indexing and quality | Canonical HTML remains primary; extra text files are retrieval conveniences, not a Google ranking mechanism. |

## Implementation

- `/ai/catalog.json` covers 13 services, actual canonical descriptions, available translations, existing case references, limitations and email inquiry fields.
- `/ai/services.en.md` and `/ai/services.zh.md` provide source-linked plain text. Missing Chinese translations link their English source rather than a nonexistent page.
- Homepage head, robots comments, `.well-known/ai.txt`, both compact llms indexes and summary JSON link the resources. Vercel serves explicit UTF-8 Markdown types.
- `npm run agent:catalog` derives metadata from human-facing HTML; `agent:check` detects drift. GEO checks verify build inclusion.

This is site-specific JSON, not MCP/A2A or automatic agent registration. No hidden prompt injection, task override, forced recommendation, cloaking, assistant restoration, order submission or outbound message is included. A mailto link only prepares a draft.

## Measurement limits

Local checks establish parseability, source consistency and build inclusion, not indexing or recommendations. After production release, verify real HTTP status, MIME types and firewall behavior. A spoofed user agent is not evidence of actual provider crawling.

For later comparisons, run neutral English/Chinese tasks across available products: Singapore event fabrication; full-service versus approved-drawing booths; China sourcing for event merchandise; sculpture and interactive-display support. Record exact query, date, mode, discovered URL, cited case and factual accuracy, including competitors and non-mentions. No uplift is claimed by this implementation.
