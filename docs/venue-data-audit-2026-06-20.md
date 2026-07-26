# Singapore venue data audit — 20 June 2026

## Scope

Twenty high-visibility venue records were manually reviewed against current official venue, operator, hotel or public-agency pages. The public dataset now separates:

- `official`: a named space and capacity are supported by the reviewed public source;
- `reference`: the venue is confirmed, but a sufficiently clear current capacity was not found;
- `curated`: the broader finder record has not yet received this deeper capacity review.

Commercial terms and availability information remain excluded.

## Result

- 20 featured records reviewed
- 17 official capacity benchmarks
- 3 reference records requiring direct confirmation
- 20 indexable venue detail pages generated
- Conflicting historical figures omitted from reviewed detail-page comparisons

## Reviewed venues

| Venue | Status | Reviewed benchmark |
| --- | --- | --- |
| Marina Bay Sands | Official | Sands Grand Ballroom — 7,000 theatre |
| Gardens by the Bay | Official | The Meadow — 30,000 cocktail |
| The Kallang (Singapore Sports Hub) | Official | National Stadium — 55,000 theatre |
| Universal Studios Singapore | Official | Full attraction event programme — 8,000 maximum |
| Pasir Panjang Power Station | Official | Turbine Hall A — 3,500 cocktail |
| Singapore EXPO | Official | APEX @ EXPO — 7,428 published total |
| The Star Performing Arts Centre | Official | The Star Theatre — 5,000 theatre |
| Resorts World Ballroom | Official | Resorts World Ballroom — 3,620 maximum |
| Suntec Convention Centre | Official | Level 6 Auditorium — 4,200 theatre |
| Hilton Singapore Orchard | Official | Grand Ballroom — 1,000 theatre |
| Science Centre Singapore | Official | Marquee — 800 theatre |
| Shangri-La Singapore | Official | Island Ballroom — 1,400 theatre |
| Singapore Oceanarium | Official | Ocean Gallery — 400 cocktail |
| Esplanade – Theatres on the Bay | Official | Concert Hall — 1,825 theatre |
| The Ritz-Carlton Millenia Singapore | Official | Grand Ballroom — 1,400 theatre |
| ArtScience Museum | Official | Basement 2 Circulation — 250 cocktail |
| The Westin Singapore | Official | Grand Ballroom — 600 theatre |
| Capella Singapore | Reference | Current room chart requires confirmation |
| National Museum of Singapore | Reference | Current venue-rental toolkit requires confirmation |
| Raffles Singapore | Reference | Current room chart requires confirmation |

## Material corrections

- Marina Bay Sands public maximum changed from an unsupported 9,225 record to the official 7,000-seat Sands Grand Ballroom theatre benchmark.
- Universal Studios Singapore now uses the current RWS-published whole-attraction event benchmark of up to 8,000 guests.
- Pasir Panjang Power Station changed from 5,000 to the operator-published 3,500 cocktail capacity for Turbine Hall A.
- Hilton Singapore Orchard changed from 1,500 to the hotel-published 1,000-person Grand Ballroom benchmark.
- Science Centre Singapore changed from 2,000 to the published approximately 800-person Marquee benchmark.
- Singapore Oceanarium replaces the former S.E.A. Aquarium record and uses the current 400-person Ocean Gallery cocktail benchmark.
- ArtScience Museum changed from 1,200 to the published 250-person Basement 2 Circulation standing benchmark.
- The Westin Singapore changed from 1,000 to the current hotel-published 600-person maximum.

The machine-readable review record is maintained in `scripts/cache/featured-venue-audit.json`.
