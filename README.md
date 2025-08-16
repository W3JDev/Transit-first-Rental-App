# Transit‑first Rental App — PRD & Tech Plan (v0.3)

*Last updated: 16 Aug 2025*

## Quickstart

```bash
npm install
cp .env.example .env
npm run db:seed # requires postgres
npm run dev
```

API runs at `http://localhost:4000`, web at `http://localhost:3000`.

## 1) Problem & Vision

**Problem:** Renters (locals, students, expats) struggle to evaluate listings by true access to public transport, safe walkability, deposit terms, transparent pricing, and day‑to‑day livability.

**Vision:** The go‑to rental search that ranks homes by real‑world convenience: proximity to LRT/MRT/Monorail, verified walking times, deposit flexibility, transparent price provenance, safety signals, popularity, reviews, and community context.

---

## 2) Core Objectives (MVP)

1. **Search by station proximity** (LRT/MRT/Monorail) with **true walking time** from station exit to building entrance.
2. **Filters**: walking distance, occupants allowed, price, unit size, pet policy, parking, neighborhood popularity, safety signals, **deposit scheme** (no‑deposit / low‑deposit / standard / negotiable / deposit‑insurance), **deposit amount (months)**, **other terms** (short‑let allowed, utilities included, furnished level), and **foreigner‑friendly attributes** (languages, ID accepted, English lease, visa clarity).
3. **Modes:** walking + public transit (and optional e‑hailing/drive time for comparison).
4. **Listing trust:** cross‑platform deduplication, fake‑listing detection, provenance and price reviews, and community reporting.

---

## 3) Target Users & Jobs‑To‑Be‑Done

* **Commuters**: “Find a place <10 min walk to LRT, safe at night.”
* **Expats/International students**: “English‑friendly agent/landlord, near reliable transit, easy move‑in, clear deposit scheme.”
* **Families**: “Near good schools, quiet, stroller‑safe sidewalks, parking included.”
* **Remote/hybrid workers**: “Quick walk to transit + cafes/coworking.”

---

## 4) Data Sources & Acquisition

### 4.1 Property Listings

* **Partner APIs / data feeds** from property portals/aggregators and agencies.
* **Broker/landlord onboarding** portal with verification (ID + SSM/agency no.).
* **Avoid scraping** unless terms permit; always respect robots.txt and local laws.

### 4.2 Transport & Maps

* **GTFS** (General Transit Feed Spec) for routes, stops, schedules, and station exits where available.
* **OSM (OpenStreetMap)** for paths, sidewalks, crossings, stairs/ramps; building footprints; POIs.
* **Elevation/grade** (optional) for walk difficulty.

### 4.3 Safety & Popularity Signals

* **Safety**: lighting proxies, sidewalks, crossings, hazards, speed limits, crowdsourced walkability, reported incidents.
* **Popularity**: search impressions, saves, viewing‑to‑contact ratio, nearby POIs footfall proxies.

### 4.4 Community & Foreigner‑friendly Signals

* Verified attributes: languages, English lease template, visa/ID acceptance, deposit scheme clarity.
* Area context: international schools, co‑working, expat clinics, etc.

### 4.5 Marketplaces & Social Sources (compliant ingestion)

* **Facebook Marketplace & Groups**: use **Meta Graph API** where permitted and with group/page admin authorization. No scraping of private groups.
* **Other sites**: partner feeds or permitted APIs from property portals. Where HTML is allowed, use headless fetchers with strict rate limits.
* **User‑side capture**: browser clipper, forward‑to‑ingest email/WhatsApp, agent portal with KYC.
* **Provenance**: always store source URL/post ID, timestamp, and snapshot hash for auditability.

---

## 5) Geospatial Pipeline (MVP)

