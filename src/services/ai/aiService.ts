/**
 * AI Service Abstraction Layer
 * Defines contracts for LLM query understanding, specification extraction, and query generation.
 * This service abstraction allows clean replacement of LLM backends (e.g., Gemini 2.5/Flash, custom endpoints)
 * without impacting the rest of the application.
 *
 * NOTE: Real implementation scheduled for future development stages.
 */

import { StructuredProductInterpretation, PhysicalProduct, SourceObservation } from '@/src/types';

export interface AIServiceInterface {
  /**
   * Parses an informal natural language text query into structured product parameters.
   */
  understandProductQuery(rawQuery: string): Promise<StructuredProductInterpretation>;

  /**
   * Extracts clean technical specifications and normalized attributes from raw source text snippets.
   */
  extractProductData(
    interpretation: StructuredProductInterpretation, 
    rawSnippets: string[]
  ): Promise<Partial<PhysicalProduct>>;

  /**
   * Synthesizes reasoning and uncertainty factors from observed supplier data.
   */
  synthesizeAssumptions(
    product: PhysicalProduct, 
    sources: SourceObservation[]
  ): Promise<string[]>;
}

/**
 * Service placeholder ensuring compile-time adherence and readiness for Stage 3 integration.
 */
export class AIServicePlaceholder implements AIServiceInterface {
  async understandProductQuery(_rawQuery: string): Promise<StructuredProductInterpretation> {
    throw new Error('AIService.understandProductQuery: Real AI integration not yet activated. Scheduled for future stage.');
  }

  async extractProductData(
    _interpretation: StructuredProductInterpretation, 
    _rawSnippets: string[]
  ): Promise<Partial<PhysicalProduct>> {
    throw new Error('AIService.extractProductData: Real AI extraction not yet activated. Scheduled for future stage.');
  }

  async synthesizeAssumptions(
    _product: PhysicalProduct, 
    _sources: SourceObservation[]
  ): Promise<string[]> {
    throw new Error('AIService.synthesizeAssumptions: Real AI reasoning not yet activated. Scheduled for future stage.');
  }
}
