/**
 * Database & Persistence Repository Abstraction Layer
 * Defines interfaces for caching query runs, saving price observations, and tracking historical quotes.
 *
 * NOTE: Real implementation scheduled for future development stages.
 */

import { ResearchPipelineResult, SourceObservation } from '@/src/types';

export interface DatabaseRepositoryInterface {
  /**
   * Retrieves cached research result for equivalent canonical query if fresh.
   */
  getCachedResearch(normalizedQuery: string, maxAgeHours?: number): Promise<ResearchPipelineResult | null>;

  /**
   * Persists a validated research pipeline execution.
   */
  saveResearchResult(result: ResearchPipelineResult): Promise<void>;

  /**
   * Logs historical price observations for longitudinal trend analysis.
   */
  recordObservations(productId: string, observations: SourceObservation[]): Promise<void>;
}

export class DatabaseRepositoryPlaceholder implements DatabaseRepositoryInterface {
  async getCachedResearch(_normalizedQuery: string, _maxAgeHours?: number): Promise<ResearchPipelineResult | null> {
    return null; // Cache miss
  }

  async saveResearchResult(_result: ResearchPipelineResult): Promise<void> {
    // No-op until persistence layer is wired
  }

  async recordObservations(_productId: string, _observations: SourceObservation[]): Promise<void> {
    // No-op until persistence layer is wired
  }
}
