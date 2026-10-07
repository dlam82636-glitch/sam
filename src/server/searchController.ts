/**
 * PRICERA Search Coordinator (Prompts 3, 4, 5 & 6)
 *
 * Orchestrates the full market intelligence pipeline:
 * 1. Server-side validation
 * 2. In-flight request deduplication & memory cache
 * 3. AI Query Understanding (Prompt 4)
 * 4. Product Research Layer (Prompt 5)
 * 5. Pricing Intelligence Layer (Prompt 6)
 * 6. Safe, structured response formatting
 */

import { Request, Response } from 'express';
import { validateServerSearchRequest } from '@/src/lib/validation';
import {
  understandProductQuery,
  AIConfigurationError,
  AITimeoutError,
  AISchemaValidationError,
  AIProviderError,
} from '@/src/server/ai/queryUnderstandingService';
import { executeProductResearch } from '@/src/server/research/searchService';
import { calculatePricingIntelligence } from '@/src/server/pricing/pricingEngine';
import { PriceraResearchResponse } from '@/src/types/pipeline';
import { getDatabaseRepository, ResearchSourceRecord } from '@/src/server/db';

// In-flight request deduplication map: normalizedQuery -> active Promise
const inFlightRequests = new Map<string, Promise<PriceraResearchResponse>>();

// Short-term memory cache: normalizedQuery -> { data, timestamp } (TTL: 60 seconds)
const CACHE_TTL_MS = 60 * 1000;
const recentSearches = new Map<string, { data: PriceraResearchResponse; timestamp: number }>();

function cleanExpiredCache() {
  const now = Date.now();
  for (const [key, val] of recentSearches.entries()) {
    if (now - val.timestamp > CACHE_TTL_MS) {
      recentSearches.delete(key);
    }
  }
}

