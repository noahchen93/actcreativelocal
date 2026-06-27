# ACT Creative Website Project Context

Last updated: 2026-06-27, Asia/Shanghai.

This file is the living handoff document for `actcreativelocal`. Update it in the same commit as every meaningful website, content, data, AI, deployment, or operations change. If another tool or developer continues this project, read this file first.

## Maintenance Rule

- Treat this file as the shared project memory.
- After each development update, add the relevant change under "Development History" or the appropriate section below.
- Keep operational facts concrete: paths, commands, ports, environment variables, known risks, and verification results.
- Do not paste secrets, private conversation logs, raw user messages, service-account JSON, or private API tokens.
- Commit and push this file together with the code/content changes it describes so local and remote context stay aligned.

## Project Identity

ACT Creative / 及物创意 is positioned as a Singapore-based creative production and cross-border execution partner. The site targets event agencies, brands, PR teams, exhibition contractors, retail marketing teams, Chinese brands entering Singapore/Southeast Asia, and clients needing China-side production support.

Core business themes:

- Singapore event fabrication and custom production.
- Exhibition booth, trade show booth, pop-up, roadshow and retail mall activation support.
- Custom props, FRP/fiberglass sculpture, flying inflatables, food truck/event vehicle customization, and installation work.
- China sourcing, supplier coordination, samples, QC, packing, and China-to-Southeast-Asia logistics.
- Art exhibition planning and installation.
- Singapore venue service: public venue finder/map, reviewed shortlist support, site recaps, and venue SEO content.

User intent and product direction:

- The site should function as a serious commercial acquisition surface, not a decorative portfolio only.
- SEO matters: service pages, case-study pages, venue pages, schema, canonical URLs, sitemap freshness, and Search Console feedback have driven many changes.
- Claims should be practical and defensible. Avoid unverifiable availability, pricing, date, or capacity guarantees.
- For venue data, prefer reviewed public records, official sources when available, and explicit "reference record" language when not official.
- The user values bilingual capability, but English service SEO and Simplified Chinese accessibility are both important.
- The user prefers local control for AI: local Ollama, local logs, local RAG, Cloudflare Tunnel, and no direct exposure of Ollama.
- Privacy matters: conversation logs stay local/private; public insight files must contain aggregate or curated prompts only.

## Repository And Remote

- Local workspace: `E:\actcreativelocal`
- Git remote: `https://github.com/noahchen93/actcreativelocal.git`
- Active branch at this update: `codex/venue-finder-finish`
- Production domain: `https://actcreative.net`
- AI gateway public tunnel hostname: `https://ai.actcreative.net`

## Technology Stack

Frontend:

- React 18 with TypeScript.
- Vite 6, output directory `build`.
- `@vitejs/plugin-react-swc`.
- Tailwind CSS utilities are present through project CSS/imports.
- UI dependencies include Radix UI primitives, lucide-react icons, motion, embla-carousel-react, sonner, and assorted shadcn-style component wrappers.
- Vercel Analytics is enabled in the React app.

Static/public site:

- Many SEO service and case-study pages are static HTML under `public/`.
- Vite build copies public assets and injects the floating AI assistant into most static pages through the custom `universal-event-ai-assistant` plugin in `vite.config.ts`.
- Homepage is React-driven from `index.html` and `src/`.
- A localized Chinese homepage is generated at build time under `/zh/`.

Backend/API:

- `api/chat.ts` is the Vercel Function proxy for production `/api/chat`.
- It accepts only allowed origins: `actcreative.net`, `www.actcreative.net`, localhost, 127.0.0.1, and matching Vercel preview host.
- It requires `AI_GATEWAY_URL` and `AI_GATEWAY_SECRET` in the Vercel runtime.
- It forwards requests to the local gateway through Cloudflare Tunnel and attaches `Authorization: Bearer <AI_GATEWAY_SECRET>`.

Local AI:

- Local gateway: `scripts/local-ai-server.mjs`
- Local gateway port: `127.0.0.1:8787`
- Ollama port: `127.0.0.1:11434`
- Chat model: `act-event-assistant`
- Embedding model: `act-rag-embedding`
- RAG index: `local-ai/knowledge/index/act-creative-rag-index.json`
- System prompt: `local-ai/system-prompt.md`
- Conversation logs: `local-ai/conversations/YYYY-MM-DD.ndjson`
- Private insight reports: `local-ai/insights/conversation-insights.json` ignored by Git.
- Public popular-question feed: `public/ai-insights/top-questions.json`

