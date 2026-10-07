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
  onStageTransition?.('understand', 'Understanding your product: Identifying product type, brand, specifications and variants.');

  const requestPromise = (async () => {
    let stepTimer1: NodeJS.Timeout | undefined;
    let stepTimer2: NodeJS.Timeout | undefined;
    let stepTimer3: NodeJS.Timeout | undefined;

    try {
      // Realistic pipeline progression visual signals while backend analyzes
      stepTimer1 = setTimeout(() => {
        onStageTransition?.('research', 'Researching the market: Looking across available sources for comparable products and prices.');
      }, 1200);

      stepTimer2 = setTimeout(() => {
        onStageTransition?.('compare', 'Comparing prices: Checking comparable observations and filtering mismatched variants.');
      }, 2600);

      stepTimer3 = setTimeout(() => {
        onStageTransition?.('estimate', 'Estimating market price: Calculating a transparent estimate from available evidence.');
      }, 4000);

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sanitizedQuery }),
        signal,
      });

      if (stepTimer1) clearTimeout(stepTimer1);
      if (stepTimer2) clearTimeout(stepTimer2);
      if (stepTimer3) clearTimeout(stepTimer3);

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
      if (stepTimer1) clearTimeout(stepTimer1);
      if (stepTimer2) clearTimeout(stepTimer2);
      if (stepTimer3) clearTimeout(stepTimer3);

      if (activeQueryPromise && activeQueryPromise.query === normalizedKey) {
        activeQueryPromise = null;
      }
    }
  })();

  activeQueryPromise = { query: normalizedKey, promise: requestPromise };
  return requestPromise;
}
