# ACT Creative SEO Live Audit

Date: 2026-05-13  
Site: https://actcreative.net  
Scope: live sitemap URLs, indexability basics, structured data, canonical tags, OG images, robots and llms.txt.

## Summary

- Sitemap: `https://actcreative.net/sitemap.xml` returns `200` with `application/xml`.
- Sitemap URL count: 26.
- All sitemap URLs return `200`.
- All checked pages have a canonical URL matching the sitemap URL.
- No checked page exposes `noindex`.
- All checked pages have exactly one H1.
- All checked JSON-LD blocks parse successfully.
- `robots.txt` returns `200`.
- `llms.txt` returns `200`.
- All referenced OG images return `200`.

## Priority Findings

1. No blocking crawl/indexing issue found in the live deployment.
2. The newest SEO targets should be submitted manually in Search Console first:
   - `https://actcreative.net/case-studies/`
   - `https://actcreative.net/case-studies/florentijn-hofman-shanghai-museum-show/`
   - `https://actcreative.net/case-studies/craig-and-karl-beijing-museum-show/`
   - `https://actcreative.net/case-studies/k11-shenyang-public-art-collection/`
3. Meta descriptions are technically valid, but a few are long or short. This is not urgent, but can be tightened later for better snippets.
4. Many service pages still use the generic `og-default.png`; this is acceptable for crawlability, but page-specific OG images would improve sharing and entity signals.
5. Artbox still uses the generic OG image because no verified real project image is available yet.

## Live Checks

| URL | Status | Title length | Description length | H1 count | JSON-LD | Canonical | OG image | Notes |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| https://actcreative.net/ | 200 | 79 | 212 | 1 | 3 | OK | `og-default.png` | Description long |
| https://actcreative.net/about/ | 200 | 72 | 193 | 1 | 1 | OK | `og-default.png` | Description long |
| https://actcreative.net/zh/ | 200 | 36 | 82 | 1 | 1 | OK | `og-default.png` | OK |
| https://actcreative.net/zh/event-fabrication-singapore/ | 200 | 27 | 53 | 1 | 1 | OK | `og-default.png` | Description short |
| https://actcreative.net/zh/china-event-production-support/ | 200 | 29 | 66 | 1 | 1 | OK | `og-default.png` | Description short |
| https://actcreative.net/blog/ | 200 | 72 | 172 | 1 | 1 | OK | `og-default.png` | Description long |
| https://actcreative.net/blog/singapore-event-production-cost-guide-2026/ | 200 | 59 | 184 | 1 | 1 | OK | `og-default.png` | Description long |
| https://actcreative.net/blog/sourcing-frp-sculptures-from-china/ | 200 | 70 | 178 | 1 | 1 | OK | `og-default.png` | Description long |
| https://actcreative.net/event-fabrication-singapore/ | 200 | 42 | 158 | 1 | 1 | OK | `og-default.png` | OK |
| https://actcreative.net/custom-props-singapore/ | 200 | 37 | 132 | 1 | 1 | OK | `og-default.png` | OK |
| https://actcreative.net/frp-sculpture-fabrication-singapore/ | 200 | 50 | 137 | 1 | 1 | OK | `og-default.png` | OK |
| https://actcreative.net/exhibition-booth-production-singapore/ | 200 | 52 | 149 | 1 | 1 | OK | `og-default.png` | OK |
| https://actcreative.net/china-event-production-support/ | 200 | 55 | 144 | 1 | 1 | OK | `og-default.png` | OK |
| https://actcreative.net/event-merchandise-sourcing/ | 200 | 52 | 152 | 1 | 1 | OK | `og-default.png` | OK |
| https://actcreative.net/trade-show-booth-singapore/ | 200 | 49 | 167 | 1 | 1 | OK | `og-default.png` | OK |
| https://actcreative.net/event-fabrication-hong-kong/ | 200 | 42 | 168 | 1 | 1 | OK | `og-default.png` | OK |
| https://actcreative.net/roadshow-production-singapore/ | 200 | 44 | 168 | 1 | 1 | OK | `og-default.png` | OK |
| https://actcreative.net/retail-mall-activation-singapore/ | 200 | 47 | 164 | 1 | 1 | OK | `og-default.png` | OK |
| https://actcreative.net/case-studies/ | 200 | 62 | 133 | 1 | 1 | OK | `big-big-world.webp` | OK |
| https://actcreative.net/case-studies/artbox-singapore-merchandise-materials/ | 200 | 71 | 194 | 1 | 1 | OK | `og-default.png` | Description long; needs real image later |
| https://actcreative.net/case-studies/sentosa-big-big-world-event-fabrication/ | 200 | 67 | 143 | 1 | 1 | OK | `big-big-world.webp` | OK |
| https://actcreative.net/case-studies/wings-of-art-barbie-runway-singapore/ | 200 | 62 | 154 | 1 | 1 | OK | `wings-of-art.webp` | OK |
| https://actcreative.net/case-studies/sentosa-pacman-human-game/ | 200 | 52 | 133 | 1 | 1 | OK | `pacman-friends.webp` | OK |
| https://actcreative.net/case-studies/florentijn-hofman-shanghai-museum-show/ | 200 | 61 | 159 | 1 | 1 | OK | `florentijn-hofman.webp` | OK |
| https://actcreative.net/case-studies/craig-and-karl-beijing-museum-show/ | 200 | 56 | 161 | 1 | 1 | OK | `craig-karl.webp` | OK |
| https://actcreative.net/case-studies/k11-shenyang-public-art-collection/ | 200 | 67 | 149 | 1 | 1 | OK | `k11-shenyang.webp` | OK |

## Next Engineering Improvements

1. Tighten long/short meta descriptions to a consistent 110-160 character range.
2. Create page-specific OG images for core service pages.
3. Add verified Artbox project image when available.
4. Expand Chinese page descriptions and add more Chinese service pages if Chinese-language search is a priority.
5. Add `sameAs` links to Organization schema after LinkedIn / Google Business Profile / Instagram are ready.