1. **Geocode** listing → building entry point.
2. **Nearest stations**: within 1.5–2.0 km.
3. **Walk routing**: compute **door‑to‑exit** path, include lighting/stairs/gradient.
4. **Cross‑check ETA**: verify against external routing API.
5. **Station coverage score**: combine time, frequency, multi‑line.
6. **Neighborhood boundary**: H3 grid to aggregate safety/popularity.

**Key outputs per listing:**

* `walk_time_min_day`, `walk_time_min_night`
* `distance_m`, `stairs_count`, `gradient_avg`
* `nearest_station_id`, `line_name`, `service_frequency_peak_offpeak`
* `safety_score`, `popularity_score`, `amenity_score`

### 5.1 Price & Terms Parsing + Cross‑Check

* **Extraction**: OCR + NLP over listing text/images to capture **rent**, **deposit scheme**, **terms**.
* **Normalization**: map to `deposit_amount_months` and `deposit_type`.
* **Cross‑check**: compare across dedupe clusters; compute canonical price + **PriceConfidence**.
* **Price history**: timeline of per‑source changes.
* **Reviews**: ingest people reviews with provenance; run sentiment analysis.

---

## 6) Scoring & Ranking

```
TransitScore = w1*min_walk_time_score + w2*freq_score + w3*multi_line_bonus
SafetyScore  = a1*lit_path_ratio + a2*sidewalk_presence + a3*crossings_density
AmenityScore = b1*cafe_grocery + b2*healthcare + b3*school_cowork
TrustScore   = c1*dedupe_conf + c2*image_forensics + c3*platform_reputation + c4*user_reports + c5*price_confidence
Livability   = 0.35*Transit + 0.2*Safety + 0.2*Amenity + 0.25*Trust
```

---

## 7) Foreigner‑friendly — Ethical Implementation

**Definition (non‑discriminatory):** readiness to rent to non‑locals.

* Attributes: language support, English lease, clarity on visas, accepted IDs, upfront fees, move‑in services.
* Display objective attributes; never label “unfriendly”.

---

## 8) Anti‑Fraud & Listing Quality

* **Cross‑platform deduplication** with geocode, phone/email hashes, image hashes.
* **Fake listing heuristics**: price outliers, stock photos, EXIF anomalies, rapid posting.
* **Verification tiers**: Tier 0–3 from basic to trusted.
* **User reporting** with SLA + audit.
* **Price/terms integrity**: maintain per‑source ledger; flag divergence; show screenshots.
* **Review integrity**: detect duplicates/astroturf; weight by reviewer history.

---

## 9) Product UX (MVP flows)

* **Home**: station search; map + list with walk‑time chips, station badges, livability bars.
* **Filters drawer**: walk time, frequency, safety slider, amenities, occupants, pets, **deposit scheme chips**, **deposit amount**, foreigner attributes, budget.
* **Listing page**: route preview, safety/amenity breakdown, verification tier, agent languages, lease/ID accepted, nearby POIs, Q\&A, **price provenance panel** (source logos, timestamps, changes).
* **Compare**: up to 4 listings side‑by‑side.
* **Commute Planner**: user saves workplace/school; app shows fastest, fewest transfers, most reliable routes. Visuals: animated route line, isochrone rings (5/10/15 min), day vs. night toggle, accessibility & rain‑safe paths, morning vs. evening headways.

---

## 10) Tech Stack

* **Backend**: TypeScript/Node (NestJS) or Python (FastAPI).
* **DB**: Postgres + PostGIS; Redis; object storage.
* **Routing/Graphs**: OSMnx/NetworkX or pgRouting.
* **Dataflow**: Airflow/Prefect; dbt; Great Expectations.
* **Search**: OpenSearch/Elastic.
* **Frontend**: Next.js/React + MapLibre/Mapbox GL.
* **Auth & Verification**: OAuth; Doc scan vendor.

---

## 11) Data Model (simplified)

