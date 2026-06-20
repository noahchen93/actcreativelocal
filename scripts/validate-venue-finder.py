#!/usr/bin/env python3
"""Validate the public venue finder artifact before deployment."""

from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = ROOT / "public" / "singapore-event-venue-finder" / "venue-data.json"
PAGE_PATH = ROOT / "public" / "singapore-event-venue-finder" / "index.html"
OG_PATH = ROOT / "public" / "og" / "singapore-event-venue-finder.png"
SEO_GUIDE_SLUGS = {
    "sentosa",
    "marina-bay",
    "outdoor",
    "hotel-ballrooms",
    "200-guests",
}
EXPECTED_POSTCODES = {
    "Arden": "048948",
    "Black White House": "249671",
    "Pan Pacific Singapore": "039595",
}
FORBIDDEN_PUBLIC_FIELDS = {
    "alias",
    "category",
    "rawSuggestedTypes",
    "searchTerms",
    "sourceLevel",
    "geocodeName",
    "geocodeStatus",
    "geocodeQuery",
    "hours",
    "priceSignal",
}
SENSITIVE_PUBLIC_TEXT = re.compile(
    r"\bavailability\b|\bavailable dates?\b|\bdate holds?\b|\bminimum spend\b|"
    r"\bpricing\b|\bprices?\b|\bcosts?\b|\bfees?\b|\brates?\b|\bquotes?\b|"
    r"s\$|\$\s*\d|档期|可用日期|最低消费|价格|费用|报价",
    re.IGNORECASE,
)
NON_ENGLISH_OR_CORRUPT = re.compile(
    r"[\u3400-\u9fff\uff00-\uffef]|\?{3,}|锟|鈫|妗|鍙|鏈|�"
)


