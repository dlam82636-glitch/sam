/**
 * Database & Persistence Service Adapter Layer
 * Bridges service requests to the server database repository.
 */

import { getDatabaseRepository } from '@/src/server/db';
import { ResearchPipelineResult, SourceObservation } from '@/src/types';

export * from '@/src/server/db';

export interface LegacyDatabaseRepositoryInterface {
  getCachedResearch(normalizedQuery: string, maxAgeHours?: number): Promise<ResearchPipelineResult | null>;
  saveResearchResult(result: ResearchPipelineResult): Promise<void>;
  recordObservations(productId: string, observations: SourceObservation[]): Promise<void>;
}

export class DatabaseRepositoryService implements LegacyDatabaseRepositoryInterface {
  private repo = getDatabaseRepository();

  async getCachedResearch(_normalizedQuery: string, _maxAgeHours?: number): Promise<ResearchPipelineResult | null> {
    return null; // Cache miss - fresh execution preferred
  }

  async saveResearchResult(_result: ResearchPipelineResult): Promise<void> {
    // Legacy schema adapter
  }

  async recordObservations(productId: string, observations: SourceObservation[]): Promise<void> {
    if (observations.length === 0) return;
    await this.repo.savePriceObservations(
      observations.map((obs) => ({
        searchId: productId,
        sourceDomain: obs.sourceDomain,
        title: obs.pageTitle,
        originalPrice: obs.observedPrice,
        originalCurrency: obs.currency,
        product: productId,
        specifications: [],
        retrievedAt: obs.observationDate,
      }))
    );
  }
}

export const dbService = new DatabaseRepositoryService();
