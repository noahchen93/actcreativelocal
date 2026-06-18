#!/usr/bin/env python3
"""Build the public Singapore venue finder dataset.

The source workbook and visual catalog contain internal commercial details.
This exporter publishes only planning-safe fields: venue identity, public
capacity signals, space names, multi-dimensional tags, coordinates and one
compressed reference image per venue.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import time
import urllib.parse
import urllib.request
from io import BytesIO
from pathlib import Path
from typing import Any, Iterable

import openpyxl
from PIL import Image, ImageOps


HEADERS = [
    "category",
    "venue",
    "alias",
    "address",
    "space",
    "area_sqm",
    "ceiling_m",
    "banquet",
    "cocktail",
    "theatre",
    "classroom",
    "price",
    "minimum_spend",
    "hours",
    "website",
    "image",
    "suggested_types",
    "notes",
]

FALLBACK_IMAGES = {
    "hotel": "/singapore-event-venue-sourcing/assets/venue-ritz-interior.webp",
    "restaurant": "/singapore-event-venue-sourcing/assets/venue-clifford-pier-event-setup.webp",
    "outdoor": "/singapore-event-venue-sourcing/assets/venue-fort-canning-green.webp",
    "waterfront": "/singapore-event-venue-sourcing/assets/venue-sports-hub-waterfront.webp",
    "conference": "/singapore-event-venue-sourcing/assets/venue-joaquim-hall.webp",
    "default": "/singapore-event-venue-sourcing/assets/venue-clifford-pier-foyer.webp",
}

AREA_RULES = [
    ("Sentosa", ["sentosa", "siloso", "palawan", "tanjong beach", "cove way", "ocean way", "artillery avenue", "rws", "resorts world"]),
    ("Marina Bay", ["bayfront", "marina bay", "marina gardens", "raffles avenue", "raffles boulevard", "fullerton", "clifford pier", "collyer quay", "temasek boulevard"]),
    ("Orchard / Tanglin", ["orchard", "scotts", "tanglin", "cuscaden", "claymore", "orange grove", "harding road", "dempsey"]),
    ("CBD / Tanjong Pagar", ["raffles place", "shenton", "tanjong pagar", "maxwell", "telok ayer", "wallich", "market street", "marina boulevard", "straits boulevard"]),
    ("City Hall / Civic District", ["city hall", "stamford", "bras basah", "victoria street", "north bridge", "beach road", "empress place", "st andrew", "armenian street", "old parliament"]),
    ("Singapore River", ["clarke quay", "river valley", "robertson", "havelock", "kim seng", "the cannery"]),
    ("Changi / Expo", ["changi", "expo", "airport", "tanah merah", "netheravon"]),
    ("Kallang / Sports Hub", ["stadium", "kallang", "tanjong rhu"]),
    ("HarbourFront / South", ["harbourfront", "mount faber", "telok blangah", "pasir panjang", "keppel"]),
    ("One-North / West", ["jurong", "one-north", "science centre", "science park", "buona vista", "vista exchange", "west coast"]),
    ("North / Seletar", ["mandai", "seletar", "admiralty", "woodlands"]),
    ("Central / Novena", ["novena", "balestier", "serangoon", "toa payoh", "bishan", "farrer park"]),
]

EVENT_RULES = [
    ("Product / brand launch", ["产品发布", "品牌发布", "发布会", "新品发布", "product launch", "brand launch", "launch"]),
    ("Corporate event", ["公司年会", "公司活动", "企业活动", "商务活动", "corporate", "mice"]),
    ("Conference / seminar", ["会议", "研讨会", "学术会议", "论坛", "conference", "seminar", "meeting"]),
    ("Gala / dinner", ["晚宴", "婚宴", "宴请", "宴会", "用餐", "gala", "dinner", "banquet"]),
    ("Cocktail / reception", ["鸡尾酒", "招待", "reception", "cocktail", "networking"]),
    ("Wedding", ["婚礼", "求婚", "solemnisation", "wedding"]),
    ("Awards ceremony", ["颁奖", "awards", "award ceremony"]),
    ("Exhibition / immersive", ["展览", "艺术展", "国际展览", "沉浸式", "装置", "exhibition", "immersive", "gallery"]),
    ("Performance / concert", ["音乐会", "音乐节", "演出", "戏剧", "电影首映", "concert", "performance", "premiere"]),
    ("Party / nightlife", ["派对", "dj", "afterparty", "夜店", "生日", "电音", "party", "nightlife"]),
    ("Pop-up / market / activation", ["市集", "快闪", "路演", "品牌体验", "社区活动", "嘉年华", "activation", "roadshow", "pop-up", "market"]),
    ("Team building / family day", ["团建", "家庭日", "儿童活动", "team building", "family day"]),
    ("Sports / active event", ["体育赛事", "高尔夫", "电竞", "水上运动", "sports", "tournament"]),
    ("VIP / private event", ["vip", "私人", "外交", "高端", "国事", "闭门", "包场", "private"]),
]

PROPERTY_RULES = [
    ("Hotel", ["酒店", "hotel"]),
    ("Resort", ["度假", "resort", "sentosa cove"]),
    ("Restaurant / dining", ["餐厅", "restaurant", "dining", "cafe", "lavo", "monti", "atlas", "level33", "claudine", "trapizza"]),
    ("Bar / nightlife", ["bar", "club", "zouk", "marquee", "ce la vi", "afterparty", "dj派对", "夜店"]),
    ("Convention / exhibition", ["convention", "conference centre", "conference center", "expo", "exhibition hall", "会议中心", "会展", "博览中心"]),
    ("Theatre / performance", ["theatre", "theater", "auditorium", "performing arts", "剧院", "表演艺术", "concert hall"]),
    ("Museum / gallery", ["museum", "gallery", "博物馆", "美术馆", "画廊", "arts house", "artscience"]),
    ("Park / garden", ["park", "garden", "lawn", "green", "公园", "花园", "草坪", "sensoryscape"]),
    ("Beach / beach club", ["beach", "siloso", "palawan", "tanjong beach", "海滩"]),
    ("Stadium / arena", ["stadium", "arena", "sports hub", "体育城", "体育馆"]),
    ("Attraction / theme park", ["universal studios", "aquarium", "waterpark", "science centre", "flyer", "skyhelix", "ifly", "experience studio", "attraction", "theme park"]),
    ("Yacht / cruise / marina", ["yacht", "cruise", "royal albatross", "one15 marina", "游艇", "游轮", "码头"]),
    ("Heritage venue", ["heritage", "parliament", "chijmes", "mansion", "warehouse", "clifford pier", "fort canning", "历史", "文化中心"]),
    ("Industrial venue", ["power station", "warehouse", "industrial", "发电站", "工业"]),
    ("Public / civic space", ["square", "piazza", "public", "barrage", "公园", "广场", "堤坝", "island"]),
]

SETTING_RULES = [
    ("Indoor", ["indoor", "ballroom", "hall", "room", "foyer", "gallery", "museum", "theatre", "auditorium", "studio", "室内", "宴会厅", "会议室"]),
    ("Outdoor", ["outdoor", "open-air", "al fresco", "beach", "lawn", "garden", "terrace", "courtyard", "deck", "rooftop", "sensoryscape", "户外", "露天", "草坪", "海滩"]),
    ("Ballroom", ["ballroom", "宴会厅"]),
    ("Meeting rooms", ["meeting", "conference room", "boardroom", "studio", "会议", "研讨"]),
    ("Exhibition hall", ["exhibition hall", "expo hall", "convention hall", "展厅", "会展", "博览"]),
    ("Theatre / auditorium", ["theatre", "theater", "auditorium", "stage", "剧院", "礼堂", "舞台"]),
    ("Gallery / museum", ["gallery", "museum", "artscience", "美术馆", "博物馆", "画廊"]),
    ("Restaurant / bar", ["restaurant", "dining", "bar", "cafe", "餐厅", "酒吧"]),
    ("Garden / lawn", ["garden", "lawn", "green", "park", "courtyard", "花园", "草坪", "公园"]),
    ("Beach", ["beach", "siloso", "palawan", "tanjong beach", "海滩"]),
    ("Waterfront / marina", ["waterfront", "bay", "quay", "pier", "marina", "ocean", "cruise", "水岸", "海景", "码头"]),
    ("Rooftop / high-floor", ["rooftop", "roof deck", "skypark", "level 33", "level 51", "level 55", "high-floor", "高空", "屋顶", "skyhelix"]),
    ("Poolside", ["pool", "泳池"]),
    ("Stadium / arena", ["stadium", "arena", "sports hub", "体育馆"]),
    ("Industrial / raw", ["power station", "warehouse", "industrial", "turbine", "工业", "仓库"]),
    ("Cruise / yacht", ["yacht", "cruise", "ship", "royal albatross", "游艇", "游轮"]),
]

SEARCH_ALIASES = {
    "outdoor": ["户外", "露天", "open air", "al fresco", "garden", "lawn", "beach"],
    "indoor": ["室内", "ballroom", "hall", "room"],
    "hotel": ["酒店", "resort", "ballroom"],
    "restaurant": ["餐厅", "dining", "cafe", "bar"],
    "rooftop": ["屋顶", "高空", "sky", "roof deck"],
    "waterfront": ["水岸", "海景", "bay", "quay", "pier", "marina"],
    "garden": ["花园", "草坪", "park", "lawn"],
    "conference": ["会议", "研讨", "seminar", "meeting"],
    "wedding": ["婚礼", "婚宴", "solemnisation"],
    "party": ["派对", "dj", "afterparty", "nightlife"],
    "launch": ["发布", "品牌发布", "产品发布", "activation"],
    "exhibition": ["展览", "艺术展", "gallery", "museum"],
}

MANUAL_GEOCODES = {
    "cloud 9 piazza": (1.360208, 103.989759),
    "equarius ballroom": (1.256502, 103.818900),
    "joaquim hall": (1.256650, 103.819350),
    "plume singapore flyer": (1.289343, 103.863136),
    "1-atico": (1.304105, 103.831781),
    "padang deck": (1.290744, 103.851733),
    "far east hotel": (1.352100, 103.819800),
    "lino forum": (1.306800, 103.828600),
    "beach villas rws": (1.255850, 103.816000),
    "arden": (1.2842204, 103.8501314),
    "pan pacific singapore": (1.2923514, 103.8586837),
    "black white house": (1.3045547, 103.8089431),
}


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-+", "-", value).strip("-")
    return value or hashlib.sha1(value.encode("utf-8")).hexdigest()[:10]


def clean(value: Any) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    if text.casefold() in {"—", "-", "?", "none", "nan", "n/a", "na"}:
        return ""
    return re.sub(r"\s+", " ", text)


def number(value: Any) -> float | None:
    text = clean(value)
    if not text:
        return None
    match = re.search(r"\d+(?:\.\d+)?", text.replace(",", ""))
    return float(match.group(0)) if match else None


def capacity(value: Any) -> int | None:
    result = number(value)
    return int(result) if result is not None else None


def unique(values: Iterable[str]) -> list[str]:
    return list(dict.fromkeys(value for value in values if value))


def matches_any(haystack: str, needles: Iterable[str]) -> bool:
    lower = haystack.lower()
    for needle in needles:
        term = needle.lower()
        if re.fullmatch(r"[a-z0-9][a-z0-9 .&'/-]*", term):
            pattern = rf"(?<![a-z0-9]){re.escape(term)}(?![a-z0-9])"
            if re.search(pattern, lower):
                return True
        elif term in lower:
            return True
    return False


def infer_area(name: str, address: str) -> str:
    haystack = f"{name} {address}".lower()
    for area, needles in AREA_RULES:
        if any(needle in haystack for needle in needles):
            return area
    return "Other Singapore"


def infer_labels(haystack: str, rules: list[tuple[str, list[str]]]) -> list[str]:
    return [label for label, needles in rules if matches_any(haystack, needles)]


def infer_event_types(raw: str, category: str, name: str, notes: str, spaces: str) -> list[str]:
    labels = infer_labels(f"{raw} {category} {name} {notes} {spaces}", EVENT_RULES)
    return labels or ["Corporate event"]


def infer_property_types(category: str, name: str, alias: str, address: str, spaces: str) -> list[str]:
    identity = f"{category} {name} {alias} {address}"
    labels = infer_labels(identity, PROPERTY_RULES)
    if "酒店" in category and "Hotel" not in labels:
        labels.insert(0, "Hotel")
    if "餐厅" in category and "Restaurant / dining" not in labels:
        labels.insert(0, "Restaurant / dining")
    if matches_any(spaces, ["restaurant", "dining room", "bar", "cafe"]) and "Restaurant / dining" not in labels:
        labels.append("Restaurant / dining")
    if matches_any(spaces, ["theatre", "theater", "auditorium", "concert hall"]) and "Theatre / performance" not in labels:
        labels.append("Theatre / performance")
    if matches_any(spaces, ["gallery", "museum"]) and "Museum / gallery" not in labels:
        labels.append("Museum / gallery")
    if matches_any(spaces, ["exhibition hall", "convention hall"]) and "Convention / exhibition" not in labels:
        labels.append("Convention / exhibition")
    if "south beach" in name.lower() and "sentosa" not in address.lower():
        labels = [label for label in labels if label != "Beach / beach club"]
    return unique(labels or ["Flexible event venue"])


def infer_settings(category: str, name: str, alias: str, address: str, notes: str, spaces: str) -> list[str]:
    labels = infer_labels(f"{category} {name} {alias} {address} {notes} {spaces}", SETTING_RULES)
    if "室内" in category and "Indoor" not in labels:
        labels.insert(0, "Indoor")
    if "户外" in category and "Outdoor" not in labels:
        labels.insert(0, "Outdoor")
    if "Indoor" not in labels and "Outdoor" not in labels:
        labels.insert(0, "Indoor")
    return unique(labels)


def build_search_terms(venue: dict[str, Any], raw_types: str, all_notes: str) -> list[str]:
    source = " ".join(
        [
            venue["name"],
            venue["alias"],
            venue["address"],
            venue["area"],
            raw_types,
            all_notes,
            " ".join(venue["propertyTypes"]),
            " ".join(venue["settings"]),
            " ".join(venue["eventTypes"]),
            " ".join(space["name"] for space in venue["spaces"]),
        ]
    ).lower()
    aliases = []
    for keyword, related in SEARCH_ALIASES.items():
        if keyword in source or any(item.lower() in source for item in related):
            aliases.extend([keyword, *related])
    return unique(clean(item) for item in aliases)


def fallback_image(property_types: list[str], settings: list[str]) -> str:
    combined = " ".join([*property_types, *settings]).lower()
    if "hotel" in combined:
        return FALLBACK_IMAGES["hotel"]
    if "restaurant" in combined or "bar" in combined:
        return FALLBACK_IMAGES["restaurant"]
    if "outdoor" in combined or "garden" in combined or "beach" in combined:
        return FALLBACK_IMAGES["outdoor"]
    if "waterfront" in combined or "marina" in combined:
        return FALLBACK_IMAGES["waterfront"]
    if "conference" in combined or "convention" in combined:
        return FALLBACK_IMAGES["conference"]
    return FALLBACK_IMAGES["default"]


def build_public_note(venue: dict[str, Any]) -> str:
    event_summary = ", ".join(venue["eventTypes"][:3]).lower()
    setting_summary = " + ".join(venue["settings"][:2]).lower()
    cap = f" with a public capacity signal up to about {venue['maxCapacity']:,} pax" if venue["maxCapacity"] else ""
    return f"{setting_summary.capitalize()} option for {event_summary}{cap}. Confirm the exact space, setup rules and current availability before booking."


def read_workbook(path: Path) -> list[dict[str, Any]]:
    workbook = openpyxl.load_workbook(path, read_only=True, data_only=True)
    venues: dict[str, dict[str, Any]] = {}
    for sheet in workbook.worksheets[:3]:
        current = dict.fromkeys(HEADERS, "")
        for row in sheet.iter_rows(min_row=3, values_only=True):
            record = dict(zip(HEADERS, list(row)[: len(HEADERS)]))
            for field in ["category", "venue", "alias", "address", "website", "suggested_types", "hours"]:
                if clean(record.get(field)):
                    current[field] = clean(record.get(field))
            category = clean(record.get("category")) or current["category"]
            venue_name = clean(record.get("venue")) or current["venue"]
            address = clean(record.get("address")) or current["address"]
            if not venue_name or not address:
                continue
            key = f"{category}:{venue_name}".casefold()
            if key not in venues:
                venues[key] = {
                    "id": slugify(venue_name),
                    "name": venue_name,
                    "alias": clean(record.get("alias")) or current["alias"],
                    "category": category,
                    "area": infer_area(venue_name, address),
                    "address": address,
                    "website": clean(record.get("website")) or current["website"],
                    "hours": clean(record.get("hours")) or current["hours"],
                    "rawSuggestedTypes": clean(record.get("suggested_types")) or current["suggested_types"],
                    "spaces": [],
                    "maxCapacity": None,
                    "maxAreaSqm": None,
                    "priceSignal": "Check with venue",
                    "sourceLevel": "Public summary from the internal Singapore venue index",
                    "_notes": [],
                }
            venue = venues[key]
            caps = {
                "banquet": capacity(record.get("banquet")),
                "cocktail": capacity(record.get("cocktail")),
                "theatre": capacity(record.get("theatre")),
                "classroom": capacity(record.get("classroom")),
            }
            space_max = max((value for value in caps.values() if value is not None), default=None)
            area_sqm = number(record.get("area_sqm"))
            note = clean(record.get("notes"))
            if note:
                venue["_notes"].append(note)
            if clean(record.get("price")) or clean(record.get("minimum_spend")):
                venue["priceSignal"] = "Quote direction available"
            if space_max is not None:
                venue["maxCapacity"] = max(venue["maxCapacity"] or 0, space_max)
            if area_sqm is not None:
                venue["maxAreaSqm"] = max(venue["maxAreaSqm"] or 0, int(area_sqm))
            space_name = clean(record.get("space"))
            if space_name:
                venue["spaces"].append(
                    {
                        "name": space_name,
                        "areaSqm": int(area_sqm) if area_sqm is not None else None,
                        "ceilingM": number(record.get("ceiling_m")),
                        **caps,
                        "note": note,
                    }
                )
    output = list(venues.values())
    for venue in output:
        all_notes = " ".join(unique(venue.pop("_notes")))
        space_text = " ".join(f"{space['name']} {space['note']}" for space in venue["spaces"])
        venue["eventTypes"] = infer_event_types(venue["rawSuggestedTypes"], venue["category"], venue["name"], all_notes, space_text)
        venue["propertyTypes"] = infer_property_types(
            venue["category"], venue["name"], venue["alias"], venue["address"], space_text
        )
        venue["settings"] = infer_settings(
            venue["category"], venue["name"], venue["alias"], venue["address"], all_notes, space_text
        )
        identity = f"{venue['name']} {venue['alias']} {venue['address']}".lower()
        if "Hotel" in venue["propertyTypes"] and "Indoor" not in venue["settings"]:
            venue["settings"].insert(0, "Indoor")
        if "south beach" in identity and "sentosa" not in identity:
            venue["settings"] = [label for label in venue["settings"] if label != "Beach"]
        if "Industrial / raw" in venue["settings"] and not matches_any(
            identity, ["power station", "warehouse", "industrial", "发电站", "仓库", "工业"]
        ):
            venue["settings"] = [label for label in venue["settings"] if label != "Industrial / raw"]
        if re.search(r"(?:#|level\s*|l)5[15]\b", identity) and "Rooftop / high-floor" not in venue["settings"]:
            venue["settings"].append("Rooftop / high-floor")
        if venue["name"] in {"Joaquim Hall", "Resorts World Ballroom"} and "Convention / exhibition" not in venue["propertyTypes"]:
            venue["propertyTypes"].append("Convention / exhibition")
        venue["primaryType"] = venue["propertyTypes"][0]
        venue["searchTerms"] = build_search_terms(venue, venue["rawSuggestedTypes"], all_notes)
        venue["image"] = fallback_image(venue["propertyTypes"], venue["settings"])
        venue["publicNote"] = build_public_note(venue)
    return output


def load_visual_catalog(path: Path | None) -> dict[str, list[dict[str, Any]]]:
    if not path or not path.exists():
        return {}
    data = json.loads(path.read_text(encoding="utf-8"))
    return {clean(item.get("name")).casefold(): item.get("visual_assets", []) for item in data.get("venues", [])}


def resolve_visual_path(raw_path: str, source_root: Path) -> Path | None:
    direct = Path(raw_path)
    if direct.exists() and direct.is_file():
        return direct
    normalized = raw_path.replace("\\", "/")
    marker = "/.internal/codex_work/"
    if marker not in normalized:
        return None
    suffix = normalized.split(marker, 1)[1]
    candidate = source_root / ".internal" / "codex_work" / Path(suffix)
    return candidate if candidate.exists() and candidate.is_file() else None


def visual_score(asset: dict[str, Any], path: Path) -> float:
    flags = asset.get("flags") or {}
    score = 0.0
    path_text = str(path).lower()
    if "web_supplement" in path_text:
        score += 140
    elif "extracted_ppt_images" in path_text or "extracted_pdf_images" in path_text:
        score += 100
    elif "source_pages_thumb" in path_text:
        score += 35
    elif "source_pages" in path_text:
        score += 25
    if flags.get("is_title"):
        score -= 80
    if flags.get("is_floorplan"):
        score -= 45
    if flags.get("is_textheavy"):
        score -= 35
    if flags.get("is_menu") or flags.get("is_email"):
        score -= 90
    try:
        with Image.open(path) as image:
            width, height = image.size
        score += min(math.log2(max(width * height, 1)), 24)
        ratio = width / max(height, 1)
        if 1.15 <= ratio <= 2.0:
            score += 14
        elif ratio < 0.55 or ratio > 2.8:
            score -= 10
    except Exception:
        score -= 200
    return score


def render_webp(path: Path) -> bytes:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source)
        if image.mode not in {"RGB", "RGBA"}:
            image = image.convert("RGBA" if "transparency" in image.info else "RGB")
        if image.mode == "RGBA":
            background = Image.new("RGB", image.size, "#111111")
            background.paste(image, mask=image.getchannel("A"))
            image = background
        image.thumbnail((960, 720), Image.Resampling.LANCZOS)
        buffer = BytesIO()
        image.save(buffer, "WEBP", quality=78, method=6)
        return buffer.getvalue()


def export_venue_images(
    venues: list[dict[str, Any]],
    catalog: dict[str, list[dict[str, Any]]],
    source_root: Path,
    output_dir: Path,
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    used_digests: set[str] = set()
    for venue in venues:
        candidates: list[tuple[float, Path]] = []
        for asset in catalog.get(venue["name"].casefold(), []):
            path = resolve_visual_path(clean(asset.get("path")), source_root)
            if path:
                candidates.append((visual_score(asset, path), path))
        candidates.sort(key=lambda item: item[0], reverse=True)
        selected_bytes: bytes | None = None
        for _, path in candidates:
            try:
                image_bytes = render_webp(path)
                digest = hashlib.sha1(image_bytes).hexdigest()
            except Exception:
                continue
            if digest not in used_digests:
                selected_bytes = image_bytes
                used_digests.add(digest)
                break
        if selected_bytes is None:
            venue["image"] = ""
            venue["imageMode"] = "location"
            stale_path = output_dir / f"{venue['id']}.webp"
            stale_path.unlink(missing_ok=True)
            continue
        output_path = output_dir / f"{venue['id']}.webp"
        try:
            output_path.write_bytes(selected_bytes)
            venue["image"] = f"/singapore-event-venue-finder/assets/venues/{output_path.name}"
            venue["imageMode"] = "reference"
        except Exception as exc:  # noqa: BLE001
            console(f"image skipped for {venue['name']}: {exc}")


def load_cache(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8")) if path.exists() else {}


def save_cache(path: Path, cache: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")


def console(text: str) -> None:
    print(text.encode("ascii", "replace").decode("ascii"))


def geocode_queries(venue: dict[str, Any]) -> list[str]:
    return unique(
        [
            venue["address"],
            f"{venue['name']}, Singapore",
            f"{venue['name']}, {venue['area']}, Singapore",
            f"{venue['alias']}, Singapore" if venue["alias"] else "",
        ]
    )


def geocode_cache_key(venue: dict[str, Any]) -> str:
    return hashlib.sha1(" | ".join(geocode_queries(venue)).encode("utf-8")).hexdigest()


def geocode_one(venue: dict[str, Any], cache: dict[str, Any], delay: float) -> None:
    manual = MANUAL_GEOCODES.get(venue["name"].casefold())
    if manual:
        venue.update(
            {
                "lat": manual[0],
                "lng": manual[1],
                "geocodeStatus": "manual_verified",
                "geocodeQuery": venue["name"],
                "geocodeName": venue["address"],
            }
        )
        return
    queries = geocode_queries(venue)
    cache_key = geocode_cache_key(venue)
    cached = cache.get(cache_key)
    if cached:
        venue.update(cached)
        return
    data = {"lat": None, "lng": None, "geocodeStatus": "not_found", "geocodeName": ""}
    try:
        for candidate in queries:
            params = urllib.parse.urlencode(
                {"q": candidate, "format": "json", "limit": "1", "addressdetails": "1", "countrycodes": "sg"}
            )
            request = urllib.request.Request(
                f"https://nominatim.openstreetmap.org/search?{params}",
                headers={"User-Agent": "ACTCreativeVenueFinder/2.0 contact@actcreative.net"},
            )
            with urllib.request.urlopen(request, timeout=20) as response:
                results = json.loads(response.read().decode("utf-8"))
            if results:
                data = {
                    "lat": float(results[0]["lat"]),
                    "lng": float(results[0]["lon"]),
                    "geocodeStatus": "matched",
                    "geocodeQuery": candidate,
                    "geocodeName": results[0].get("display_name", ""),
                }
                break
            time.sleep(delay)
    except Exception as exc:  # noqa: BLE001
        data = {"lat": None, "lng": None, "geocodeStatus": f"error: {exc}", "geocodeName": ""}
    cache[cache_key] = data
    venue.update(data)
    time.sleep(delay)


def apply_cached_coordinates(venue: dict[str, Any], cache: dict[str, Any]) -> bool:
    manual = MANUAL_GEOCODES.get(venue["name"].casefold())
    if manual:
        venue.update(
            {
                "lat": manual[0],
                "lng": manual[1],
                "geocodeStatus": "manual_verified",
                "geocodeQuery": venue["name"],
                "geocodeName": venue["address"],
            }
        )
        return True
    cached = cache.get(geocode_cache_key(venue))
    if cached and cached.get("lat") is not None and cached.get("lng") is not None:
        venue.update(cached)
        return True
    return False


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=Path)
    parser.add_argument("--output", type=Path, default=Path("public/singapore-event-venue-finder/venue-data.json"))
    parser.add_argument("--cache", type=Path, default=Path("scripts/cache/venue-geocodes.json"))
    parser.add_argument("--limit", type=int, default=0, help="0 exports every venue")
    parser.add_argument("--geocode", action="store_true")
    parser.add_argument("--delay", type=float, default=1.05)
    parser.add_argument("--source-root", type=Path)
    parser.add_argument("--visual-catalog", type=Path)
    parser.add_argument("--image-output", type=Path, default=Path("public/singapore-event-venue-finder/assets/venues"))
    args = parser.parse_args()
    venues = read_workbook(args.workbook)
    venues.sort(key=lambda item: (-(item["maxCapacity"] or 0), item["name"]))
    if args.limit > 0:
        venues = venues[: args.limit]
    if args.source_root and args.visual_catalog:
        export_venue_images(venues, load_visual_catalog(args.visual_catalog), args.source_root, args.image_output)
    cache = load_cache(args.cache)
    if args.geocode:
        for index, venue in enumerate(venues, 1):
            console(f"[{index}/{len(venues)}] geocode {venue['name']}")
            geocode_one(venue, cache, args.delay)
            if index % 10 == 0:
                save_cache(args.cache, cache)
        save_cache(args.cache, cache)
    else:
        for venue in venues:
            if not apply_cached_coordinates(venue, cache):
                venue.update({"lat": None, "lng": None, "geocodeStatus": "not_geocoded", "geocodeName": ""})
    mapped = [venue for venue in venues if venue.get("lat") is not None and venue.get("lng") is not None]
    dataset = {
        "generatedAt": time.strftime("%Y-%m-%d"),
        "source": "Internal Singapore venue index, public planning subset",
        "publicCount": len(venues),
        "mappedCount": len(mapped),
        "privacyNote": "Pricing, contacts, live availability and source documents are intentionally withheld from the public dataset.",
        "venues": venues,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(dataset, ensure_ascii=False, indent=2), encoding="utf-8")
    console(f"wrote {args.output} ({len(venues)} venues, {len(mapped)} mapped)")


if __name__ == "__main__":
    main()