```sql
-- listings
(id PK, provider_id, provider_listing_id, title, description, price,
 beds, baths, sqft, occupants_max, pets_ok, furnished,
 lat, lon, building_entry_geom GEOGRAPHY(Point),
 verification_tier, agent_id, created_at, updated_at)

-- stations
(id PK, name, line, exit_id, lat, lon, gtfs_stop_id)

-- listing_station_metrics
(listing_id FK, station_id FK, distance_m, walk_time_min_day, walk_time_min_night,
 stairs_count, gradient_avg, service_freq_peak, service_freq_offpeak)

-- pricing_provenance
(id PK, listing_id FK, source_name, source_url, source_post_id, captured_at TIMESTAMPTZ,
 price_rm NUMERIC(12,2), deposit_amount_months NUMERIC(4,2), deposit_type TEXT,
 terms JSONB, snapshot_hash TEXT, image_url TEXT)

-- scores
(listing_id FK, transit_score, safety_score, amenity_score, trust_score, livability,
 price_confidence NUMERIC(3,2))

-- attributes_foreigner
(listing_id FK, english_lease bool, languages text[], id_types_accepted text[],
 visa_ok bool, movein_services text[], contact_language text[])

-- reviews
(id PK, listing_id FK NULL, building_id FK NULL, area_h3 TEXT, source_name, source_url,
 captured_at TIMESTAMPTZ, rating NUMERIC(2,1), aspects JSONB, text TEXT, sentiment NUMERIC(3,2))

-- moderation
(listing_id FK, risk_level, dedupe_cluster_id, flags jsonb)
```

---

## 12) APIs (example contracts)

**GET /search**

```
q: station|line|area
filters: {
  walk_time_max, price_min/max, safety_min, freq_min, occupants, pets,
  deposit_scheme_in[], deposit_amount_max_months, other_terms[],
  foreigner_attrs[], amenities[], price_confidence_min
}
return: listings[], each with { basic fields, station chips, walk_time, livability, deposit, price_confidence, provenance[] }
```

**GET /listing/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*:id** → full detail, route steps, score breakdown.

**POST /report** → report listing/area issue.

**POST /listings/import** → partner bulk feed (signed URL).

---

## 13) MVP Rollout Plan (10 weeks)

* **W1–2**: finalize data partnerships; ingest GTFS+OSM; pedestrian graph build.
* **W3–4**: listing ETL; dedupe & risk scoring; station proximity service; baseline scoring.
* **W5–6**: frontend map + search + filters; listing detail; score transparency; reporting.
* **W7**: QA, seed data, performance passes; policy review.
* **W8–10**: beta with users; tune weights; add foreigner & deposit attributes; A/B tests.

---

## 14) Metrics & North Stars

* **Activation:** first search to first save ≤ 5 min.
* **Quality:** fake listing rate < 1%; report resolution < 48h.
* **Trust:** price confidence ≥ 0.7 median.
* **Delight:** NPS > 40; repeat sessions; share rate of comparisons.

---

## 15) Risks & Mitigations

* **Data gaps (lighting/crime):** start with proxies + crowdsourced input.
* **Liability:** disclaimers + transparency.
* **Bias:** attribute‑based filters only; fairness reviews.
* **Marketplaces ingestion:** comply strictly with API/ToS; user‑side capture tools.

---

## 16) Next Steps

1. Confirm first launch geography (e.g., KV/KL).
2. Pick stack (NestJS vs FastAPI) and map SDK.
3. Start GTFS+OSM ingestion + pedestrian graph build.
4. Outreach to listing partners; request Graph API permissions.
5. Build OCR+NLP extractor and provenance ledger; define deposit bands.
6. Ship **Commute Planner** MVP.
7. Enable **price alerts** + review ingestion; add moderation playbooks.

---

## 3) Data Sources & Acquisition

### 3.1 Property Listings

* **Partner APIs/data feeds** from portals/aggregators and agencies (preferred).
* **Broker/landlord onboarding** portal with verification (ID + SSM/agency no.).
* **Respect ToS**: avoid scraping unless explicitly permitted; honor robots.txt; comply with PDPA and platform policies.

