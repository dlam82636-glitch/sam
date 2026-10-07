# PRICERA — Product & Material Market Intelligence

Know the market before you buy. Text-based product and material market research tool providing structured specifications and transparent price estimates.

---

## 1. Project Overview

**PRICERA** is an AI-powered product and material price discovery platform. Users enter a product or material search query and receive structured product identification, researched source prices, an estimated market price range, confidence information, and source links.

> **CRITICAL MVP SCOPE NOTE:**  
> **PRICERA is TEXT-SEARCH-ONLY in the current MVP.**  
> There is:
> * **NO image upload**
> * **NO image recognition**
> * **NO computer vision**
> * **NO camera capture**

All user interactions originate as text search queries (e.g., `12mm marine plywood`, `2 inch steel pipe`, `Samsung A55 256GB`, `CAT 6 ethernet cable 305m`) and flow through a deterministic, transparent market intelligence pipeline.

---

## 2. Technology Stack

* **Frontend**: React 19 SPA, TypeScript, Tailwind CSS v4, Lucide React icons
* **Build System & Tooling**: Vite v8, `@vitejs/plugin-react`, `tsx`
* **Backend API & Server**: Express v4 full-stack server (`server.ts`) with Vite middleware in development and static asset serving in production
* **AI Query Understanding**: Google Gemini API via official `@google/genai` TypeScript SDK (model: `gemini-3.1-flash-lite` with automated fallback to `gemini-3.8-flash`)
* **Web Research Provider Abstraction**: Modular external HTTP search integration (supporting Tavily, Serper, SerpAPI) with zero-fabrication integrity enforcement
* **Pricing Intelligence Engine**: Deterministic algorithmic statistical engine (median benchmark, interquartile range / MAD outlier exclusion, currency grouping, confidence scoring)
* **Persistence & Database**: Server-side repository pattern with dual mode:
  * In-Memory Relational Driver (default for zero-dependency local dev/testing)
  * PostgreSQL-compatible Schema & Migrations (`database/schema.sql`, `database/migrations/001_initial_schema.sql`)
* **Security & Reliability**: Sliding-window rate limiter (20 req/min/IP), content security policy headers, XML/tag breakout sanitization, Unicode-aware input validation, payload size limits (64KB)

---

## 3. Local Development Setup

Follow these steps to run PRICERA locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example configuration:
```bash
cp .env.example .env
```
Open `.env` and configure your `GEMINI_API_KEY`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Application in Browser
Navigate to:
```
http://localhost:3000
```

### 5. Run Test Suites
```bash
npm test
```
This executes all 32 scenarios across the Security & Audit Suite, Pricing Intelligence Suite, and Database Repository Suite.

---

## 4. Environment Variables

All sensitive environment variables are strictly **server-side only** and are never exposed to browser bundles or client requests.

| Variable | Required | Purpose | Location | Server-Side Only |
| :--- | :---: | :--- | :--- | :---: |
| `PORT` | Optional | HTTP network port (defaults to `3000`) | Server environment | Yes |
| `GEMINI_API_KEY` | **Required** | Gemini API key for server-side query understanding (`@google/genai`) | Server environment | **Yes** |
| `SEARCH_API_KEY` | Optional | External web search provider API key (Tavily/SerpAPI/general) | Server environment | **Yes** |
| `TAVILY_API_KEY` | Optional | Direct Tavily search API key | Server environment | **Yes** |
| `SERPER_API_KEY` | Optional | Direct Serper.dev Google search API key | Server environment | **Yes** |
| `DATABASE_URL` | Optional | PostgreSQL connection URI (`postgresql://user:pass@host:5432/db`) | Server environment | **Yes** |

> **Security Rule**: Never check real API keys or connection strings into version control, README files, or frontend source code. Always use server environment configuration or secrets management.

---

## 5. Database Setup

PRICERA uses a server-side repository architecture (`src/server/db/`).

