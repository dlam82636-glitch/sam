# MarketSpec — Technical Architecture Document

## Executive Overview
MarketSpec is a text-search web application engineered for researching physical products, materials, industrial items, and architectural specifications, ultimately delivering transparent market price intelligence derived from online sources.

This document outlines the system architecture designed for progressive enhancement across development stages, ensuring clean separation of concerns, pluggable AI/search providers, rigorous validation, and strict data flow discipline.

---

## 1. System Components & Layers

### 1. FRONTEND
* **Framework:** React 19 + TypeScript + Vite.
* **Styling & Design System:** Tailwind CSS v4, Lucide icons, responsive layout with high-contrast typography (Plus Jakarta Sans & JetBrains Mono for specs).
* **State Management:** Reactive component hooks, decoupled state machine for search lifecycle (`idle`, `validating`, `researching`, `complete`, `error`).
* **Boundary:** Strictly presentation and client validation. The frontend consumes an abstracted unified API contract (`/api/research`), remaining agnostic to underlying AI models or search APIs.

### 2. BACKEND (Server Layer)
* **Runtime:** Node.js / Express (server-side proxy routes).
* **Role:**
  * Coordinates the multi-step research pipeline.
  * Enforces rate limiting, session safeguards, and input sanitization.
  * Keeps all third-party API credentials, search tokens, and model parameters securely on the server.
  * Serves structured, validated JSON payloads to the frontend.

### 3. DATABASE & PERSISTENCE LAYER (Prompt 8 Implemented)
* **Architecture:** Repository pattern (`DatabaseRepositoryInterface`) decoupling the database engine from API controllers and business services.
* **Technology:** Relational storage architecture supporting PostgreSQL / Cloud SQL via `DATABASE_URL`, backed by an in-memory relational driver with full referential integrity and foreign key validation.
* **Entities & Tables:**
  1. `searches`: Primary search record with unique UUID, original/normalized query, execution timestamps, status (`processing`, `completed`, `partial`, `failed`, `unavailable`), and reference to final result.
  2. `query_interpretations`: 1:1 relation with parent Search. Stores AI-extracted canonical product name, category, description, brand, model, material, dimensions/specifications, variant categories, prospective search queries, interpretation confidence, and identified gaps/ambiguities.
  3. `research_sources`: 1:N relation with parent Search. Stores normalized supplier listings preserving authentic URLs, seller name, listed price, currency, availability, and retrieval timestamp.
  4. `price_observations`: 1:N relation with Search and optional 1:N relation with Research Source. Stores individual verified price datapoints, original prices/currencies, spec filters, outlier exclusion flags, and variance notes.
  5. `final_search_results`: 1:1 relation with Search. Stores the synthesized median pricing benchmark, observed range bounds (low/high), currency, evidence confidence (`high`, `medium`, `low`), sample size, methodology narrative, and documented limitations.
* **Relational Indexes:**
  * `idx_searches_created_at` on `searches(created_at DESC)`
  * `idx_searches_status` on `searches(status)`
  * `idx_query_interpretations_search_id` on `query_interpretations(search_id)`
  * `idx_research_sources_search_id` on `research_sources(search_id)`
  * `idx_price_observations_search_id` on `price_observations(search_id)`
  * `idx_price_observations_source_id` on `price_observations(source_id)`
  * `idx_final_search_results_search_id` on `final_search_results(search_id)` (Unique constraint)

### 4. AI SERVICE
* **Role:**
  * Understand and parse informal text queries (e.g., "12mm marine plywood") into structured specifications (thickness: 12mm, grade: marine, material: plywood).
  * Generate targeted search queries for commercial suppliers and material distributors.
  * Extract standardized technical specifications and price metrics from unstructured web snippets.
* **Abstraction:** `AIServiceInterface` enabling zero-impact switching between LLM providers (e.g., Google Gemini, Anthropic, or specialized fine-tuned models).

### 5. SEARCH & RESEARCH LAYER
* **Role:**
  * Executes targeted multi-query retrieval across industrial, wholesale, and retail catalog domains.
  * Fetches real web snippets and pricing citations.
* **Abstraction:** `SearchServiceInterface` decoupled from any single engine (Google Search API, SerpAPI, Tavily, Bing).

### 6. PRICING INTELLIGENCE ENGINE
* **Role:**
  * Normalizes units (per sheet, per foot, per metric ton, per unit).
  * Cleans outliers, calculates IQR medians, estimates price distribution (low, median, high).
  * Computes statistical confidence scores based on sample size, source diversity, and spec freshness.
  * Strictly separates verified factual quotes from statistical estimations.

---

## 2. End-to-End Data & Persistence Flow