### 3.2 Transport & Maps

* **GTFS** for routes, stops, schedules, headways, and station exits (where provided).
* **OpenStreetMap (OSM)** for sidewalks, crossings, stairs/ramps, covered walkways, building entrances.
* **Elevation/grade** for walking difficulty; optional weather layers for rain-safe paths.

### 3.3 Safety & Popularity Signals

* **Safety proxies**: streetlight POIs, sidewalk presence, crossings density, speed limits, reported hazards; community walkability votes (time-of-day).
* **Popularity**: impressions, saves, view→contact ratio; nearby amenity counts/ratings (where licensable).

### 3.4 Community & Foreigner‑friendly Signals

* From listing/agent: languages supported, English lease template, accepted IDs (passport/visa), clarity on visas, move‑in services, deposit options.
* Area context: proximity to international schools, clinics, coworking, language‑friendly services.

### 3.5 Marketplaces & Social Sources (compliant ingestion)

* **Facebook Marketplace & Groups** via **Meta Graph API** where permitted and with page/group admin authorization. **No scraping of private groups** or areas where ToS forbid.
* **User‑side capture** for ad‑hoc posts: (a) browser **clipper** to capture screenshots + text; (b) **forward‑to‑ingest email/WhatsApp**; (c) **agent portal** with KYC.
* Other sites: partner feeds or permitted APIs from property portals; if only HTML and terms allow, use **rate‑limited headless fetchers**.
* **Provenance first**: store source URL/post ID, timestamp, and snapshot (hash + optional image) for audits and takedowns.

---

## 4) Geospatial Pipeline (MVP)

1. **Geocode** listing → building entry (snap to OSM entrance; fallback centroid).
2. **Nearest stations** (LRT/MRT/Monorail): k‑NN within 1.5–2.0 km.
3. **Pedestrian routing** on OSM graph: door→station exit shortest path; penalties for stairs/steep grade; consider covered walkways.
4. **Day vs night** walking variants using lit/unlit edges if available.
5. **Service metrics** from GTFS: frequency (peak/off‑peak), first/last trains, transfer penalties.
6. **Station coverage score**: combine walk time to 1st/2nd nearest stations with service quality.
7. **Neighborhood grid**: H3 aggregation for safety/popularity without doxxing exact points.

**Key outputs per listing:**

* `walk_time_min_day`, `walk_time_min_night`, `distance_m`, `stairs_count`, `gradient_avg`
* `nearest_station_id`, `line_name`, `service_frequency_peak_offpeak`
* `safety_score`, `popularity_score`, `amenity_score`

### 4.1 Price & Terms Parsing + Cross‑Check (Provenance)

* **Extraction**: OCR + NLP over screenshots/descriptions to capture **rent (RM)**, **deposit scheme** (e.g., 0‑deposit, 1+1+0.5), **other terms** (utilities, furnishings), contact.
* **Normalization**: canonicalize to `deposit_amount_months` and `deposit_type` = {`ZERO`,`LOW`,`STANDARD`,`NEGOTIABLE`,`INSURANCE`} (bands configurable per market).
* **Cross‑check**: for deduped clusters, align per‑source price/terms; compute a **canonical price** and **PriceConfidence** weighted by source reputation, recency, agreement.
* **Price history**: maintain per‑source timeline; show drops/rises; alert on sudden changes.
* **Reviews**: ingest building/area/agent **people reviews** from allowed sources; run facet extraction (cleanliness, responsiveness, noise) and sentiment; keep provenance.

---

## 5) Scoring & Ranking (first pass)