Production AI path:

```text
actcreative.net/api/chat
-> Vercel Function api/chat.ts
-> ai.actcreative.net
-> Cloudflare Tunnel
-> local AI gateway on 127.0.0.1:8787
-> Ollama on 127.0.0.1:11434
```

Operations scripts:

- `scripts/start-production-ai.ps1` starts/repairs the site AI stack on Windows.
- `scripts/start-production-tunnel.ps1` starts the Cloudflare Tunnel.
- Windows startup entries documented in `docs/production-ai-operations.md` are expected to run these scripts after sign-in.

Data/tooling:

- Venue data pipeline uses Python and Node scripts under `scripts/`.
- Image processing uses `sharp`.
- Google Search Console and Google Sheets scripts use `googleapis`.
- Playwright is available for smoke/visual testing.

## Important Commands

Install and run:

```powershell
npm install
npm run dev
```

Local AI:

```powershell
npm run ollama:create
npm run ollama:embedding
npm run rag:index
npm run dev:ai
```

Production AI repair/start:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\start-production-ai.ps1
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\start-production-tunnel.ps1
```

Build and venue workflows:

```powershell
npm run build
npm run sanitize:venue-finder
npm run validate:venue-finder
npm run generate:venue-pages
npm run generate:venue-details
npm run smoke:venue-finder
```

AI insights:

```powershell
npm run ai:insights
npm run ai:insights:preview
```

Google/Search Console workflows:

```powershell
npm run gsc
npm run gsc:auth
npm run gsc:sheet
```

## Current File Map

Core app:

- `src/App.tsx`: homepage composition, lazy-loaded homepage sections, analytics, and floating AI assistant.
- `src/components/Header.tsx`: navigation and language-aware header behavior.
- `src/components/Hero.tsx`, `HeroSlideshow.tsx`: first viewport.
- `src/components/CaseStudies.tsx`, `CaseDetailDialog.tsx`: project case content and dialogs.
- `src/components/ProductCategories.tsx`, `Services.tsx`: business capability sections.
- `src/components/Contact.tsx`: contact and brief-building interaction.
- `src/components/EventAiAssistant.tsx` and `.css`: floating AI assistant UI.
- `src/event-ai-embed.tsx`: standalone mount used for static pages.

Static pages and public assets:

- `public/about/`
- `public/art-exhibition-planning-installation/`
- `public/blog/`
- `public/booth-design-build-*`
- `public/case-studies/`
- `public/china-*`
- `public/custom-*`
- `public/event-*`
- `public/frp-sculpture-fabrication-singapore/`
- `public/singapore-event-venue-finder/`
- `public/singapore-event-venue-sourcing/assets/` remains as legacy assets only; the old sourcing URL redirects to `/singapore-event-venue-finder/`.
- `public/singapore-event-venues/`
- `public/trade-show-booth-singapore/`
- `public/zh/`
- `public/seo-service-page.css`
- `public/inquiry-attribution.js`
- `public/venue-detail-tracking.js`
- `public/sitemap.xml`, `robots.txt`, `llms.txt`

AI and knowledge:

- `local-ai/Modelfile`
- `local-ai/EmbeddingModelfile`
- `local-ai/system-prompt.md`
- `local-ai/knowledge/`
- `local-ai/conversations/`
- `local-ai/insights/`
- `scripts/local-ai-server.mjs`
- `scripts/build-local-ai-index.mjs`
- `scripts/lib/local-ai-rag.mjs`
- `scripts/analyze-ai-conversations.mjs`

Venue and SEO data scripts:

- `scripts/generate-venue-finder-data.py`
- `scripts/sanitize-venue-public-data.mjs`
- `scripts/validate-venue-finder.py`
- `scripts/generate-venue-seo-pages.mjs`
- `scripts/generate-featured-venue-pages.mjs`
- `scripts/audit-venue-images.mjs`
- `scripts/refresh-venue-images.mjs`
- `scripts/generate-venue-finder-og.mjs`
- `scripts/generate-og-images.mjs`

Operations:

- `docs/production-ai-operations.md`
- `scripts/start-production-ai.ps1`
- `scripts/start-production-tunnel.ps1`
- `vercel.json`
- `.env.example`
- `.env.local` exists locally and must not be committed.

## Development History

The git history shows these major phases:

1. Figma-origin React site foundation.
   - Initial code bundle came from a Figma design.
   - React/Vite homepage was tuned for production builds, vendor chunking, lazy-loaded sections, image optimization, and bilingual homepage support.

2. Core business and SEO expansion.
   - Service pages were added for booth design, event fabrication, event merchandise, China sourcing, China production support, logistics, FRP sculpture, custom props, flying inflatables, food truck customization, retail mall activation, roadshow production, Hong Kong event fabrication, and trade show booths.
   - Case studies were enriched for Sentosa Big Big World, PACMAN and Friends, Artbox, Barbie runway exhibition, Craig & Karl, Florentijn Hofman, K11/public art style work, and Kick Off Challenge at The Star Vista.
   - SEO improvements were driven by Search Console tracking, canonical/meta cleanup, schema, social preview images, sitemap freshness, and service page proof sections.
   - Commercial SEO landing pages were tightened around clearer acquisition intent, proof sections, and less generic service positioning.

3. Inquiry attribution and tracking.
   - `public/inquiry-attribution.js` captures inquiry context.
   - Contact/brief flows were expanded to help users prepare actionable project requests.

4. Singapore event venue finder.
   - `public/singapore-event-venue-finder/` became a public venue discovery surface.
   - The venue map/search experience was moved to the foreground so visitors can start with location, capacity, district, and venue-type filtering.
   - The previous standalone `/singapore-event-venue-sourcing/` page was removed as a separate destination and permanently redirected to `/singapore-event-venue-finder/`.
   - Venue service copy now combines self-serve map discovery with human shortlist support, restrictions review, and site recap assistance.
   - Scripts sanitize venue data, remove sensitive notes, filter bad/corrupt text, enrich images, and validate public-safe records.
   - SEO venue guide pages were generated for Sentosa, Marina Bay, outdoor venues, hotel ballrooms, 200+ guest venues, and arts/performance venues.
   - Featured venue detail pages were added under `public/singapore-event-venues/`.
   - Venue copy should always clarify that capacity is a planning reference unless official/current source support is explicit.

5. Brand and navigation repositioning.
   - Header/navigation language shifted from a broad portfolio feel toward clearer service entry points, especially venue service, event fabrication, booth/trade show support, China production/sourcing, and case studies.
   - Homepage/service messaging was adjusted to make ACT Creative feel more operationally credible and commercially specific.

6. Kick Off Challenge case study.
   - Added `public/case-studies/kick-off-challenge-star-vista-singapore/` with project page, schema, image proof, and case-study index entry.
   - Added `public/case-studies/images/kick-off-challenge.webp` for case cards and the homepage slideshow.
   - Scope should stay precise: ACT Creative supported as one supplier for carpet procurement/installation, football fencing, truss protection covers, football bowling props, consultation, and selected setup tasks.

7. Local AI assistant with RAG.
   - Local Ollama models were created:
     - `act-event-assistant`
     - `act-rag-embedding`
   - `scripts/build-local-ai-index.mjs` indexes website/service/case content into a local RAG index.
   - `scripts/local-ai-server.mjs` handles `/api/chat`, RAG retrieval, model streaming, conversation logging, health checks, and single-request concurrency.
   - The React floating assistant was added to the homepage and static pages.

8. Production AI exposure.
   - Production uses Vercel proxy plus Cloudflare Tunnel to reach the local gateway.
   - `api/chat.ts` prevents direct browser access to the tunnel secret and limits allowed origins.
   - Ollama itself must never be exposed publicly.

9. Conversation logs and insight groundwork.
   - Completed chat turns are stored locally under `local-ai/conversations/`.
   - `scripts/analyze-ai-conversations.mjs` was added to aggregate conversation topics.
   - Public popular questions are exported to `public/ai-insights/top-questions.json`.
   - Private raw insights stay under `local-ai/insights/` and are ignored by Git.
   - Current public threshold is three matching topic records; lower-threshold preview exists for testing.

10. Ollama/Cloud Code repair on 2026-06-27.
   - Cloud Code/Claude experimentation introduced an alternate Ollama environment and model directory.
   - Problem observed:
     - `127.0.0.1:11434` could list models or health responses, but chat/embed calls timed out or could not find `act-*` models.
     - Conflicting model directories included `F:\LLM\Ollama` and `H:\LLM\Ollama\models`.
   - Correct site model directory is `H:\LLM\Ollama\models`.
   - The repaired production launch path uses:
     - `OLLAMA_MODELS=H:\LLM\Ollama\models`
     - `OLLAMA_HOST=127.0.0.1:11434`
     - `OLLAMA_CONTEXT_LENGTH=8192`
     - `OLLAMA_KEEP_ALIVE=24h`
     - `OLLAMA_LOAD_TIMEOUT=10m`
     - `OLLAMA_NUM_PARALLEL=1`
     - `OLLAMA_VULKAN=false`
   - `scripts/start-production-ai.ps1` now checks that `act-event-assistant:latest` and `act-rag-embedding:latest` are visible before treating Ollama as healthy.

11. Project context handoff file on 2026-06-27.
   - This file was added so future tools/developers can understand project history, intent, operations, and constraints quickly.
   - README links to this file.

## AI Assistant Operating Notes

Health endpoints:

```powershell
$secret = (Get-Content .env.local -Encoding UTF8 |
  Where-Object { $_ -like "AI_GATEWAY_SECRET=*" }).Split("=", 2)[1]

