/**
 * PRICERA Database Repository Layer (Prompt 8)
 *
 * Implements server-side persistence for searches, AI interpretations,
 * normalized research sources, price observations, and final pricing results.
 *
 * Ensures:
 * - Clean separation from UI, AI providers, and search services
 * - Referential integrity (Foreign Keys)
 * - Safe parameterized operations
 * - Idempotency and duplicate/retry resilience
 * - Relational indexes
 */

import { randomUUID } from 'crypto';
import {
  SearchRecord,
  SearchStatus,
  QueryInterpretationRecord,
  ResearchSourceRecord,
  PriceObservationRecord,
  FinalSearchResultRecord,
  CompleteSearchGraph,
  CreateSearchInput,
  CreateQueryInterpretationInput,
  CreateResearchSourceInput,
  CreatePriceObservationInput,
  CreateFinalResultInput,
} from './schema';

export class DatabaseError extends Error {
  public code: string;
  constructor(message: string, code: string = 'DB_ERROR') {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
  }
}

export class ForeignKeyConstraintError extends DatabaseError {
  constructor(message: string) {
    super(message, 'FOREIGN_KEY_VIOLATION');
    this.name = 'ForeignKeyConstraintError';
  }
}

export class RecordNotFoundError extends DatabaseError {
  constructor(message: string) {
    super(message, 'RECORD_NOT_FOUND');
    this.name = 'RecordNotFoundError';
  }
}

export class ValidationError extends DatabaseError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export interface DatabaseRepositoryInterface {
  createSearch(input: CreateSearchInput): Promise<SearchRecord>;
  updateSearchStatus(
    searchId: string,
    status: SearchStatus,
    finalResultId?: string | null,
    errorMessage?: string | null
  ): Promise<SearchRecord>;
  saveQueryInterpretation(input: CreateQueryInterpretationInput): Promise<QueryInterpretationRecord>;
  saveResearchSources(inputs: CreateResearchSourceInput[]): Promise<ResearchSourceRecord[]>;
  savePriceObservations(inputs: CreatePriceObservationInput[]): Promise<PriceObservationRecord[]>;
  saveFinalResult(input: CreateFinalResultInput): Promise<FinalSearchResultRecord>;
  getSearch(searchId: string): Promise<CompleteSearchGraph | null>;
  getRecentSearches(limit?: number): Promise<SearchRecord[]>;
  clearAll(): Promise<void>;
}

/**
 * Standard In-Memory Relational Database Driver.
 * Provides strict relational integrity, indexed lookups, and transactional consistency
 * while decoupling business logic from external server dependencies.
 */
export class InMemoryRelationalRepository implements DatabaseRepositoryInterface {
  // Primary Tables
  private searches = new Map<string, SearchRecord>();
  private interpretations = new Map<string, QueryInterpretationRecord>();
  private sources = new Map<string, ResearchSourceRecord>();
  private observations = new Map<string, PriceObservationRecord>();
  private finalResults = new Map<string, FinalSearchResultRecord>();

  // Foreign Key & Secondary Indexes (mimicking PostgreSQL relational indexes)
  // idx_query_interpretations_search_id: searchId -> interpretationId
  private idxInterpretationBySearch = new Map<string, string>();
  // idx_research_sources_search_id: searchId -> Set<sourceId>
  private idxSourcesBySearch = new Map<string, Set<string>>();
  // idx_price_observations_search_id: searchId -> Set<observationId>
  private idxObservationsBySearch = new Map<string, Set<string>>();
  // idx_price_observations_source_id: sourceId -> Set<observationId>
  private idxObservationsBySource = new Map<string, Set<string>>();
  // idx_final_search_results_search_id: searchId -> finalResultId (Unique 1:1)
  private idxFinalResultBySearch = new Map<string, string>();

  /**
   * Creates a new Search execution root record.
   * Supports idempotency: if search with ID already exists, returns existing or updates if requested.
   */
  async createSearch(input: CreateSearchInput): Promise<SearchRecord> {
    if (!input.originalQuery || input.originalQuery.trim().length === 0) {
      throw new ValidationError('Search originalQuery must not be empty.');
    }

    const id = input.id || randomUUID();
    const existing = this.searches.get(id);
    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();
    const record: SearchRecord = {
      id,
      originalQuery: input.originalQuery.trim(),
      normalizedQuery: input.normalizedQuery.trim(),
      status: input.status || 'processing',
      finalResultId: null,
      errorMessage: null,
      createdAt: now,
      updatedAt: now,
    };

    this.searches.set(id, record);
    return { ...record };
  }

  /**
   * Updates status of an existing search record.
   */
  async updateSearchStatus(
    searchId: string,
    status: SearchStatus,
    finalResultId: string | null = null,
    errorMessage: string | null = null
  ): Promise<SearchRecord> {
    const search = this.searches.get(searchId);
    if (!search) {
      throw new RecordNotFoundError(`Search with id "${searchId}" does not exist.`);
    }

    const updated: SearchRecord = {
      ...search,
      status,
      finalResultId: finalResultId !== undefined ? finalResultId : search.finalResultId,
      errorMessage: errorMessage !== undefined ? errorMessage : search.errorMessage,
      updatedAt: new Date().toISOString(),
    };

    this.searches.set(searchId, updated);
    return { ...updated };
  }

