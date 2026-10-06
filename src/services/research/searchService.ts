/**
 * Search & Research Service Abstraction Layer
 * Defines contracts for external web research, industrial catalog lookup, and supplier price fetching.
 *
 * NOTE: Real implementation scheduled for future development stages.
 */

import { GeneratedSearchQuery, SourceObservation } from '@/src/types';

export interface SearchServiceInterface {
  /**
   * Dispatches generated queries across commercial search engines, distributor indices, or catalog APIs.
   */
  searchProductSources(queries: GeneratedSearchQuery[]): Promise<SourceObservation[]>;

  /**
   * Retrieves and normalizes supplier observations for an individual targeted query.
   */
  searchProduct(query: string): Promise<SourceObservation[]>;
}

/**
 * Service placeholder ensuring compile-time adherence and readiness for Stage 3 integration.
 */
export class SearchServicePlaceholder implements SearchServiceInterface {
  async searchProductSources(_queries: GeneratedSearchQuery[]): Promise<SourceObservation[]> {
    throw new Error('SearchService.searchProductSources: Real search API integration not yet activated. Scheduled for future stage.');
  }

  async searchProduct(_query: string): Promise<SourceObservation[]> {
    throw new Error('SearchService.searchProduct: Real search API integration not yet activated. Scheduled for future stage.');
  }
}