* **In-Memory Relational Mode (Default)**: When `DATABASE_URL` is omitted, the server automatically operates an in-memory relational repository driver with strict foreign keys, relational indexing, and upsert idempotency. Ideal for local development, tests, and stateless container deployments.
* **PostgreSQL Mode**: When `DATABASE_URL` is configured, the application connects to a PostgreSQL instance (PostgreSQL 14+, Cloud SQL, Supabase, Neon, AWS RDS).

### Database Entities & Schema
The relational model consists of 5 core tables defined in `database/schema.sql` and `database/migrations/001_initial_schema.sql`:

1. **`searches`**: Root entity tracking search lifecycle, normalized query, status (`processing`, `complete`, `partial`, `failed`), and error messages.
2. **`query_interpretations`**: 1:1 relation to `searches` containing extracted product name, category, description, specifications, variants, and prospective queries.
3. **`research_sources`**: 1:N relation to `searches` storing authentic merchant citations, original URLs, titles, sellers, raw snippets, and retrieval timestamps.
4. **`price_observations`**: 1:N relation to `searches` (and optional foreign key to `research_sources`) tracking original observed prices, currencies, outlier flags, and variance notes. Never overwrites raw source data.
5. **`final_search_results`**: 1:1 relation to `searches` storing the final estimated benchmark price, low/high range, confidence rating, methodology statement, and documented limitations.

### Migration & PostgreSQL Setup Steps
1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE pricera_db;
   ```
2. Apply the initial migration:
   ```bash
   psql -d pricera_db -f database/migrations/001_initial_schema.sql
   ```
3. Set `DATABASE_URL` in your server environment:
   ```env
   DATABASE_URL=postgresql://username:password@db-host:5432/pricera_db
   ```
4. Start the server (`npm run dev` or `npm start`).
5. Verify status at `GET /api/health` — the `databaseMode` property will reflect your connection.

---

## 6. AI Configuration

The AI query understanding layer operates exclusively on the server (`src/server/ai/queryUnderstandingService.ts`).

* **SDK**: Official `@google/genai` TypeScript library.
* **Model Selection**: Uses `gemini-3.1-flash-lite` for ultra-fast, structured JSON extraction, with an automated fallback to `gemini-3.8-flash` if transient upstream failures occur.
* **Timeout Behavior**: Requests are bounded by a 35,000ms timeout promise. If the model exceeds this limit, an `AITimeoutError` is caught and returned as HTTP 504.
* **Prompt Injection Defense**:
  * User queries are wrapped within `<user_query>` tags.
  * Tag delimiter breakout attempts (`</user_query>`) are stripped before prompt synthesis.
  * System instructions explicitly prohibit system prompt disclosure, API key printing, or credential exposure under any role-play or jailbreak scenario.
  * Adversarial inputs are safely classified as `Unrecognized Query` (confidence `0.05`).
* **Schema Validation**: Model JSON outputs are validated at runtime against strict TypeScript schemas. Malformed responses throw `AISchemaValidationError` (HTTP 502).

---

## 7. Search Provider Configuration

The research layer (`src/server/research/searchService.ts`) coordinates external market queries.

* **Supported Providers**: Tavily (`TAVILY_API_KEY` or `SEARCH_API_KEY`), Serper.dev (`SERPER_API_KEY`).
* **Provider Selection**: Checked automatically in order of precedence.
* **Behavior When Unconfigured**: If no search API keys are present in the server environment, PRICERA explicitly returns status `provider_unconfigured`.
* **Zero Fake Data Integrity Rule**: In accordance with PRICERA core integrity rules, **no synthetic merchant listings or simulated price values are ever fabricated**. The UI clearly explains to the user that live web research is unconfigured and presents the extracted product specifications without misleading price estimates.
* **URL & Protocol Validation**: Citations must use valid `http://` or `https://` schemes; dangerous protocols (`javascript:`, `data:`, `file:`) are rejected.

---

## 8. Deployment Instructions

Generic production deployment workflow:

