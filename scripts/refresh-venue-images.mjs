import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = path.join(
  ROOT,
  "public",
  "singapore-event-venue-finder",
  "venue-data.json",
);
const IMAGE_DIR = path.join(
  ROOT,
  "public",
  "singapore-event-venue-finder",
  "assets",
  "venues",
);
const SOURCE_MANIFEST_PATH = path.join(
  ROOT,
  "scripts",
  "cache",
  "venue-image-sources.json",
);

const replacements = {
  "fort-canning-park": {
    sourcePage:
      "https://www.nparks.gov.sg/visit/parks/fort-canning-park/amenities/venues-booking",
    assetUrl:
      "https://www.nparks.gov.sg/images/default-source/parks-img/fort-canning-park/fort-canning-park-heritage-walk-hero-centre.jpg",
  },
  "ocbc-square": {
    sourcePage: "https://www.thekallang.com.sg/venues-facilities/ocbc-square",
    assetUrl:
      "https://www.thekallang.com.sg/sites/default/files/styles/convert_webp/public/2022-08/OCBC%20Square%20Header%20Banner%201784x675_.png.webp?itok=oKhZCV6f",
  },
  "artscience-museum": {
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:ArtScience_Museum,_Marina_Bay_Sands,_Singapore.jpg",
    assetUrl:
      "https://upload.wikimedia.org/wikipedia/commons/f/f3/ArtScience_Museum%2C_Marina_Bay_Sands%2C_Singapore.jpg",
    imageMode: "reference",
  },
  "national-museum-of-singapore": {
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:National_Museum_Singapore.jpg",
    assetUrl:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/National_Museum_Singapore.jpg",
    imageMode: "reference",
  },
  arden: {
    sourcePage: "https://www.1-arden.sg/",
    assetUrl:
      "https://www.1-arden.sg/wp-content/uploads/2022/10/W6A1801.jpg",
  },
  "universal-studios-singapore": {
    sourcePage: "https://www.rwsentosa.com/en/meetings/event-venues",
    assetUrl:
      "https://www.rwsentosa.com/-/jssmedia/project/mice/uss-new-york-street-wide-shoot-banquet-2nd-angle.jpg?h=529&iar=0&w=800&rev=3b8cda92fcee4f7aa6be6cc77675e384&sc_lang=en&extension=webp&hash=2A967805A472C917D16C2E8263FF26A3",
  },
  "adventure-cove-waterpark": {
    sourcePage: "https://www.rwsentosa.com/en/meetings/event-venues",
    assetUrl:
      "https://www.rwsentosa.com/-/jssmedia/project/mice/acw.jpg?h=1235&iar=0&w=2031&rev=3fe434be9ab741e0b8f7b84697e2450a&sc_lang=en&extension=webp&hash=38354BF1F386F3AB089CEC3CD4D71190",
  },
  "singapore-oceanarium": {
    sourcePage: "https://www.rwsentosa.com/en/meetings/event-venues",
    assetUrl:
      "https://www.rwsentosa.com/-/jssmedia/project/mice/sgo-ocean-gallery_ooh-wedding-venue_rws7_v1.jpg?h=5584&iar=0&w=8368&rev=d9507c59852042fa9908eb0af25c640f&sc_lang=en&extension=webp&hash=6612E159A681109E0ABDB6194CB438D9",
  },
  "hotel-michael": {
    sourcePage: "https://www.rwsentosa.com/en/stay/hotel-michael",
    assetUrl:
      "https://www.rwsentosa.com/-/jssmedia/project/stay/hotel-michael/deluxe-room---main.jpg?mw=1000",
  },
  "hotel-ora": {
    sourcePage: "https://www.rwsentosa.com/en/meetings/event-venues",
    assetUrl:
      "https://www.rwsentosa.com/-/jssmedia/project/mice/hotel-ora-1.jpg?h=2254&iar=0&w=3354&rev=fce2062d642b44c6baeddc96eb5b7e02&sc_lang=en&extension=webp&hash=0DCCBD561B9ADE761D4F72B84194784D",
  },
  "equarius-ballroom": {
    sourcePage: "https://www.rwsentosa.com/en/meetings/event-venues",
    assetUrl:
      "https://www.rwsentosa.com/-/jssmedia/project/mice/equarius-ballroom.jpg?h=534&iar=0&w=800&rev=d36a3cfcd8f3476380f7b008a53ba311&sc_lang=en&extension=webp&hash=BCAD137B56B6C92803AD2367300FDBEE",
  },
  "gardens-by-the-bay": {
    sourcePage: "https://www.gardensbythebay.com.sg/",
    assetUrl:
      "https://gardensbythebay.com.sg/content/dam/gbb-2021/image/things-to-do/attractions/supertree-grove/main/supertree-grove-main.jpg",
  },
  "cloud-9-piazza": {
    sourcePage: "https://www.jewelchangiairport.com/en/venue-hire.html",
    assetUrl:
      "https://www.jewelchangiairport.com/content/dam/jca-project/venue-hire/CAG/1.%20Thumbnail%20Cloud9.jpg",
  },
  "marina-barrage": {
    sourcePage:
      "https://www.pub.gov.sg/public/places-of-interest/marina-barrage",
    assetUrl:
      "https://www.pub.gov.sg/-/media/PUB/Hero/Marina-Barrage.webp?iar=0&hash=C659B7A427BDA1AA63544CB5F9997A39",
  },
  "suntec-convention-centre": {
    sourcePage: "https://www.suntecsingapore.com/",
    assetUrl:
      "https://images.squarespace-cdn.com/content/v1/5f4f52b9fa39ac5601ac576c/1608086032875-XJJ71RCKAHA8ZWKR4R7K/Suntec-Exterior_MG_7931_compressed.jpg?format=2500w",
  },
  "zouk-singapore": {
    sourcePage: "https://zoukgroup.com/singapore/",
    assetUrl:
      "https://zoukgroup.com/singapore/wp-content/uploads/sites/2/2023/12/zoukslide.jpg",
  },
  "the-star-performing-arts-centre": {
    sourcePage: "https://www.thestar.sg/the-star-theatre",
    assetUrl:
      "https://cdn.prod.website-files.com/66cec74af3946cea8511d099/6704cf5e156a64ece7c929b8_Box-Seat.jpg",
  },
  "esplanade-theatres-on-the-bay": {
    sourcePage:
      "https://www.esplanade.com/visit-esplanade/venues-and-spaces/venues/concert-hall",
    assetUrl:
      "https://www.esplanade.com/-/media/Esplanade/Images/S-50-Concert-Hall/concert-hall-01.ashx?rev=c0eacdc2041947b79226026afdad05a4&extension=webp&hash=73F90FCE8DD2C5DCFBDEEFF745AC969C",
  },
  "tanjong-beach": {
    sourcePage:
      "https://www.sentosa.com.sg/en/things-to-do/attractions/tanjong-beach/",
    assetUrl:
      "https://www.sentosa.com.sg/-/media/sentosa/product-listing/product-card/attractions/tanjongbeachhero.jpg?revision=9fe1ad9f-2e59-47b1-8a7b-34359dfe260d",
  },
  "tanjong-beach-club": {
    sourcePage: "https://www.tanjongbeachclub.com/",
    assetUrl:
      "https://static1.squarespace.com/static/636b3818447b22313781931f/t/67e50b0b418ccb3b0f1613a0/1742968221137/Main-Overall_-Orange-Umbrellas-with-Trees-%28Small%29.jpg?format=1500w",
  },
  "the-capitol-kempinski": {
    sourcePage: "https://www.kempinski.com/en/the-capitol-singapore",
    assetUrl:
      "https://storage.kempinski.com/cdn-cgi/image/w=1920,f=auto,fit=scale-down/ki-cms-prod/images/2/7/9/9/279972-1-eng-GB/2209eb52bf89-74208946_4K.jpg",
  },
  "parkroyal-collection-pickering": {
    sourcePage:
      "https://www.panpacific.com/en/hotels-and-resorts/pr-collection-pickering.html",
    assetUrl:
      "https://www.panpacific.com/content/dam/pphg-revamp/en/prsps/prc-2-0/homepage/PRSPS_Facade_Image.jpg",
  },
  sensoryscape: {
    sourcePage:
      "https://www.sentosa.com.sg/en/things-to-do/attractions/sensoryscape",
    assetUrl:
      "https://www.sentosa.com.sg/-/media/sentosa/hero-asset/attractions/sensoryscape/tactile-trellis-26.jpg?revision=c8858cb1-4c29-4f68-9297-b047cf364fbf",
  },
  "1-altitude-coast": {
    sourcePage: "https://1-altitudecoast.sg/",
    assetUrl:
      "https://1-altitudecoast.sg/wp-content/uploads/2025/08/Manifest-1AltitudeCoast-35-e1717670224707-1.jpg",
  },
  "capella-singapore": {
    sourcePage: "https://capellahotels.com/en/capella-singapore",
    assetUrl:
      "https://capellahotels.com/assets/img/site_images/singapore/singapore-home01.jpg",
  },
  "four-seasons-hotel-singapore": {
    sourcePage: "https://www.fourseasons.com/singapore/meetings-and-events/",
    assetUrl:
      "https://www.fourseasons.com/alt/img-opt/~65.3402.0,0000-312,5000-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/SIN/SIN_1805_original.jpg",
  },
  "orchard-hotel-singapore": {
    sourcePage:
      "https://www.millenniumhotels.com/en/meetings-events/asia/singapore/orchard-hotel-singapore/",
    assetUrl:
      "https://www.millenniumhotels.com/mhb-media/regions/asia/siingapore/orchardhotelsingapore/mice/images/orchard-grand-ballroom.jpg?rev=a837e526095043e7aa75cb97a628a2e6",
  },
  "oasia-resort-sentosa": {
    sourcePage:
      "https://www.oasiahotels.com/en/singapore/hotels/oasia-resort-sentosa",
    assetUrl:
      "https://www.oasiahotels.com/globalassets/media-library/stayfareast/images/hotels/orsfe/masthead/fehw_orsh_gallery1.jpg",
  },
  "the-barracks-hotel-sentosa": {
    sourcePage: "https://www.thebarrackshotel.com.sg/",
    assetUrl:
      "https://www.thebarrackshotel.com.sg/globalassets/media-library/stayfareast/images/hotels/tbh/masthead/fehw_tbh_gallery_1.jpg",
  },
  "stpi-creative-workshop": {
    sourcePage: "https://www.stpi.com.sg/about",
    assetUrl:
      "https://cdn.sanity.io/images/1z28tiu4/production/6ad6eb6c8dadf1033c3d8a170677b23d18fdacf7-1500x1001.jpg?h=1001&w=1500&fx=200&fit=max&q=80",
  },
  "padang-deck": {
    sourcePage: "https://www.monti.sg/",
    assetUrl:
      "https://www.monti.sg/wp-content/uploads/2025/01/Monti-website-hero-image-rooftop-solemnization.jpg",
  },
  "old-parliament-house": {
    sourcePage: "https://www.artshousegroup.sg/tah",
    assetUrl:
      "https://www.artshousegroup.sg/images/venues/2025/tah/main-tah-banner.png",
  },
  "changi-experience-studio": {
    sourcePage:
      "https://www.jewelchangiairport.com/en/attractions/ces.html",
    assetUrl:
      "https://www.jewelchangiairport.com/content/dam/jca-project/venue-hire/CAG/4.%20Amazing%20Runway_new.JPG",
  },
  "ifly-singapore": {
    sourcePage: "https://altitudex.com/sg/",
    assetUrl:
      "https://altitudex.com/sg/wp-content/uploads/2025/11/Product-images-3334-x-2030px-5-scaled.jpg",
  },
  "marquee-singapore": {
    sourcePage:
      "https://www.marinabaysands.com/nightlife/marquee-singapore.html",
    assetUrl:
      "https://www.marinabaysands.com/content/dam/marinabaysands/nightlife/marquee-masthead-1920x823.jpg",
  },
  "singapore-chinese-cultural-centre": {
    sourcePage: "https://singaporeccc.org.sg/venue-hire/",
    assetUrl:
      "https://cdn.singaporeccc.org.sg/sccc/uploads/2020/11/191125IMG_7359-scaled.jpg",
  },
  "ps-cafe-harding-road": {
    sourcePage: "https://www.pscafe.com/pscafe-at-harding-road",
    assetUrl:
      "https://images.squarespace-cdn.com/content/v1/5326c064e4b011eeaa057a38/1465182549069-VAWFO7DY6W9GAVBPLRP7/web1+copy.jpg?format=2500w",
  },
  "resorts-world-ballroom": {
    sourcePage: "https://www.rwsentosa.com/en/meetings/event-venues",
    assetUrl:
      "https://www.rwsentosa.com/-/jssmedia/project/mice/mice1375_2026micesaleskit_ccballroom_sideangle.jpg?h=2752&iar=0&w=4128&rev=8c048e410253442a86699e38f1113516&sc_lang=en&extension=webp&hash=B5ADB281BF021F80119D6FF89580D35F",
  },
  "resorts-world-convention-centre": {
    sourcePage: "https://www.rwsentosa.com/en/meetings/event-venues",
    assetUrl:
      "https://www.rwsentosa.com/-/jssmedia/project/mice/convention-centre-level-1-function-spaces.jpg?h=5043&iar=0&w=7557&rev=c04276fc41ee42d8becee699e48a5925&sc_lang=en&extension=webp&hash=A6903311CD2C8A4BD0A8693D3069367C",
  },
  "sands-theatre-mbs": {
    sourcePage:
      "https://sg.news.yahoo.com/sands-theatre-at-marina-bay-sands-to-welcome-guests-again-with-back-to-live-concerts-070922415.html",
    assetUrl:
      "https://s.yimg.com/ny/api/res/1.2/pwvO0vXAtrF1gerClJ9EXA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD04MDA7Y2Y9d2VicA--/https://s.yimg.com/os/creatr-uploaded-images/2020-12/a961b5d0-3dda-11eb-b57e-8751245e7316",
    imageMode: "reference",
  },
  "quayside-isle": {
    sourcePage:
      "https://axisarch.com.sg/axis-architecture/quayside-isle-sentosa-cove",
    assetUrl: "https://axisarch.com.sg/wp-content/uploads/2021/08/1-8.jpg",
    imageMode: "reference",
  },
  "wheeler-s-estate": {
    sourcePage: "https://danielfooddiary.com/2016/12/22/wheelersestate/",
    assetUrl:
      "https://danielfooddiary.com/wp-content/uploads/2016/12/wheelersestate14.jpg",
    imageMode: "reference",
  },
  "singapore-marriott-tang-plaza-hotel": {
    sourcePage:
      "https://www.marriott.com/en-us/hotels/sindt-singapore-marriott-tang-plaza-hotel/photos/",
    assetUrl:
      "https://cache.marriott.com/is/image/marriotts7prod/sindt-exterior-0113:Wide-Hor?wid=1336&fit=constrain",
  },
  "foc-sentosa": {
    sourcePage:
      "https://www.sentosa.com.sg/en/things-to-do/dining/foc-sentosa/",
    assetUrl:
      "https://www.sentosa.com.sg/-/media/sentosa/hero-asset/dining/foc-sentosa/foc-by-the-beach_outdoor.jpg",
  },
  "goodwood-park-hotel": {
    sourcePage: "https://www.goodwoodparkhotel.com/",
    assetUrl:
      "https://image-tc.galaxy.tf/wijpeg-b2i0p8092elleypqbji8kbijc/goodwood-park-hotel-facade-2015.jpg?width=1200",
  },
  "lazarus-island": {
    sourcePage: "https://en.wikipedia.org/wiki/Lazarus_Island",
    assetUrl:
      "https://upload.wikimedia.org/wikipedia/commons/9/95/Lazarus_Island_Beach_%282023%29.jpg",
    imageMode: "reference",
  },
  "village-hotel-sentosa": {
    sourcePage:
      "https://www.villagehotels.asia/en/hotels/village-hotel-sentosa",
    assetUrl:
      "https://www.villagehotels.asia/globalassets/media-library/stayfareast/images/village/hotels/vhs2/masthead/vhw-vhs-masthead-gallery-1_new.jpg",
  },
  "coastes-sentosa": {
    sourcePage: "https://www.coastes.com/",
    assetUrl:
      "https://www.coastes.com/wp-content/uploads/2022/06/Coastes-Deck-2013@2x-1.jpg",
  },
  trapizza: {
    sourcePage:
      "https://www.shangri-la.com/singapore/rasasentosaresort/dining/restaurants/trapizza/",
    assetUrl:
      "https://sitecore-cd.shangri-la.com/-/media/Shangri-La/singapore_rasasentosaresort/dining/restaurants/Trapizza/250625_SEN_Trapizza_Banner_1920x500.jpg",
  },
  southside: {
    sourcePage:
      "https://www.1000meetings.com.sg/meeting-destination/31596/southside-sentosa/",
    assetUrl:
      "https://static.1000meetings.com/images/venue/31596/original_whatsapp-image-2023-02-21-at-18.35.35.jpg",
    imageMode: "reference",
  },
  "mykonos-on-the-bay": {
    sourcePage:
      "https://eatbook.sg/quayside-isle-sentosa-cove-restaurants/",
    assetUrl:
      "https://eatbook.sg/wp-content/uploads/2024/06/Mykonos-On-The-Bay.jpg",
    imageMode: "reference",
  },
  "the-outpost-hotel-sentosa": {
    sourcePage:
      "https://www.theoutposthotel.com.sg/en/amenities/pool-deck",
    assetUrl:
      "https://www.theoutposthotel.com.sg/globalassets/media-library/stayfareast/images/outpost/amenities/desktop/amenities-detail-masthead_1920_pool-deck.jpg",
  },
  "equarius-villas": {
    sourcePage: "https://www.rwsentosa.com/en/stay/equarius-villas",
    assetUrl:
      "https://www.rwsentosa.com/-/jssmedia/project/non-gaming/rwsentosa/hotels/beach-villas/room-type/bv-swimming-pool---750x422.jpg?h=422&iar=0&w=750&rev=fc90ae99422647228f9b87cf75129113&extension=webp&hash=9EFCCFB96579F003B5ACBFD88721ED8A",
  },
  "raffles-sentosa-singapore": {
    sourcePage:
      "https://luxuryescapes.com/au/partner/raffles-sentosa-singapore/048a3550-7451-495f-964a-d9ad09a11d2d",
    assetUrl:
      "https://images.luxuryescapes.com/fl_progressive,q_auto:eco,c_scale,w_650/n90bgd6yzdhjyhlo9p.jpeg",
    imageMode: "reference",
  },
};

