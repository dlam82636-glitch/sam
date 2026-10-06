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
    res.status(200).json({
      ...cached.data,
      cached: true,
      executionTimeMs: Date.now() - startTime,
    });
    return;
  }

  // 3. In-flight request deduplication
  let searchPromise = inFlightRequests.get(cacheKey);

  if (!searchPromise) {
    searchPromise = (async () => {
      // Step A: AI Query Understanding (Prompt 4)
      const understanding = await understandProductQuery(sanitizedQuery, 35000);

      // Step B: Product Research Layer (Prompt 5)
      const researchResponse = await executeProductResearch(understanding);

      // Step C: Pricing Intelligence Layer (Prompt 6)
      const pricingResult = calculatePricingIntelligence(researchResponse.results, understanding);

      const responsePayload: PriceraResearchResponse = {
        success: true,
        query: sanitizedQuery,
        normalizedQuery: sanitizedQuery,
        understanding,
        research: researchResponse,
        pricing: pricingResult,
        executionTimeMs: Date.now() - startTime,
        cached: false,
      };

      // Store in memory cache
      recentSearches.set(cacheKey, { data: responsePayload, timestamp: Date.now() });
      return responsePayload;
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