```
TransitScore = w1*min_walk_time_score + w2*freq_score + w3*multi_line_bonus
SafetyScore  = a1*lit_path_ratio + a2*sidewalk_presence + a3*crossings_density
AmenityScore = b1*cafe_grocery + b2*healthcare + b3*school_cowork
TrustScore   = c1*dedupe_conf + c2*image_forensics + c3*platform_reputation + c4*user_reports
DepositScore = d1*deposit_amount_band + d2*deposit_type_bonus + d3*terms_friendliness
Livability   = 0.35*Transit + 0.2*Safety + 0.2*Amenity + 0.15*Trust + 0.1*Deposit
```

Weights tuned via A/B tests and user feedback; show all component scores transparently.

---

## 6) “Foreigner‑friendly” — Ethical Implementation

Focus on **objective attributes** only (languages supported, English lease, ID types accepted, visa clarity, move‑in services). Avoid subjective labels; let users filter by attributes. Provide disclosures and feedback channels.

---

## 7) Anti‑Fraud & Listing Quality

* Cross‑platform **deduplication**: geocode + contact hashes + image pHash + price/amenity vectors (DBSCAN/HDBSCAN).
* **Fake‑listing heuristics**: price outliers, stock‑photo detection, EXIF anomalies, floor‑plan mismatch, new accounts with high post velocity.
* **Verification tiers**: T0 Unverified; T1 Identity‑verified; T2 Address‑verified + video walkthrough; T3 **Trusted** (long‑term good standing + user confirmations).
* **User reporting** with SLA; soft‑delete on high‑risk; full audit trail.
* **Price/terms integrity**: maintain per‑source **price ledger**; flag divergence > X%; surface **original screenshots/links**.
* **Review integrity**: detect duplicated/astroturf reviews; weight by reviewer history and cross‑source corroboration.

---

## 8) Product UX (MVP + Commute Planner)

* **Home**: station‑first search (type a station/line), map + list with **walk‑time chips** (e.g., “7 min walk”), station badges, livability bars.
* **Filters drawer**: walk‑time slider; min service frequency; safety slider; amenities toggles; occupants; pets; **deposit scheme chips**; **deposit amount (months)**; **other terms**; foreigner‑friendly attributes; budget; **price confidence** minimum.
* **Listing page**: route preview with step‑by‑step walking map; safety/amenity breakdown; verification tier; agent languages; lease/ID accepted; nearby POIs; community Q\&A; **price provenance** panel.
* **Compare**: up to 4 listings side‑by‑side with normalized scores.
* **Commute Planner**: save workplace/school + target arrival. We propose **fastest / fewest transfers / most reliable** public‑transport routes (LRT/MRT/Monorail + walking). Visuals: animated route ribbon with **segment chips**; **isochrone rings** (5/10/15‑min); **Day vs Night** toggle; **accessibility** (elevators/ramps); **rain‑safe** paths. One‑tap **Morning vs Evening** comparison.

---

## 9) Tech Stack

* **Backend**: TypeScript/Node (NestJS) or Python (FastAPI). Async jobs: BullMQ/Celery. Queue + retry.
* **DB**: Postgres + PostGIS; Redis cache; object storage for media.
* **Routing/Graphs**: OSMnx/NetworkX or pgRouting; pre‑built pedestrian graph tiles.
* **Dataflow**: Airflow/Prefect for ETL; dbt for transforms; Great Expectations for data quality.
* **Search**: OpenSearch/Elasticsearch for text + geo + `function_score` on Livability.
* **Frontend**: Next.js/React + MapLibre/Mapbox GL; Tailwind + shadcn/ui.
* **Auth & Verification**: OAuth (Google/Apple); doc‑scan vendor for KYC.

---

## 10) Data Model (simplified)