Invoke-RestMethod `
  -Headers @{ Authorization = "Bearer $secret" } `
  -Uri "http://127.0.0.1:8787/api/chat?health=1"

Invoke-RestMethod -Uri "https://actcreative.net/api/chat?health=1"
```

Known behavior:

- Qwen 3.6 36B cold start can take several minutes.
- Once loaded, the model is kept warm for 24 hours by the local gateway.
- The gateway allows only one active chat request at a time. A second request returns 429.
- Vercel proxy timeout is shorter than full cold-start time; warm the model locally before expecting production chat to work reliably.
- Embedding model uses a smaller context and may stay resident together with the chat model.
- If production health says ready but chat fails, check for multiple Ollama processes, wrong `OLLAMA_MODELS`, and residual `llama-server.exe` processes.

Successful verification on 2026-06-27 after repair:

- Local gateway POST to `http://127.0.0.1:8787/api/chat`: 200, returned `ACT AI online`.
- Local Vite proxy POST to `http://127.0.0.1:3000/api/chat`: 200, returned `ACT AI online`.
- Production POST to `https://actcreative.net/api/chat`: 200, returned `ACT AI online`.
- Production health: `ready`, RAG ready.

## Privacy And Data Rules

- Never commit `.env`, `.env.local`, service account files, OAuth tokens, Google refresh tokens, or Cloudflare credentials.
- Never expose port `11434` publicly.
- Conversation `.ndjson` files under `local-ai/conversations/` are private and ignored by Git.
- Public AI suggestions must use curated topic questions, not raw user wording.
- IP addresses are not recorded by the local conversation logger.
- Avoid publishing private venue pricing, availability, minimum spend, quote, or date-sensitive information.

