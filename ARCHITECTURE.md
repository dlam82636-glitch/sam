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

### 3. DATABASE (Planned for later stage)
* **Target Schema:** Relational storage for:
  * Normalized product taxonomy and specifications.
  * Cached search query queries and raw observation logs.
  * Price observation history (timestamps, source domains, reported figures, currencies).
* **Abstraction:** Repository pattern (`ProductRepository`, `ObservationRepository`, `QueryLogRepository`) to isolate persistence engine from business logic.

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

## 2. End-to-End Data Flow

```text
[ User Query (Text) ]
         │
         ▼
[ Client-Side Validation ] ── (Length, syntax, sanitization)
         │
         ▼
[ Server-Side Research Coordinator ]
         │
         ├─► [ Step 1: AI Query Understanding ]
         │       └─ Extracts intent, item classification, dimensions, grades, variants.
         │
         ├─► [ Step 2: Search Query Generation ]
         │       └─ Produces disambiguated search keywords for suppliers & distributors.
         │
         ├─► [ Step 3: Web Research Retrieval ]
         │       └─ Queries online sources; collects snippets, URLs, published pricing.
         │
         ├─► [ Step 4: Normalization & Fact Extraction ]
         │       └─ Validates units, currencies, and spec matches.
         │
         ├─► [ Step 5: Pricing Intelligence & Confidence Scoring ]
         │       └─ Computes min/median/max bounds and explicit assumption list.
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
2. **Ambiguous Queries (300/Notice):** When a query could refer to multiple distinct products (e.g., "A55" - phone vs steel grade), the system returns disambiguation suggestions.
3. **Sparse Data / Low Confidence (206):** When insufficient online data is found, the system clearly indicates low confidence rather than fabricating estimates.
4. **Upstream Service Failures (502/503):** Graceful recovery with circuit-breaker logging without leaking internal stack traces or API keys to the client.

---

## 4. Security & Privacy Safeguards

* **Zero Client-Side Secrets:** No API keys or search tokens in frontend bundles.
* **Input Sanitization:** Strict regex sanitization and prompt injection shields prior to AI prompting.
* **Output Grounding:** Output schemas strictly require URL citations and verbatim source evidence before computing any price estimate.
* **Zero Untrusted Scraping Execution:** No client-side scraping or iframe rendering of arbitrary third-party websites.

---

## 5. Environment Variables Schema

```bash
# Server Runtime (configured server-side only in future stages)
GEMINI_API_KEY=""                # For server-side AI query understanding
SEARCH_API_KEY=""                # For web search provider
SEARCH_ENGINE_ID=""              # Optional search engine cx
PORT=3000                        # Application port
NODE_ENV="development"           # Environment mode
```

---

## 6. Current Implementation Stage (Prompts 1–6 Complete — PRICERA Engine)

* **Brand & Visual System:** PRICERA ("Know the market before you buy") with Deep Teal (`#0F766E`), Dark Teal (`#115E59`), Ink (`#0B1220`), and Surface (`#111C2E`).
* **Signature Pipeline:** User Query → Understand → Research → Compare → Estimate.
* **Product Research Layer (`src/server/research/searchService.ts`):**
  * Dispatches generated queries from Prompt 4 to external search providers.
  * Normalizes listings into `NormalizedResearchResult` (`source`, `title`, `url`, `seller`, `price`, `currency`, `specifications`, `retrievedAt`).
  * Enforces untrusted web content security and deduplication.
  * Reports unconfigured providers transparently without fabricating fake sources or quotes.
* **Pricing Intelligence Layer (`src/server/pricing/pricingEngine.ts`):**
  * Identifies valid positive price observations.
  * Enforces variant compatibility (e.g. separating 128GB from 256GB, 12mm from 18mm).
  * Groups by currency (prefers NGN for Nigeria-focused searches; never fabricates unverified exchange rates).
  * Screens extreme outliers (>3.5x median).
  * Computes statistical median benchmark, min, max, spread percentage, and evidence-driven confidence (`high`, `medium`, `low`).
  * Formulates transparent methodology statement and lists operational limitations (freight, taxes, volume).
* **Market Spotlight Component (`src/components/showcase/MarketSpotlight.tsx`):**
  * Continuous horizontal marquee showcase for products and brands with pause on hover/focus and `prefers-reduced-motion` support.
* **Verified Test Suite (`src/server/pricing/pricingEngine.test.ts`):**
  * 14 scenarios tested and verified passing with 0 errors.