```sql
-- listings
(id PK, provider_id, provider_listing_id, title, description, price,
 beds, baths, sqft, occupants_max, pets_ok, furnished,
 lat, lon, building_entry_geom GEOGRAPHY(Point),
 verification_tier, agent_id, created_at, updated_at)

-- stations
(id PK, name, line, exit_id, lat, lon, gtfs_stop_id)

-- listing_station_metrics
(listing_id FK, station_id FK, distance_m, walk_time_min_day, walk_time_min_night,
 stairs_count, gradient_avg, service_freq_peak, service_freq_offpeak)

-- pricing_provenance
(id PK, listing_id FK, source_name, source_url, source_post_id, captured_at TIMESTAMPTZ,
 price_rm NUMERIC(12,2), deposit_amount_months NUMERIC(4,2), deposit_type TEXT,
 terms JSONB, snapshot_hash TEXT, image_url TEXT)

-- scores
(listing_id FK, transit_score, safety_score, amenity_score, trust_score, deposit_score, livability,
 price_confidence NUMERIC(3,2))

-- attributes_foreigner
(listing_id FK, english_lease bool, languages text[], id_types_accepted text[],
 visa_ok bool, movein_services text[], contact_language text[])

-- reviews
(id PK, listing_id FK NULL, building_id FK NULL, area_h3 TEXT, source_name, source_url,
 captured_at TIMESTAMPTZ, rating NUMERIC(2,1), aspects JSONB, text TEXT, sentiment NUMERIC(3,2))

-- moderation
(listing_id FK, risk_level, dedupe_cluster_id, flags jsonb)
```

---

## 11) APIs (example contracts)

**GET /search**

```
q: station|line|area
filters: {
  walk_time_max, price_min/max, safety_min, freq_min, occupants, pets,
  deposit_scheme_in[], deposit_amount_max_months, other_terms[],
  foreigner_attrs[], amenities[], price_confidence_min
}
return: listings[], each with {
  basic fields, station chips, walk_time, livability, deposit,
  price_confidence, provenance[]
}
```

**GET /listing/\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*:id** → full detail (route steps, score breakdown, provenance, reviews).

**POST /report** → report listing/area issue with evidence.

**POST /listings/import** → partner bulk feed (signed URL) with schema validation.

---

## 12) MVP Rollout Plan (8–10 weeks)

* **W1–2**: finalize data partnerships; ingest GTFS + OSM; build pedestrian graph tiles; baseline geocoder.
* **W3–4**: listing ETL; dedupe & risk scoring; station proximity service; price/terms extractor + provenance ledger.
* **W5–6**: frontend map + search + filters; listing detail; score transparency; reporting; **Commute Planner v1**.
* **W7**: QA, seed data, performance passes; legal/policy review for disclosures.
* **W8–10**: beta with power users; tune weights; add foreigner‑friendly attributes; A/B on rankers; price alerts.

---

## 13) Metrics & North Stars

* **Activation**: first search→first save ≤ 5 min; station‑search CTR > 30%.
* **Quality**: fake‑listing rate < 1%; avg report resolution < 48h; route ETA error < ±12%; **price\_confidence** median ≥ 0.8.
* **Delight**: NPS > 40; repeat sessions/7 days; comparison share‑rate.

---

## 14) Risks & Mitigations

* **Data gaps (lighting/crime)**: start with crowdsourced walkability + proxies; clearly label confidence.
* **Liability**: disclaimers + source citations; avoid absolute safety claims; provide emergency links.
* **Policy/ToS**: enforce compliant ingestion; fast takedowns; provenance for audits.
* **Bias**: attribute‑based filters only; fairness review; remove problematic signals.

---

## 15) Next Steps

1. Confirm launch geography (e.g., KV/KL).
2. Pick stack (NestJS vs FastAPI) and map SDK.
3. Begin GTFS+OSM ingestion + pedestrian graph build.
4. Secure 2–3 partner listing feeds **and** request Meta Graph API permissions for Marketplace/Groups with admin consent.
5. Ship OCR+NLP **price/terms extractor** + provenance ledger; define deposit bands.
6. Release **Commute Planner v1** (workplace save, route variants, isochrones).
7. Enable **price change alerts**, review ingestion, and moderation playbooks.
