/**
 * Pricing Intelligence & Estimation Types (Prompt 6)
 * Encapsulates verified price observations, statistical median calculations,
 * confidence ratings, and documented market limitations.
 */

import { SourceClassification, SourceRole, SourceRoleGroup } from './research';

export type PricingConfidence = 'low' | 'medium' | 'high';
export type ConfidenceRating = 'HIGH' | 'MODERATE' | 'LOW' | 'PRELIMINARY';

export type ExclusionReason =
  | 'non_commercial_source'
  | 'variant_mismatch'
  | 'pack_size_mismatch'
  | 'market_mismatch'
  | 'invalid_price'
  | 'statistical_outlier';

export interface ExcludedObservation {
  source: string;
  title: string;
  price: number | null;
  currency: string | null;
  reason: ExclusionReason;
  explanation: string;
  url?: string;
}

export interface EvidenceCounts {
  totalResearchSources: number;        // total external results retrieved
  referenceSourcesCount: number;       // technical specs, reviews, reference sites
  commercialSourcesCount: number;      // commercial listings retrieved
  usablePriceObservations: number;     // eligible commercial quotes matching product, variant & market
  comparableListingsCount: number;     // final non-outlier quotes used in the median estimate
  excludedObservationsCount: number;   // commercial quotes excluded (variant mismatch, market mismatch, outlier)
}

export interface PriceObservation {
  source: string;
  title: string;
  seller: string | null;
  product: string;
  price: number;
  currency: string;
  specifications: string[];
  retrievedAt: string;
  url: string;
  isOutlier?: boolean;
  varianceNote?: string;
  classification?: SourceClassification;
  sourceRole?: SourceRole;
  sourceRoleGroup?: SourceRoleGroup;
  isNigerianSource?: boolean;
  location?: string | null;
  unit?: string | null;
  packQuantity?: number | null;
  packUnit?: string | null;
}

export interface PricingIntelligenceResult {
  currency: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  estimatedPrice: number | null;
  confidence: PricingConfidence;
  priceObservations: PriceObservation[];
  excludedObservations?: ExcludedObservation[];
  counts: EvidenceCounts;
  methodology: string;
  limitations: string[];
  sampleSize: number;
  spreadPercent?: number;
  isForeignMarketEvidence?: boolean;
  nigerianSourceCount?: number;
}

// Retain legacy interface compatibility for shared types
export interface PriceRange {
  min: number;
  median: number;
  max: number;
  currency: string;
  unit: string;
}

export interface PricingAssumption {
  id: string;
  statement: string;
  impactLevel: 'high' | 'medium' | 'low';
  context: string;
}

export interface PriceEstimate {
  range: PriceRange;
  confidenceRating: 'HIGH' | 'MODERATE' | 'LOW' | 'PRELIMINARY';
  sampleSize: number;
  dataFreshness: string;
  marketConditionNotes: string;
  assumptions: PricingAssumption[];
  priceSpreadPercent: number;
  disclaimer: string;
}
