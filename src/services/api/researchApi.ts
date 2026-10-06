/**
 * PRICERA API Client Coordinator (Prompts 3, 4, 5 & 6)
 *
 * Dispatches validated text-search queries to the server-side endpoint (POST /api/search).
 * Coordinates signature pipeline stage transitions (Understand -> Research -> Compare -> Estimate),
 * duplicate request prevention, and structured response handling.
 */

import { validateProductQuery } from '@/src/lib/validation';
import { SignatureStageId, PriceraResearchResponse } from '@/src/types/pipeline';

export interface ResearchRequestOptions {
  onStageTransition?: (stage: SignatureStageId, message: string) => void;
  signal?: AbortSignal;
}

// In-flight client request lock to prevent accidental duplicate parallel triggers
let activeQueryPromise: { query: string; promise: Promise<PriceraResearchResponse> } | null = null;

export async function executeSearchQuery(
  rawQuery: string,
  options?: ResearchRequestOptions
): Promise<PriceraResearchResponse> {
  const { onStageTransition, signal } = options || {};

  // Step 1: Client Validation
  const validation = validateProductQuery(rawQuery);
  if (!validation.isValid) {
    throw new Error(validation.errorMessage || 'Invalid search query.');
  }

  const sanitizedQuery = validation.sanitizedQuery;
  const normalizedKey = sanitizedQuery.toLowerCase();

  // Step 2: Client Duplicate Submission Guard
  if (activeQueryPromise && activeQueryPromise.query === normalizedKey) {
    return activeQueryPromise.promise;
  }

  // Visual signature pipeline progression
  onStageTransition?.('understand', 'Analyzing product specifications, variants, and query intent with AI...');

  const requestPromise = (async () => {
    try {
      // Simulate pipeline progression visual signals while backend runs
      const stepTimer1 = setTimeout(() => {
        onStageTransition?.('research', 'Dispatching prospective supplier queries across catalogs...');
      }, 700);

      const stepTimer2 = setTimeout(() => {
        onStageTransition?.('compare', 'Grouping listings, normalizing currencies, and checking variant match...');
      }, 1600);

      const stepTimer3 = setTimeout(() => {
        onStageTransition?.('estimate', 'Executing median pricing algorithm and evaluating confidence...');
      }, 2400);

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sanitizedQuery }),
        signal,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);

      let json: any;
      try {
        json = await response.json();
      } catch (parseErr) {
        throw new Error('Server returned an unparseable response. Please try again.');
      }

      if (!response.ok || !json.success) {
        const errorMsg = json.error || `Search request failed with status ${response.status}.`;
        throw new Error(errorMsg);
      }

      onStageTransition?.('estimate', 'Market analysis synthesis complete.');

      return json as PriceraResearchResponse;
    } finally {
      if (activeQueryPromise && activeQueryPromise.query === normalizedKey) {
        activeQueryPromise = null;
      }
    }
  })();

  activeQueryPromise = { query: normalizedKey, promise: requestPromise };
  return requestPromise;
}