```text
[ User Query (Text) ]
         │
         ▼
[ Client-Side Validation ] ── (Length 2-200 chars, syntax, prompt shield)
         │
         ▼
[ Server-Side Research Coordinator (POST /api/search) ]
         │
         ├─► [ Step 0: Create Search Record ] ───► searches (status: 'processing')
         │
         ├─► [ Step 1: AI Query Understanding ]
         │       ├─ Extracts intent, canonical name, dimensions, grades, variants.
         │       └─► Persist ───► query_interpretations
         │
         ├─► [ Step 2: Search Query Generation ]
         │       └─ Produces disambiguated commercial keywords for suppliers.
         │
         ├─► [ Step 3: Web Research Retrieval ]
         │       ├─ Queries online sources; collects snippets, URLs, published pricing.
         │       └─► Persist ───► research_sources (authentic URLs preserved)
         │
         ├─► [ Step 4: Normalization & Fact Extraction ]
         │       ├─ Validates units, currencies, and spec matches.
         │       └─► Persist ───► price_observations (original prices/currencies)
         │
         ├─► [ Step 5: Pricing Intelligence & Confidence Scoring ]
         │       ├─ Computes median benchmarks, observed bounds (low/high), confidence.
         │       └─► Persist ───► final_search_results (linked 1:1)
         │
         ├─► [ Step 6: Finalize Search Status ] ───► updates searches (status: 'completed'/'partial')
         │
         ▼
[ Validated Final Payload Response ]
         │
         ▼
[ User Interface Display ] ── (Product specs, price estimate, attribution, assumptions)
```

---

## 3. Error Handling Strategy

1. **Validation Failures (400):** Clear human-friendly messages for empty queries, non-product queries, or unparseable input.
2. **Ambiguous Queries (300/Notice):** When a query could refer to multiple distinct products (e.g., "A55" - phone vs steel grade), the system returns disambiguation suggestions and reports gaps.
3. **Sparse Data / Low Confidence (206):** When insufficient online data is found, the system clearly indicates low confidence and "No reliable market price found" rather than fabricating estimates.
4. **Upstream Service Failures (502/503):** Graceful recovery with circuit-breaker logging; records failure in `searches` table without creating misleading successful records.

---

## 4. Security & Privacy Safeguards

* **Zero Client-Side Secrets:** No API keys, database credentials, or search tokens in frontend bundles.
* **Input Sanitization:** Strict regex sanitization and prompt injection shields prior to AI prompting.
* **Output Grounding:** Output schemas strictly require URL citations and verbatim source evidence before computing any price estimate.
* **Zero Untrusted Scraping Execution:** No client-side scraping or iframe rendering of arbitrary third-party websites.
* **Database Parameterization & Foreign Key Checks:** All persistence operations use strongly typed SDK methods and strict foreign-key verification.

---

## 5. Environment Variables Schema

```bash
# Server Runtime
PORT=3000                        # Application port (defaults to 3000)
NODE_ENV="development"           # Environment mode

# AI Services
GEMINI_API_KEY=""                # For server-side AI query understanding (Prompt 4)

# External Web Search (Optional)
SEARCH_API_KEY=""                # For web search provider (Serper / Tavily / SerpAPI)
TAVILY_API_KEY=""                # Optional Tavily API key
SERPER_API_KEY=""                # Optional Serper API key

# Database & Persistence (Prompt 8)
DATABASE_URL=""                  # Optional PostgreSQL / Cloud SQL connection URI
                                 # When unset, defaults to in-memory relational driver
                                 # with full referential integrity and foreign-key enforcement.
```

---

## 6. Current Implementation Stage (Prompts 1–8 Complete — PRICERA Engine)

* **Brand & Visual System:** PRICERA ("Know the market before you buy") with Deep Teal (`#0F766E`), Dark Teal (`#115E59`), Ink (`#0B1220`), and Surface (`#111C2E`).
* **Signature Pipeline:** User Query → Understand → Research → Compare → Estimate.
* **Product Research Layer (`src/server/research/searchService.ts`):**
  * Dispatches generated queries to external search providers.
  * Normalizes listings into `NormalizedResearchResult`.
  * Enforces untrusted web content security and deduplication.
  * Reports unconfigured providers transparently without fabricating fake sources or quotes.
* **Pricing Intelligence Layer (`src/server/pricing/pricingEngine.ts`):**
  * Identifies valid positive price observations.
  * Enforces variant compatibility and groups by currency (prefers NGN for Nigeria-focused searches).
  * Screens extreme outliers (>3.5x median).
  * Computes statistical median benchmark, min, max, spread percentage, and evidence-driven confidence (`high`, `medium`, `low`).
  * Formulates transparent methodology statement and lists operational limitations.
* **Database & Persistence Layer (`src/server/db/`):**
  * Relational schema (`searches`, `query_interpretations`, `research_sources`, `price_observations`, `final_search_results`).
  * Strict foreign key relations, unique constraints, and indexes.
  * In-memory relational repository driver with PostgreSQL DDL compatibility.
  * Idempotency, duplicate submission protection, and safe retry handling.
  * 10 verified test scenarios covering all repository operations and edge cases.
* **Market Spotlight Component (`src/components/showcase/MarketSpotlight.tsx`):**
  * Continuous horizontal marquee showcase for products and brands with pause on hover/focus and `prefers-reduced-motion` support.
* **Verified Test Suites:**
  * Pricing Engine Test Suite (`src/server/pricing/pricingEngine.test.ts`): 14 scenarios passing.
  * Database Repository Test Suite (`src/server/db/databaseRepository.test.ts`): 10 scenarios passing.