```text
1. Clone repository
   git clone <repo-url> && cd <repo-dir>

2. Install dependencies
   npm install

3. Configure production environment variables
   Ensure GEMINI_API_KEY, PORT (defaults to 3000), and optional DATABASE_URL are set in the hosting environment.

4. Configure PostgreSQL (optional)
   If using persistent PostgreSQL, create the database and apply database/migrations/001_initial_schema.sql.

5. Build frontend application
   npm run build

6. Start production server
   npm start
   (Executes "node server.ts", which binds to 0.0.0.0:PORT and serves both the Express API and production Vite static bundle)

7. Configure Domain / Reverse Proxy
   Point DNS A/CNAME records to your server IP or load balancer.

8. Enable HTTPS
   Terminate TLS using Let's Encrypt (Certbot), Cloudflare, or cloud provider managed certificates.

9. Verify Search Flow
   Send a test request to /api/health and execute a sample search query through the web UI.
```

---

## 9. Troubleshooting

| Symptom | Cause | Solution |
| :--- | :--- | :--- |
| **HTTP 503 `AI_NOT_CONFIGURED`** | `GEMINI_API_KEY` is missing or empty in the server environment. | Set `GEMINI_API_KEY` in `.env` or container environment and restart server. |
| **"Live market research unavailable" notice** | `SEARCH_API_KEY` / `TAVILY_API_KEY` is not configured. | Expected behavior when external search key is omitted. Add a search key if live web scraping is desired. |
| **HTTP 504 `AI_TIMEOUT`** | Upstream AI service latency exceeded 35s. | Check network connectivity to Google Gemini API; retry query. |
| **HTTP 429 `RATE_LIMITED`** | More than 20 requests dispatched in 60s from the same IP. | Wait for the duration in the `Retry-After` header before submitting new queries. |
| **Port already in use (`EADDRINUSE: 3000`)** | Another process is bound to port 3000. | Set `PORT=3001` or terminate the conflicting process. |
| **Production build error** | Missing imports or TypeScript type errors. | Run `npm run lint` (`tsc --noEmit`) to inspect compilation errors. |
| **Database connection error** | PostgreSQL host unreachable or invalid credentials in `DATABASE_URL`. | Verify PostgreSQL is running and check connection string format. The app will fall back to in-memory mode if `DATABASE_URL` is omitted. |

---

## 10. Known Limitations

* **TEXT-SEARCH-ONLY**: No image upload, image recognition, barcode scanning, or computer vision is included or supported in this MVP.
* **Search Provider Required for Live Pricing**: Live commercial quotes require a configured external search provider (`SEARCH_API_KEY`). Without one, PRICERA operates in specification discovery mode without synthetic pricing.
* **Single-Source Evidence**: Queries with only 1 retrieved quote provide limited market distribution visibility and are labeled with `low` confidence.
* **Stateless Restart in Default In-Memory Mode**: In-memory database records reset when the server restarts unless `DATABASE_URL` is configured.
* **Regional Freight & Taxes**: Estimates reflect observed listing prices and exclude localized freight delivery surcharges or municipal taxes.

---

## 11. Production Deployment Checklist

```text
[x] Production environment variables configured (.env.example documented)
[x] Secrets stored securely server-side (no keys in client bundles)
[x] PostgreSQL schema and migrations ready (database/schema.sql)
[x] Dual-mode database repository (PostgreSQL + in-memory fallback)
[x] Gemini API configured with @google/genai (flash-lite + flash fallback)
[x] Search provider abstraction configured with zero-fabrication integrity
[x] Rate limits active (20 req/min sliding-window with Retry-After header)
[x] Production build passes (npm run build)
[x] TypeScript passes (tsc --noEmit)
[x] All 32 automated test suite scenarios pass (npm test)
[x] Full-stack production server starts on port 3000 ("start": "node server.ts")
[x] HTTPS and reverse proxy guidelines documented
[x] Clean production logging without secret disclosure
[x] Complete search flow verified end-to-end
[x] TEXT-SEARCH-ONLY MVP verified
```
