-- ==============================================================================
-- PRICERA Production PostgreSQL Schema
-- Database Target: PostgreSQL 14+ / Cloud SQL / Supabase / Neon / RDS
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. SEARCHES: Root execution table for tracking query runs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  original_query TEXT NOT NULL,
  normalized_query TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'processing',
  final_result_id UUID,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_searches_created_at ON searches (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_searches_status ON searches (status);
CREATE INDEX IF NOT EXISTS idx_searches_normalized_query ON searches (normalized_query);

-- ------------------------------------------------------------------------------
-- 2. QUERY INTERPRETATIONS: Structured product specifications from AI understanding
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS query_interpretations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  confidence NUMERIC(4,3) NOT NULL DEFAULT 0.5,
  uncertainties JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_query_interpretations_search_id ON query_interpretations (search_id);

-- ------------------------------------------------------------------------------
-- 3. RESEARCH SOURCES: Normalized merchant listings and catalog references
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS research_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE INDEX IF NOT EXISTS idx_research_sources_url ON research_sources (url);

-- ------------------------------------------------------------------------------
-- 4. PRICE OBSERVATIONS: Individual price datapoints extracted from sources
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS price_observations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE INDEX IF NOT EXISTS idx_price_observations_currency ON price_observations (original_currency);

-- ------------------------------------------------------------------------------
-- 5. FINAL SEARCH RESULTS: Synthesized market pricing intelligence benchmark
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS final_search_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  search_id UUID NOT NULL UNIQUE REFERENCES searches(id) ON DELETE CASCADE,
  estimated_price NUMERIC(14,2),
  min_price NUMERIC(14,2),
  max_price NUMERIC(14,2),
  currency VARCHAR(10),
  confidence VARCHAR(16) NOT NULL DEFAULT 'low',
  sample_size INTEGER NOT NULL DEFAULT 0,
  methodology TEXT NOT NULL,
  limitations JSONB NOT NULL DEFAULT '[]'::jsonb,
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_final_search_results_search_id ON final_search_results (search_id);

-- Optional circular foreign key link from searches to final_search_results
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_searches_final_result'
  ) THEN
    ALTER TABLE searches
      ADD CONSTRAINT fk_searches_final_result
      FOREIGN KEY (final_result_id)
      REFERENCES final_search_results(id)
      ON DELETE SET NULL;
  END IF;
END $$;
