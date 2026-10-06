/**
 * Pricing Intelligence & Estimation Types
 * Encapsulates computed market price ranges, confidence statistics, and critical assumptions.
 */

export type ConfidenceRating = 'HIGH' | 'MODERATE' | 'LOW' | 'PRELIMINARY';

export interface PriceRange {
  min: number;
  median: number;
  max: number;
  currency: string;
  unit: string; // e.g. "per sheet (2440 x 1220mm)", "per piece", "per meter"
}

export interface PricingAssumption {
  id: string;
  statement: string;
  impactLevel: 'high' | 'medium' | 'low';
  context: string; // e.g. "Assumes standard commercial grade B/BB, retail single unit rather than freight container volume"
}

export interface PriceEstimate {
  range: PriceRange;
  confidenceRating: ConfidenceRating;
  sampleSize: number; // Number of unique source prices analyzed
  dataFreshness: string; // e.g. "Q1 2026 Sources", "Last 30 Days"
  marketConditionNotes: string;
  assumptions: PricingAssumption[];
  priceSpreadPercent: number; // e.g. 24% spread between low and high
  disclaimer: string;
}