const removeIncorrectImages = new Set([
  "plume-singapore-flyer",
  "lino-forum",
  "far-east-hotel",
]);

const REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/136 Safari/537.36",
  Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
};

function shanghaiDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function downloadImage({ assetUrl, sourcePage }) {
  const response = await fetch(assetUrl, {
    redirect: "follow",
    headers: {
      ...REQUEST_HEADERS,
      Referer: sourcePage,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }
  const contentType = response.headers.get("content-type") || "";
  if (
    !contentType.startsWith("image/") &&
    contentType !== "application/octet-stream" &&
    !assetUrl.includes(".ashx")
  ) {
    throw new Error(`unexpected content type: ${contentType || "unknown"}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

async function renderVenueImage(input, outputPath) {
  await sharp(input, { failOn: "warning" })
    .rotate()
    .resize({
      width: 1200,
      height: 750,
      fit: "cover",
      position: "attention",
    })
    .webp({ quality: 82, effort: 6 })
    .toFile(outputPath);
}

async function main() {
  await fs.mkdir(IMAGE_DIR, { recursive: true });
  const dataset = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
  const venueById = new Map(dataset.venues.map((venue) => [venue.id, venue]));
  const requestedIds = new Set(
    process.argv.slice(2).filter((value) => !value.startsWith("-")),
  );
  const selectedReplacements = requestedIds.size
    ? Object.entries(replacements).filter(([id]) => requestedIds.has(id))
    : Object.entries(replacements);
  const unknownIds = [...requestedIds].filter((id) => !replacements[id]);
  if (unknownIds.length) {
    throw new Error(`unknown replacement ids: ${unknownIds.join(", ")}`);
  }

  let manifest = null;
  if (requestedIds.size) {
    try {
      manifest = JSON.parse(await fs.readFile(SOURCE_MANIFEST_PATH, "utf8"));
    } catch {
      manifest = null;
    }
  }
  manifest = {
    auditedAt: shanghaiDate(),
    note: "Venue images verified during the audit. Each record identifies whether the source is official or a third-party reference.",
    replacements: manifest?.replacements || {},
    removedIncorrectImages: [...removeIncorrectImages].sort(),
  };
  if (requestedIds.has("singapore-oceanarium")) {
    delete manifest.replacements["s-e-a-aquarium"];
  }
  if (requestedIds.has("hotel-ora")) {
    delete manifest.replacements["festive-hotel"];
  }
  if (requestedIds.has("equarius-villas")) {
    delete manifest.replacements["beach-villas-rws"];
  }
  const failures = [];

  for (const [id, source] of selectedReplacements) {
    const venue = venueById.get(id);
    if (!venue) {
      failures.push(`${id}: venue not found`);
      continue;
    }
    const outputPath = path.join(IMAGE_DIR, `${id}.webp`);
    try {
      const input = await downloadImage(source);
      await renderVenueImage(input, outputPath);
      venue.image = `/singapore-event-venue-finder/assets/venues/${id}.webp`;
      venue.imageMode = source.imageMode || "official";
      manifest.replacements[id] = {
        name: venue.name,
        sourcePage: source.sourcePage,
        assetUrl: source.assetUrl,
        imageMode: venue.imageMode,
      };
      console.log(`replaced ${id}`);
    } catch (error) {
      failures.push(`${id}: ${error.message}`);
      console.error(`failed ${id}: ${error.message}`);
    }
  }

  if (failures.length) {
    console.error("\nFailures:");
    for (const failure of failures) console.error(`- ${failure}`);
    console.error(
      "Dataset and source manifest were not rewritten because the refresh was incomplete.",
    );
    process.exitCode = 1;
    return;
  }

  if (!requestedIds.size) {
    for (const id of removeIncorrectImages) {
      const venue = venueById.get(id);
      if (!venue) {
        failures.push(`${id}: venue not found for removal`);
        continue;
      }
      venue.image = "";
      venue.imageMode = "location";
      await fs.rm(path.join(IMAGE_DIR, `${id}.webp`), { force: true });
    }
  }

  dataset.generatedAt = shanghaiDate();
  await fs.writeFile(DATA_PATH, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  await fs.writeFile(
    SOURCE_MANIFEST_PATH,
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  console.log(
    `updated ${selectedReplacements.length} verified images; manifest contains ${Object.keys(manifest.replacements).length} replacements`,
  );
}

await main();
