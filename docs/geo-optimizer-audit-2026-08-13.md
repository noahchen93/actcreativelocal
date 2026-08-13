# ACT Creative GEO / AI Search Optimization Audit

Date: 2026-08-13 (Asia/Singapore)

Tool: [Auriti Labs GEO Optimizer](https://github.com/Auriti-Labs/geo-optimizer-skill)

Branch: `codex/security-seo-ai-retirement`

## Outcome

The public production baseline scored **73/100 (Good)**. The final local production build scored **91/100 (Excellent)** using the same GEO Optimizer version and audit rules.

| Category | Production baseline | Final local build |
| --- | ---: | ---: |
| AI crawler access | 18/18 | 18/18 |
| `llms.txt` | 14/18 | 16/18 |
| Schema | 13/16 | 13/16 |
| Meta tags | 14/14 | 14/14 |
| Content structure | 9/12 | 12/12 |
| Discovery/freshness signals | 3/6 | 6/6 |
| AI discovery endpoints | 0/6 | 6/6 |
| Brand/entity signals | 5/10 | 7/10 |
| Negative-signal penalty | -3 | -1 |
| **Total** | **73** | **91** |

Additional modeled results:

- Citability: **83/100 → 100/100**
- Perplexity readiness: **60 → 85**
- Google AI readiness: **86 → 90**
- ChatGPT readiness: **80 → 80** (already strong at baseline)
- Prompt-injection scan: **clean**, no detected manipulation patterns

## Implemented

- Added `/.well-known/ai.txt` with public discovery routes and a clear `/api/` exclusion.
- Added `/ai/summary.json`, `/ai/faq.json` and `/ai/service.json` with canonical sources, service capabilities and explicit claim limitations.
- Added `/llms-full.txt` for expanded entity, service, case-study, workflow and citation context; linked it from the compact `llms.txt` index.
- Added `/feed.xml` and homepage RSS discovery.
- Added homepage `dateModified`, aligned the Organization schema description with the meta description, and made the About page discoverable in raw HTML.
- Added a factual evidence block with the current 135 venue records, 11 case studies, 43 named sculpture projects, 67 public sculpture references and the 30+ artwork K11 case.
- Added visible author/publisher attribution and reduced repetitive location wording without weakening canonical service-page targeting.
- Added `scripts/check-geo-discovery.mjs` to protect all discovery files, JSON structure, source links, RSS, freshness and venue-count consistency in source and build output.

## Deliberately not implemented

- No fake Wikipedia, Wikidata, Crunchbase or organization LinkedIn `sameAs` URL was added. A personal LinkedIn profile is not represented as the company page.
- No `SearchAction` was added because ACT Creative does not currently provide a real all-site search endpoint. The venue finder is a scoped venue tool, not general site search.
- No WebMCP tool attributes were added solely for a score. Existing inquiry and venue interactions should be evaluated as real agent actions before publishing machine-action declarations.
- No academic/DOI references were added to a commercial homepage. Official or primary sources remain most appropriate on the relevant venue and technical pages.
- The retired website AI assistant was not restored. The new files are static public discovery documents, not a chatbot, model runtime or chat API.

## Verification

- `npm run geo:check`
- `npm run seo:check`
- `npm run build`
- Source and build AI-retirement guards
- GEO Optimizer production baseline audit
- GEO Optimizer final local-build audit
- `git diff --check`

The final 91 score represents the local production build. A new public audit should be run after deployment to confirm Vercel headers, CDN access and every discovery endpoint on the canonical domain.