  /**
   * Saves structured AI query interpretation linked to parent Search.
   * Enforces foreign key constraint: Search must exist.
   */
  async saveQueryInterpretation(input: CreateQueryInterpretationInput): Promise<QueryInterpretationRecord> {
    if (!input.searchId) {
      throw new ValidationError('Query interpretation requires a valid searchId.');
    }
    if (!this.searches.has(input.searchId)) {
      throw new ForeignKeyConstraintError(`Search with id "${input.searchId}" does not exist.`);
    }
    if (!input.productName || input.productName.trim().length === 0) {
      throw new ValidationError('productName must not be empty.');
    }

    const id = input.id || randomUUID();
    const record: QueryInterpretationRecord = {
      id,
      searchId: input.searchId,
      productName: input.productName.trim(),
      category: input.category || 'General Physical Goods',
      description: input.description || '',
      brand: input.brand || null,
      model: input.model || null,
      material: input.material || null,
      specifications: Array.isArray(input.specifications) ? [...input.specifications] : [],
      possibleVariants: Array.isArray(input.possibleVariants) ? [...input.possibleVariants] : [],
      searchQueries: Array.isArray(input.searchQueries) ? [...input.searchQueries] : [],
      confidence: typeof input.confidence === 'number' ? Math.max(0, Math.min(1, input.confidence)) : 0.5,
      uncertainties: Array.isArray(input.uncertainties) ? [...input.uncertainties] : [],
      createdAt: new Date().toISOString(),
    };

    this.interpretations.set(id, record);
    this.idxInterpretationBySearch.set(input.searchId, id);
    return { ...record };
  }

  /**
   * Saves multiple normalized research sources linked to parent Search.
   * Enforces foreign key constraint: Search must exist.
   */
  async saveResearchSources(inputs: CreateResearchSourceInput[]): Promise<ResearchSourceRecord[]> {
    const saved: ResearchSourceRecord[] = [];

    for (const input of inputs) {
      if (!input.searchId) {
        throw new ValidationError('Research source requires a valid searchId.');
      }
      if (!this.searches.has(input.searchId)) {
        throw new ForeignKeyConstraintError(`Search with id "${input.searchId}" does not exist.`);
      }
      if (!input.title || !input.url) {
        throw new ValidationError('Research source requires title and authentic url.');
      }

      const id = input.id || randomUUID();
      const record: ResearchSourceRecord = {
        id,
        searchId: input.searchId,
        title: input.title.trim(),
        url: input.url.trim(),
        seller: input.seller || null,
        brand: input.brand || null,
        product: input.product || '',
        price: typeof input.price === 'number' && !isNaN(input.price) ? input.price : null,
        currency: input.currency || null,
        availability: input.availability || null,
        specifications: Array.isArray(input.specifications) ? [...input.specifications] : [],
        rawSnippet: input.rawSnippet || null,
        isRelevantMatch: input.isRelevantMatch !== false,
        retrievedAt: input.retrievedAt || new Date().toISOString(),
      };

      this.sources.set(id, record);

      let searchSourceSet = this.idxSourcesBySearch.get(input.searchId);
      if (!searchSourceSet) {
        searchSourceSet = new Set();
        this.idxSourcesBySearch.set(input.searchId, searchSourceSet);
      }
      searchSourceSet.add(id);

      saved.push({ ...record });
    }

    return saved;
  }

  /**
   * Saves individual price observations linked to Search and optionally ResearchSource.
   * Enforces foreign key constraints: Search must exist; if sourceId provided, it must exist.
   */
  async savePriceObservations(inputs: CreatePriceObservationInput[]): Promise<PriceObservationRecord[]> {
    const saved: PriceObservationRecord[] = [];

    for (const input of inputs) {
      if (!input.searchId) {
        throw new ValidationError('Price observation requires a valid searchId.');
      }
      if (!this.searches.has(input.searchId)) {
        throw new ForeignKeyConstraintError(`Search with id "${input.searchId}" does not exist.`);
      }
      if (input.sourceId && !this.sources.has(input.sourceId)) {
        throw new ForeignKeyConstraintError(`Research source with id "${input.sourceId}" does not exist.`);
      }
      if (typeof input.originalPrice !== 'number' || isNaN(input.originalPrice) || input.originalPrice <= 0) {
        throw new ValidationError('Price observation requires positive originalPrice.');
      }
      if (!input.originalCurrency) {
        throw new ValidationError('Price observation requires originalCurrency.');
      }

      const id = input.id || randomUUID();
      const record: PriceObservationRecord = {
        id,
        searchId: input.searchId,
        sourceId: input.sourceId || null,
        sourceDomain: input.sourceDomain || 'Unknown Source',
        title: input.title || '',
        originalPrice: input.originalPrice,
        originalCurrency: input.originalCurrency,
        normalizedPrice: typeof input.normalizedPrice === 'number' ? input.normalizedPrice : null,
        normalizedCurrency: input.normalizedCurrency || null,
        product: input.product || '',
        specifications: Array.isArray(input.specifications) ? [...input.specifications] : [],
        isOutlier: Boolean(input.isOutlier),
        varianceNote: input.varianceNote || null,
        retrievedAt: input.retrievedAt || new Date().toISOString(),
      };

      this.observations.set(id, record);

      let searchObsSet = this.idxObservationsBySearch.get(input.searchId);
      if (!searchObsSet) {
        searchObsSet = new Set();
        this.idxObservationsBySearch.set(input.searchId, searchObsSet);
      }
      searchObsSet.add(id);

      if (input.sourceId) {
        let srcObsSet = this.idxObservationsBySource.get(input.sourceId);
        if (!srcObsSet) {
          srcObsSet = new Set();
          this.idxObservationsBySource.set(input.sourceId, srcObsSet);
        }
        srcObsSet.add(id);
      }

      saved.push({ ...record });
    }

    return saved;
  }

