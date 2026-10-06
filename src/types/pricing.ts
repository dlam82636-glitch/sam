/**
 * Pricing Intelligence & Estimation Types (Prompt 6)
 * Encapsulates verified price observations, statistical median calculations,
 * confidence ratings, and documented market limitations.
 */

export type PricingConfidence = 'low' | 'medium' | 'high';
export type ConfidenceRating = 'HIGH' | 'MODERATE' | 'LOW' | 'PRELIMINARY';

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
}

export interface PricingIntelligenceResult {
  currency: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  estimatedPrice: number | null;
  confidence: PricingConfidence;
  priceObservations: PriceObservation[];
  methodology: string;
  limitations: string[];
  sampleSize: number;
  spreadPercent?: number;
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