def main() -> None:
    dataset = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    venues = dataset["venues"]
    errors: list[str] = []
    page_html = PAGE_PATH.read_text(encoding="utf-8")

    if dataset.get("publicCount") != len(venues):
        errors.append("publicCount does not match the venue array")
    mapped = [
        venue
        for venue in venues
        if venue.get("lat") is not None and venue.get("lng") is not None
    ]
    if dataset.get("mappedCount") != len(mapped):
        errors.append("mappedCount does not match mapped venues")
    if len({venue["id"] for venue in venues}) != len(venues):
        errors.append("venue IDs are not unique")

    for venue in mapped:
        if not (1.15 <= venue["lat"] <= 1.48 and 103.58 <= venue["lng"] <= 104.12):
            errors.append(f"{venue['name']} is outside the Singapore map bounds")

    for venue in venues:
        for forbidden_field in FORBIDDEN_PUBLIC_FIELDS:
            if forbidden_field in venue:
                errors.append(
                    f"{venue['name']} exposes forbidden field {forbidden_field}"
                )
        if SENSITIVE_PUBLIC_TEXT.search(venue.get("publicNote", "")):
            errors.append(f"{venue['name']} exposes commercial or schedule text")
        for space in venue.get("spaces", []):
            if re.search(r"\bafter[- ]hours\b", space.get("name", ""), re.IGNORECASE):
                errors.append(f"{venue['name']} exposes schedule text in a space name")
            if SENSITIVE_PUBLIC_TEXT.search(space.get("note", "")):
                errors.append(f"{venue['name']} exposes commercial or schedule notes")
            if NON_ENGLISH_OR_CORRUPT.search(space.get("note", "")):
                errors.append(f"{venue['name']} exposes non-English or corrupt space notes")
        if venue.get("dataConfidence") not in {"high", "medium", "limited"}:
            errors.append(f"{venue['name']} has an invalid data confidence value")
        if venue.get("lastVerified") != dataset.get("generatedAt"):
            errors.append(f"{venue['name']} has a stale verification date")
        if venue.get("maxCapacity") and not venue.get("capacityBasis"):
            errors.append(f"{venue['name']} is missing the capacity basis")
        image = venue.get("image")
        if image and not (ROOT / "public" / image.lstrip("/")).is_file():
            errors.append(f"{venue['name']} references a missing image")
        website = (venue.get("website") or "").strip()
        if website:
            parsed = urlparse(website if "://" in website else f"https://{website}")
            if parsed.scheme not in {"http", "https"} or "." not in parsed.netloc:
                errors.append(f"{venue['name']} has an invalid website")

    venues_by_name = {venue["name"]: venue for venue in venues}
    for name, postcode in EXPECTED_POSTCODES.items():
        venue = venues_by_name[name]
        address_postcodes = re.findall(r"\b\d{6}\b", venue.get("address", ""))
        if postcode not in address_postcodes:
            errors.append(f"{name} does not expose postcode {postcode}")

    vercel_config = (ROOT / "vercel.json").read_text(encoding="utf-8")
    if '"/singapore-event-venue-finder/"' not in vercel_config:
        errors.append("Vercel trailing-slash route is missing")
    if '"/singapore-event-venue-finder"' not in vercel_config:
        errors.append("Vercel non-trailing-slash route is missing")

    llms_text = (ROOT / "public" / "llms.txt").read_text(encoding="utf-8")
    expected_counts = (
        f"{dataset['publicCount']} curated public Singapore venue records and "
        f"{dataset['mappedCount']} mapped markers"
    )
    if expected_counts not in llms_text:
        errors.append("llms.txt venue counts are stale")

    expected_og_url = "https://actcreative.net/og/singapore-event-venue-finder.png"
    if not OG_PATH.is_file():
        errors.append("Dedicated venue finder Open Graph image is missing")
    if expected_og_url not in page_html:
        errors.append("Venue finder page does not reference the dedicated Open Graph image")
    if '"@type": "FAQPage"' in page_html:
        errors.append("Deprecated FAQPage structured data is still present")
    if '<link rel="canonical" href="https://actcreative.net/singapore-event-venue-finder/"' not in page_html:
        errors.append("Venue finder canonical URL is missing")
    if f'"dateModified": "{dataset["generatedAt"]}"' not in page_html:
        errors.append("Structured data dateModified is stale")
    if "100+ Venues" not in page_html:
        errors.append("Venue finder title does not use the maintainable 100+ count")
    if "What the venue information means" not in page_html:
        errors.append("Venue finder data methodology section is missing")
    public_data_text = DATA_PATH.read_text(encoding="utf-8")
    for invalid_name in {"Far East Hotel", "Plume Singapore Flyer", "LINO Forum"}:
        if invalid_name in public_data_text:
            errors.append(f"Unverified venue placeholder is still public: {invalid_name}")

    sitemap_text = (ROOT / "public" / "sitemap.xml").read_text(encoding="utf-8")
    for slug in SEO_GUIDE_SLUGS:
        guide_path = (
            ROOT / "public" / "singapore-event-venues" / slug / "index.html"
        )
        if not guide_path.is_file():
            errors.append(f"SEO venue guide is missing: {slug}")
            continue
        guide_html = guide_path.read_text(encoding="utf-8")
        canonical = f"https://actcreative.net/singapore-event-venues/{slug}/"
        if canonical not in guide_html:
            errors.append(f"SEO venue guide canonical is missing: {slug}")
        if canonical not in sitemap_text:
            errors.append(f"SEO venue guide is missing from sitemap: {slug}")
        if f'"/singapore-event-venues/{slug}/"' not in vercel_config:
            errors.append(f"SEO venue guide Vercel route is missing: {slug}")

    finder_entry = re.search(
        r"<url>\s*<loc>https://actcreative\.net/singapore-event-venue-finder/</loc>"
        r"(?P<body>.*?)</url>",
        sitemap_text,
        re.DOTALL,
    )
    if not finder_entry:
        errors.append("Venue finder sitemap entry is missing")
    else:
        finder_body = finder_entry.group("body")
        if f"<lastmod>{dataset['generatedAt']}</lastmod>" not in finder_body:
            errors.append("Venue finder sitemap lastmod is stale")
        if expected_og_url not in finder_body:
            errors.append("Venue finder sitemap does not include the dedicated Open Graph image")

    if errors:
        raise SystemExit("\n".join(f"- {error}" for error in errors))
    print(f"validated {len(venues)} venues and {len(mapped)} mapped markers")


if __name__ == "__main__":
    main()
