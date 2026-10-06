/**
 * Research & Source Attribution Type Definitions
 * Represents web citations, source observations, and search generation outputs.
 */

export interface SourceObservation {
  id: string;
  sourceName: string;
  sourceDomain: string;
  sourceUrl: string;
  pageTitle: string;
  observedPrice: number;
  currency: string;
  unitOfMeasure: string; // e.g. "per sheet", "per piece", "per linear meter"
  observationDate: string; // ISO date string
  sourceType: 'retailer' | 'distributor' | 'manufacturer' | 'marketplace' | 'trade_supplier';
  extractedSnippet: string;
  specMatchScore: number; // 0.0 - 1.0 match to queried product
  isVerified: boolean;
}

export interface GeneratedSearchQuery {
  query: string;
  intent: 'supplier_lookup' | 'spec_sheet' | 'price_check' | 'variant_discovery';
  targetAudience: 'b2b_wholesale' | 'contractor' | 'retail';
}
