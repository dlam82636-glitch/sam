/**
 * Research Pipeline & State Management Types
 * Models the multi-stage asynchronous intelligence lifecycle.
 */

import { PhysicalProduct } from './product';
import { GeneratedSearchQuery, SourceObservation } from './research';
import { PriceEstimate } from './pricing';

export type PipelineStage = 
  | 'idle'
  | 'validating'
  | 'understanding'
  | 'searching'
  | 'extracting'
  | 'calculating'
  | 'completed'
  | 'error';

export interface PipelineStepStatus {
  step: PipelineStage;
  label: string;
  description: string;
  state: 'pending' | 'in_progress' | 'completed' | 'failed';
}

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
  sources: SourceObservation[];
  executionTimeMs: number;
  isMockData: boolean; // Explicit transparency flag
}

export interface ResearchApiError {
  code: string;
  message: string;
  suggestion?: string;
  field?: string;
}
