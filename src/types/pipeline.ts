/**
 * PRICERA Signature Pipeline Types (Prompts 5 & 6)
 * Flow: UNDERSTAND → RESEARCH → COMPARE → ESTIMATE
 */

import { QueryUnderstandingResult } from './queryUnderstanding';
import { NormalizedResearchResult, ResearchStatus, GeneratedSearchQuery } from './research';
import { PricingIntelligenceResult, PriceEstimate, PriceObservation, EvidenceCounts, ExcludedObservation } from './pricing';
import { PhysicalProduct } from './product';
import { CommercialOffer, BuyOpportunitiesSummary } from './commercial';

export type SignatureStageId = 'understand' | 'research' | 'compare' | 'estimate';

export type StageState = 'idle' | 'processing' | 'complete' | 'failed' | 'unavailable';

export interface SignaturePipelineStep {
  id: SignatureStageId;
  label: string;
  description: string;
  state: StageState;
}

export type SearchState =
  | 'idle'
  | 'validating'
  | 'understanding'
  | 'researching'
  | 'analyzing'
  | 'complete'
  | 'partial'
  | 'failed'
  | 'unavailable';

export interface SearchMetadata {
  query: string;
  timestamp: string;
  status: 'complete' | 'partial' | 'failed';
  executionTimeMs?: number;
  cached?: boolean;
}

export interface ProductIdentificationData {
  name: string;
  category: string;
  description: string;
  brand: string | null;
  model: string | null;
  material: string | null;
  specifications: string[];
  possibleVariants: string[];
  confidence: number;
  uncertainties: string[];
}

export interface ResearchReportData {
  status: ResearchStatus;
  sources: NormalizedResearchResult[];
  sourceCount: number;
  provider?: string;
  executedQueries?: string[];
  message?: string;
}

export interface PricingReportData {
  currency: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  estimatedPrice: number | null;
  confidence: 'low' | 'medium' | 'high';
  priceObservations: PriceObservation[];
  excludedObservations?: ExcludedObservation[];
  counts?: EvidenceCounts;
  methodology: string;
  limitations: string[];
  sampleSize?: number;
  isForeignMarketEvidence?: boolean;
  nigerianSourceCount?: number;
}

export interface PipelineSummaryStatus {
  understanding: string;
  research: string;
  pricing: string;
  compare?: string;
}

export interface PriceraResearchResponse {
  search: SearchMetadata;
  product: ProductIdentificationData;
  research: ResearchReportData;
  pricing: PricingReportData;
  pipeline: PipelineSummaryStatus;
  commercialOffers?: CommercialOffer[];
  buyOpportunities?: BuyOpportunitiesSummary;

  // Compatibility aliases
  success?: boolean;
  query?: string;
  normalizedQuery?: string;
  understanding?: QueryUnderstandingResult;
  executionTimeMs?: number;
  cached?: boolean;
  error?: string;
}

// Legacy & Stage 1/2 Compatibility Types
export type PipelineStage =
  | 'idle'
  | 'validating'
  | 'understanding'
  | 'researching'
  | 'comparing'
  | 'estimating'
  | 'completed'
  | 'error';

export interface StructuredProductInterpretation {
  rawQuery: string;
  normalizedQuery: string;
  identifiedCategory: string;
  detectedSpecifications: Record<string, string>;
  possibleAmbiguities?: string[];
  suggestedSearchQueries: GeneratedSearchQuery[];
}

export interface ResearchPipelineResult {
  queryId: string;
  timestamp: string;
  rawQuery: string;
  interpretation: StructuredProductInterpretation;
  product: PhysicalProduct;
  pricingEstimate: PriceEstimate;
  sources: any[];
  executionTimeMs: number;
  isMockData: boolean;
}