export async function handleSearchRequest(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  cleanExpiredCache();

  // 1. Server-side request validation
  const validation = validateServerSearchRequest(req.body);
  if (!validation.isValid) {
    res.status(validation.statusCode || 400).json({
      success: false,
      query: typeof req.body?.query === 'string' ? req.body.query : '',
      normalizedQuery: validation.sanitizedQuery,
      error: validation.errorMessage || 'Invalid search query.',
      code: 'INVALID_QUERY',
    });
    return;
  }

  const sanitizedQuery = validation.sanitizedQuery;
  const cacheKey = sanitizedQuery.toLowerCase();

  // 2. Check short-term memory cache
  const cached = recentSearches.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    const elapsed = Date.now() - startTime;
    res.status(200).json({
      ...cached.data,
      search: {
        ...cached.data.search,
        cached: true,
        executionTimeMs: elapsed,
      },
      cached: true,
      executionTimeMs: elapsed,
    });
    return;
  }

  // 3. In-flight request deduplication & persistence orchestration
  let searchPromise = inFlightRequests.get(cacheKey);

  if (!searchPromise) {
    searchPromise = (async () => {
      const repo = getDatabaseRepository();

      // Step 0: Persist initial Search root record (Prompt 8)
      const searchRecord = await repo.createSearch({
        originalQuery: sanitizedQuery,
        normalizedQuery: sanitizedQuery,
        status: 'processing',
      });

      try {
        // Step A: AI Query Understanding (Prompt 4)
        const understanding = await understandProductQuery(sanitizedQuery, 35000);

        // Persist Query Interpretation record linked to Search
        await repo.saveQueryInterpretation({
          searchId: searchRecord.id,
          productName: understanding.name,
          category: understanding.category,
          description: understanding.description,
          brand: understanding.brand,
          model: understanding.model,
          material: understanding.material,
          specifications: understanding.specifications || [],
          possibleVariants: understanding.possible_variants || [],
          searchQueries: understanding.search_queries || [],
          confidence: understanding.confidence,
          uncertainties: understanding.uncertainties || [],
        });

        // Step B: Product Research Layer (Prompt 5)
        const researchResponse = await executeProductResearch(understanding);

        // Persist Research Sources linked to Search
        let savedSources: ResearchSourceRecord[] = [];
        if (researchResponse.results && researchResponse.results.length > 0) {
          savedSources = await repo.saveResearchSources(
            researchResponse.results.map((res) => ({
              searchId: searchRecord.id,
              title: res.title,
              url: res.url,
              seller: res.seller,
              brand: res.brand,
              product: res.product,
              price: res.price,
              currency: res.currency,
              availability: res.availability,
              specifications: res.specifications || [],
              rawSnippet: res.rawSnippet,
              isRelevantMatch: res.isRelevantMatch,
              retrievedAt: res.retrievedAt,
            }))
          );
        }

        // Step C: Pricing Intelligence Layer (Prompt 6)
        const pricingResult = calculatePricingIntelligence(researchResponse.results, understanding);

        // Persist Price Observations linked to Search
        if (pricingResult.priceObservations && pricingResult.priceObservations.length > 0) {
          await repo.savePriceObservations(
            pricingResult.priceObservations.map((obs) => {
              const matchedSrc = savedSources.find((s) => s.url === obs.url);
              return {
                searchId: searchRecord.id,
                sourceId: matchedSrc?.id || null,
                sourceDomain: obs.source,
                title: obs.title,
                originalPrice: obs.price,
                originalCurrency: obs.currency,
                normalizedPrice: null,
                normalizedCurrency: null,
                product: obs.product,
                specifications: obs.specifications || [],
                isOutlier: Boolean(obs.isOutlier),
                varianceNote: obs.varianceNote || undefined,
                retrievedAt: obs.retrievedAt,
              };
            })
          );
        }

        const isResearchAvailable = researchResponse.status !== 'provider_unconfigured';
        const hasPriceEstimate = pricingResult.estimatedPrice !== null;

        const pipelineStatus = {
          understanding: 'complete',
          research: isResearchAvailable
            ? (researchResponse.status === 'success' || researchResponse.status === 'no_results' ? 'complete' : 'failed')
            : 'unavailable',
          compare: isResearchAvailable ? 'complete' : 'unavailable',
          pricing: hasPriceEstimate ? 'complete' : (isResearchAvailable ? 'complete' : 'unavailable'),
        };

        const overallStatus: 'complete' | 'partial' = (!isResearchAvailable || !hasPriceEstimate) ? 'partial' : 'complete';

        // Persist Final Search Result record (Prompt 8)
        const finalResult = await repo.saveFinalResult({
          searchId: searchRecord.id,
          estimatedPrice: pricingResult.estimatedPrice,
          minPrice: pricingResult.minPrice,
          maxPrice: pricingResult.maxPrice,
          currency: pricingResult.currency,
          confidence: pricingResult.confidence,
          sampleSize: pricingResult.sampleSize,
          methodology: pricingResult.methodology,
          limitations: pricingResult.limitations,
          productName: understanding.name,
          productCategory: understanding.category,
        });

        // Update root Search status and final result link
        await repo.updateSearchStatus(searchRecord.id, overallStatus, finalResult.id);

        const totalElapsed = Date.now() - startTime;

        const responsePayload: PriceraResearchResponse = {
          search: {
            query: sanitizedQuery,
            timestamp: new Date().toISOString(),
            status: overallStatus,
            executionTimeMs: totalElapsed,
            cached: false,
          },
          product: {
            name: understanding.name,
            category: understanding.category,
            description: understanding.description,
            brand: understanding.brand,
            model: understanding.model,
            material: understanding.material,
            specifications: understanding.specifications || [],
            possibleVariants: understanding.possible_variants || [],
            confidence: understanding.confidence,
            uncertainties: understanding.uncertainties || [],
          },
          research: {
            status: researchResponse.status,
            sources: researchResponse.results,
            sourceCount: researchResponse.results.length,
            provider: researchResponse.provider,
            executedQueries: researchResponse.executedQueries,
            message: researchResponse.message,
          },
          pricing: {
            currency: pricingResult.currency,
            minPrice: pricingResult.minPrice,
            maxPrice: pricingResult.maxPrice,
            estimatedPrice: pricingResult.estimatedPrice,
            confidence: pricingResult.confidence,
            priceObservations: pricingResult.priceObservations,
            methodology: pricingResult.methodology,
            limitations: pricingResult.limitations,
            sampleSize: pricingResult.sampleSize,
          },
          pipeline: pipelineStatus,

          // Legacy & compatibility aliases
          success: true,
          query: sanitizedQuery,
          normalizedQuery: sanitizedQuery,
          understanding,
          executionTimeMs: totalElapsed,
          cached: false,
        };

        // Store in memory cache
        recentSearches.set(cacheKey, { data: responsePayload, timestamp: Date.now() });
        return responsePayload;
      } catch (err: unknown) {
        // Record failure in database without creating misleading successful records (Prompt 8 rule)
        await repo.updateSearchStatus(
          searchRecord.id,
          'failed',
          null,
          err instanceof Error ? err.message : String(err)
        ).catch((dbErr) => console.warn('[Database Error logging search failure]:', dbErr));
        throw err;
      }
    })().finally(() => {
      inFlightRequests.delete(cacheKey);
    });

    inFlightRequests.set(cacheKey, searchPromise);
  }

  // 4. Await result and handle errors
  try {
    const data = await searchPromise;
    res.status(200).json(data);
  } catch (err: unknown) {
    console.error(`[PRICERA Search Error] for query "${sanitizedQuery}":`, err instanceof Error ? err.message : err);

    if (err instanceof AIConfigurationError) {
      res.status(503).json({
        success: false,
        query: sanitizedQuery,
        normalizedQuery: sanitizedQuery,
        error: 'The AI query-understanding service is currently not configured on this server.',
        code: 'AI_NOT_CONFIGURED',
      });
      return;
    }

    if (err instanceof AITimeoutError) {
      res.status(504).json({
        success: false,
        query: sanitizedQuery,
        normalizedQuery: sanitizedQuery,
        error: 'The AI query-understanding service timed out. Please try your search again.',
        code: 'AI_TIMEOUT',
      });
      return;
    }

    if (err instanceof AISchemaValidationError) {
      res.status(502).json({
        success: false,
        query: sanitizedQuery,
        normalizedQuery: sanitizedQuery,
        error: 'The AI service returned a malformed response that did not pass schema verification.',
        code: 'AI_SCHEMA_MISMATCH',
      });
      return;
    }

    res.status(502).json({
      success: false,
      query: sanitizedQuery,
      normalizedQuery: sanitizedQuery,
      error: 'An unexpected error occurred while analyzing the product query. Please try again.',
      code: 'UPSTREAM_ERROR',
    });
  }
}