## User Preferences And Editing Style

- Prefer pragmatic, commercially useful changes over decorative redesign.
- Keep ACT Creative positioned as experienced and operationally credible.
- SEO pages should be clear, specific, and source-aware, not generic filler.
- Avoid overclaiming: use "can support", "planning reference", "confirm with venue", and "reviewed public records" where appropriate.
- Preserve bilingual context; Simplified Chinese support matters, but English SEO is often the acquisition priority.
- Keep AI features local-first and privacy-conscious.
- When adding automation or analytics, keep raw data private and expose only aggregate/curated outputs.
- After any meaningful change, update this file and push the update to the remote repository.

## Current Known Risks

- Ollama desktop/Cloud Code/Claude tooling can start a competing Ollama process with a different `OLLAMA_MODELS` path. Use `scripts/start-production-ai.ps1` to restore the site-specific runtime.
- The chat model is large and cold start is slow; production chat can time out during cold start even when health eventually becomes ready.
- Static pages under `public/` are numerous; changes to global assistant injection require `npm run build` verification.
- Venue data must remain public-safe and source-aware; do not ingest unreviewed sensitive notes into public JSON.
- Generated files and ignored local data can make local/remote context diverge if this file is not updated in the same commit as changes.

## Recommended Handoff Checklist

Before handing work to another tool or developer:

1. Run `git status --short --untracked-files=all`.
2. Update this `PROJECT_CONTEXT.md` with any new facts, decisions, or operational changes.
3. Run the relevant verification:
   - `npm run build` for frontend/build changes.
   - `npm run smoke:venue-finder` for venue finder changes.
   - `npm run rag:index` after knowledge/page changes that should affect AI.
   - Local and production `/api/chat` checks after AI operations changes.
4. Commit code and this file together.
5. Push to `origin` so remote context matches local context.