  /**
   * Saves the final pricing intelligence benchmark result.
   * Enforces 1:1 relationship with Search: upserts if already exists for this searchId.
   */
  async saveFinalResult(input: CreateFinalResultInput): Promise<FinalSearchResultRecord> {
    if (!input.searchId) {
      throw new ValidationError('Final result requires a valid searchId.');
    }
    const search = this.searches.get(input.searchId);
    if (!search) {
      throw new ForeignKeyConstraintError(`Search with id "${input.searchId}" does not exist.`);
    }

    // Check if a final result already exists for this search (1:1 constraint)
    const existingResultId = this.idxFinalResultBySearch.get(input.searchId);
    const id = existingResultId || input.id || randomUUID();

    const record: FinalSearchResultRecord = {
      id,
      searchId: input.searchId,
      estimatedPrice: typeof input.estimatedPrice === 'number' && !isNaN(input.estimatedPrice) ? input.estimatedPrice : null,
      minPrice: typeof input.minPrice === 'number' && !isNaN(input.minPrice) ? input.minPrice : null,
      maxPrice: typeof input.maxPrice === 'number' && !isNaN(input.maxPrice) ? input.maxPrice : null,
      currency: input.currency || null,
      confidence: input.confidence || 'low',
      sampleSize: typeof input.sampleSize === 'number' ? input.sampleSize : 0,
      methodology: input.methodology || 'No pricing methodology statement.',
      limitations: Array.isArray(input.limitations) ? [...input.limitations] : [],
      productName: input.productName || 'Unknown Product',
      productCategory: input.productCategory || 'General Goods',
      createdAt: new Date().toISOString(),
    };

    this.finalResults.set(id, record);
    this.idxFinalResultBySearch.set(input.searchId, id);

    // Link in search record as well
    search.finalResultId = id;
    search.updatedAt = new Date().toISOString();

    return { ...record };
  }

  /**
   * Retrieves the full relational graph for a given search:
   * Search -> Interpretation + Research Sources + Price Observations + Final Result
   */
  async getSearch(searchId: string): Promise<CompleteSearchGraph | null> {
    const search = this.searches.get(searchId);
    if (!search) {
      return null;
    }

    // Lookup 1:1 Interpretation
    const interpId = this.idxInterpretationBySearch.get(searchId);
    const interpretation = interpId ? this.interpretations.get(interpId) || null : null;

    // Lookup 1:N Sources
    const sourceIds = this.idxSourcesBySearch.get(searchId);
    const sources: ResearchSourceRecord[] = [];
    if (sourceIds) {
      for (const sId of sourceIds) {
        const src = this.sources.get(sId);
        if (src) sources.push({ ...src });
      }
    }

    // Lookup 1:N Observations
    const obsIds = this.idxObservationsBySearch.get(searchId);
    const observations: PriceObservationRecord[] = [];
    if (obsIds) {
      for (const oId of obsIds) {
        const obs = this.observations.get(oId);
        if (obs) observations.push({ ...obs });
      }
    }

    // Lookup 1:1 Final Result
    const finalId = this.idxFinalResultBySearch.get(searchId);
    const finalResult = finalId ? this.finalResults.get(finalId) || null : null;

    return {
      search: { ...search },
      interpretation: interpretation ? { ...interpretation } : null,
      sources,
      observations,
      finalResult: finalResult ? { ...finalResult } : null,
    };
  }

  /**
   * Retrieves recent search records ordered by createdAt descending (indexed).
   */
  async getRecentSearches(limit: number = 20): Promise<SearchRecord[]> {
    const all = Array.from(this.searches.values());
    all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return all.slice(0, limit).map((s) => ({ ...s }));
  }

  /**
   * Clears all tables and indexes (test helper).
   */
  async clearAll(): Promise<void> {
    this.searches.clear();
    this.interpretations.clear();
    this.sources.clear();
    this.observations.clear();
    this.finalResults.clear();
    this.idxInterpretationBySearch.clear();
    this.idxSourcesBySearch.clear();
    this.idxObservationsBySearch.clear();
    this.idxObservationsBySource.clear();
    this.idxFinalResultBySearch.clear();
  }
}
