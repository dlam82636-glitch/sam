/**
 * PRICERA Database & Persistence Schema (Prompt 8)
 *
 * Defines strongly-typed entities, relations, and SQL DDL definitions for:
 * 1. Searches (Search root entity)
 * 2. Query Interpretations (Structured AI query understanding)
 * 3. Research Sources (Normalized external supplier listings)
 * 4. Price Observations (Individual price datapoints)
 * 5. Final Search Results (Calculated pricing intelligence benchmarks)
 */

export type SearchStatus = 'processing' | 'completed' | 'complete' | 'failed' | 'unavailable' | 'partial';
export type PricingConfidenceLevel = 'low' | 'medium' | 'high';

/**
 * Entity 1: Search
 * The root execution record tracking a user inquiry through the pipeline.
 */
export interface SearchRecord {
  id: string; // UUID
  originalQuery: string;
  normalizedQuery: string;
  status: SearchStatus;
  finalResultId: string | null;
  errorMessage: string | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Entity 2: Query Interpretation
 * Structured product parameters extracted by AI understanding.
 */
export interface QueryInterpretationRecord {
  id: string; // UUID
  searchId: string; // FK -> SearchRecord.id
  productName: string;
  category: string;
  description: string;
  brand: string | null;
  model: string | null;
  material: string | null;
  specifications: string[];
  possibleVariants: string[];
  searchQueries: string[];
  confidence: number;
  uncertainties: string[];
  createdAt: string;
}

/**
 * Entity 3: Research Source
 * Individual commercial supplier listings retrieved from web research.
 */
export interface ResearchSourceRecord {
  id: string; // UUID
  searchId: string; // FK -> SearchRecord.id
  title: string;
  url: string; // Authentic, non-fabricated URL
  seller: string | null;
  brand: string | null;
  product: string;
  price: number | null;
  currency: string | null;
  availability: string | null;
  specifications: string[];
  rawSnippet: string | null;
  isRelevantMatch: boolean;
  retrievedAt: string;
}

/**
 * Entity 4: Price Observation
 * Traceable pricing data extracted from research sources.
 */
export interface PriceObservationRecord {
  id: string; // UUID
  searchId: string; // FK -> SearchRecord.id
  sourceId: string | null; // FK -> ResearchSourceRecord.id
  sourceDomain: string;
  title: string;
  originalPrice: number;
  originalCurrency: string;
  normalizedPrice: number | null; // Populated only with verified exchange rates
  normalizedCurrency: string | null;
  product: string;
  specifications: string[];
  isOutlier: boolean;
  varianceNote: string | null;
  retrievedAt: string;
}

/**
 * Entity 5: Final Search Result
 * The synthesized market pricing intelligence benchmark.
 */
export interface FinalSearchResultRecord {
  id: string; // UUID
  searchId: string; // FK -> SearchRecord.id (Unique 1:1)
  estimatedPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string | null;
  confidence: PricingConfidenceLevel;
  sampleSize: number;
  methodology: string;
  limitations: string[];
  productName: string;
  productCategory: string;
  createdAt: string;
}

/**
 * Complete Aggregated Search Graph
 */
export interface CompleteSearchGraph {
  search: SearchRecord;
  interpretation: QueryInterpretationRecord | null;
  sources: ResearchSourceRecord[];
  observations: PriceObservationRecord[];
  finalResult: FinalSearchResultRecord | null;
}

// Input DTOs for repository methods
export interface CreateSearchInput {
  id?: string;
  originalQuery: string;
  normalizedQuery: string;
  status?: SearchStatus;
}

export interface CreateQueryInterpretationInput {
  id?: string;
  searchId: string;
  productName: string;
  category: string;
  description: string;
  brand: string | null;
  model: string | null;
  material: string | null;
  specifications: string[];
  possibleVariants: string[];
  searchQueries: string[];
  confidence: number;
  uncertainties: string[];
}

export interface CreateResearchSourceInput {
  id?: string;
  searchId: string;
  title: string;
  url: string;
  seller: string | null;
  brand: string | null;
  product: string;
  price: number | null;
  currency: string | null;
  availability: string | null;
  specifications: string[];
  rawSnippet?: string;
  isRelevantMatch?: boolean;
  retrievedAt?: string;
}

export interface CreatePriceObservationInput {
  id?: string;
  searchId: string;
  sourceId?: string | null;
  sourceDomain: string;
  title: string;
  originalPrice: number;
  originalCurrency: string;
  normalizedPrice?: number | null;
  normalizedCurrency?: string | null;
  product: string;
  specifications: string[];
  isOutlier?: boolean;
  varianceNote?: string;
  retrievedAt?: string;
}

export interface CreateFinalResultInput {
  id?: string;
  searchId: string;
  estimatedPrice: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string | null;
  confidence: PricingConfidenceLevel;
  sampleSize: number;
  methodology: string;
  limitations: string[];
  productName: string;
  productCategory: string;
}

/**
 * SQL Schema DDL (PostgreSQL / Cloud SQL relational target)
 */
export const POSTGRES_SCHEMA_SQL = `
-- PRICERA Relational Schema Definition
CREATE TABLE IF NOT EXISTS searches (
  id UUID PRIMARY KEY,
  original_query TEXT NOT NULL,
  normalized_query TEXT NOT NULL,
  status VARCHAR(32) NOT NULL,
  final_result_id UUID,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_searches_status ON searches (status);

CREATE TABLE IF NOT EXISTS query_interpretations (
  id UUID PRIMARY KEY,
  search_id UUID NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  model TEXT,
  material TEXT,
  specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  possible_variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  search_queries JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence NUMERIC(4,3) NOT NULL,
  uncertainties JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_query_interpretations_search_id ON query_interpretations (search_id);

CREATE TABLE IF NOT EXISTS research_sources (
  id UUID PRIMARY KEY,
  search_id UUID NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  seller TEXT,
  brand TEXT,
  product TEXT NOT NULL,
  price NUMERIC(14,2),
  currency VARCHAR(10),
  availability TEXT,
  specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  raw_snippet TEXT,
  is_relevant_match BOOLEAN DEFAULT TRUE,
  retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_research_sources_search_id ON research_sources (search_id);

CREATE TABLE IF NOT EXISTS price_observations (
  id UUID PRIMARY KEY,
  search_id UUID NOT NULL REFERENCES searches(id) ON DELETE CASCADE,
  source_id UUID REFERENCES research_sources(id) ON DELETE SET NULL,
  source_domain TEXT NOT NULL,
  title TEXT NOT NULL,
  original_price NUMERIC(14,2) NOT NULL,
  original_currency VARCHAR(10) NOT NULL,
  normalized_price NUMERIC(14,2),
  normalized_currency VARCHAR(10),
  product TEXT NOT NULL,
  specifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_outlier BOOLEAN DEFAULT FALSE,
  variance_note TEXT,
  retrieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_observations_search_id ON price_observations (search_id);
CREATE INDEX IF NOT EXISTS idx_price_observations_source_id ON price_observations (source_id);

CREATE TABLE IF NOT EXISTS final_search_results (
  id UUID PRIMARY KEY,
  search_id UUID NOT NULL UNIQUE REFERENCES searches(id) ON DELETE CASCADE,
  estimated_price NUMERIC(14,2),
  min_price NUMERIC(14,2),
  max_price NUMERIC(14,2),
  currency VARCHAR(10),
  confidence VARCHAR(16) NOT NULL,
  sample_size INTEGER NOT NULL DEFAULT 0,
  methodology TEXT NOT NULL,
  limitations JSONB NOT NULL DEFAULT '[]'::jsonb,
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_final_search_results_search_id ON final_search_results (search_id);
`;
