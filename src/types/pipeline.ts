/**
 * PRICERA Signature Pipeline Types (Prompts 5 & 6)
 * Flow: UNDERSTAND → RESEARCH → COMPARE → ESTIMATE
 */

import { QueryUnderstandingResult } from './queryUnderstanding';
import { NormalizedResearchResult, ResearchStatus, GeneratedSearchQuery } from './research';
import { PricingIntelligenceResult, PriceEstimate } from './pricing';
import { PhysicalProduct } from './product';

export type SignatureStageId = 'understand' | 'research' | 'compare' | 'estimate';

export type StageState = 'waiting' | 'processing' | 'complete' | 'failed';

export interface SignaturePipelineStep {
  id: SignatureStageId;
  label: string;
  description: string;
  state: StageState;
}

export interface PriceraResearchResponse {
  success: boolean;
  query: string;
  normalizedQuery: string;
  understanding: QueryUnderstandingResult;
  research: {
    status: ResearchStatus;
    provider: string;
    executedQueries: string[];
    results: NormalizedResearchResult[];
    totalFound: number;
    message?: string;
  };
  pricing: PricingIntelligenceResult;
  executionTimeMs: number;
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
