/**
 * Pricing Intelligence Layer (Prompt 6)
 *
 * Receives normalized research results, extracts and validates price observations,
 * respects product variants, groups by currency, detects outliers, and calculates
 * transparent statistical market estimates (median) with documented methodology & limitations.
 *
 * CRITICAL RULE: Never fabricates prices or invents exchange rates.
 */

import { QueryUnderstandingResult } from '@/src/types/queryUnderstanding';
import { NormalizedResearchResult } from '@/src/types/research';
import {
  PriceObservation,
  PricingIntelligenceResult,
  PricingConfidence,
  ExcludedObservation,
  EvidenceCounts,
} from '@/src/types/pricing';

export function calculatePricingIntelligence(
  researchResults: NormalizedResearchResult[],
  understanding: QueryUnderstandingResult
): PricingIntelligenceResult {
  const limitations: string[] = [];
  const excludedObservations: ExcludedObservation[] = [];

  const totalResearchSources = researchResults.length;
  const referenceSourcesCount = researchResults.filter(
    (item) =>
      item.isCommercialPriceSource === false ||
      item.classification === 'SPECIFICATION_SOURCE' ||
      item.classification === 'GENERAL_REFERENCE'
  ).length;
  const commercialSourcesCount = researchResults.filter(
    (item) =>
      item.isCommercialPriceSource !== false &&
      item.classification !== 'SPECIFICATION_SOURCE' &&
      item.classification !== 'GENERAL_REFERENCE'
  ).length;

  // Step 1: Extract and validate price observations
  const candidateObservations: PriceObservation[] = [];

  for (const item of researchResults) {
    if (item.price === null || item.price === undefined) continue;

    // Reject non-numeric, negative, or zero values
    if (typeof item.price !== 'number' || isNaN(item.price) || !isFinite(item.price) || item.price <= 0) {
      excludedObservations.push({
        source: item.source,
        title: item.title,
        price: item.price ?? null,
        currency: item.currency ?? null,
        reason: 'invalid_price',
        explanation: 'Price is non-numeric, negative, or zero.',
        url: item.url,
      });
      continue;
    }

    // Exclude sources that are strictly specification portals or non-commercial references (Prompt 5 rule)
    if (item.isCommercialPriceSource === false || item.classification === 'SPECIFICATION_SOURCE' || item.classification === 'GENERAL_REFERENCE') {
      excludedObservations.push({
        source: item.source,
        title: item.title,
        price: item.price,
        currency: item.currency,
        reason: 'non_commercial_source',
        explanation: 'Source is a technical specification database or reference portal, not a commercial store.',
        url: item.url,
      });
      limitations.push(`Listing "${item.title.slice(0, 30)}..." excluded from price calculations as it is a specification/reference source, not a commercial store.`);
      continue;
    }

    // Require currency
    const currency = item.currency ? item.currency.toUpperCase().trim() : null;
    if (!currency) {
      excludedObservations.push({
        source: item.source,
        title: item.title,
        price: item.price,
        currency: null,
        reason: 'invalid_price',
        explanation: 'Missing currency identifier.',
        url: item.url,
      });
      limitations.push(`Listing "${item.title.slice(0, 30)}..." excluded due to missing currency identifier.`);
      continue;
    }

    // Check variant compatibility (e.g. 128GB vs 256GB, 12mm vs 18mm)
    if (!isVariantCompatible(item.title, understanding)) {
      excludedObservations.push({
        source: item.source,
        title: item.title,
        price: item.price,
        currency,
        reason: 'variant_mismatch',
        explanation: 'Listing title represents a distinct or non-matching product variant.',
        url: item.url,
      });
      limitations.push(`Listing "${item.title.slice(0, 30)}..." excluded as a distinct or non-matching product variant.`);
      continue;
    }

    candidateObservations.push({
      source: item.source,
      title: item.title,
      seller: item.seller,
      product: item.product,
      price: item.price,
      currency,
      specifications: item.specifications,
      retrievedAt: item.retrievedAt,
      url: item.url,
      classification: item.classification,
      isNigerianSource: item.isNigerianSource,
      location: item.location,
    });
  }

  // Step 2: Zero price observations case
  if (candidateObservations.length === 0) {
    const counts: EvidenceCounts = {
      totalResearchSources,
      referenceSourcesCount,
      commercialSourcesCount,
      usablePriceObservations: 0,
      comparableListingsCount: 0,
      excludedObservationsCount: excludedObservations.length,
    };

    return {
      currency: null,
      minPrice: null,
      maxPrice: null,
      estimatedPrice: null,
      confidence: 'low',
      priceObservations: [],
      excludedObservations,
      counts,
      methodology: 'No reliable market prices were found from the available sources.',
      limitations: [
        'No verified commercial price observations could be extracted from available search listings.',
        'Market pricing remains undetermined until verified commercial quotes are obtained.',
      ],
      sampleSize: 0,
      isForeignMarketEvidence: false,
      nigerianSourceCount: 0,
    };
  }

  // Step 3: Group by currency & determine primary currency
  const currencyGroups = new Map<string, PriceObservation[]>();
  for (const obs of candidateObservations) {
    const list = currencyGroups.get(obs.currency) || [];
    list.push(obs);
    currencyGroups.set(obs.currency, list);
  }

  // Prioritize Nigerian market (Prompt 5 Rule 1):
  // When user does NOT specify an explicit foreign country/region, prioritize Nigerian sources and NGN prices.
  const userExplicitlyRequestedOtherRegion = Boolean(
    /\b(uk|united kingdom|usa|us|united states|canada|germany|europe|australia|india|china|dubai|uae)\b/i.test(understanding.name) ||
    understanding.specifications?.some((s) => /\b(uk|usa|us|europe|canada)\b/i.test(s))
  );

  let targetCurrency = 'USD';
  let isForeignMarketEvidence = false;

  if (!userExplicitlyRequestedOtherRegion && currencyGroups.has('NGN')) {
    // Prefer NGN observations when reliable Nigerian sources are available
    targetCurrency = 'NGN';
    isForeignMarketEvidence = false;
  } else {
    // Pick currency group with the largest number of observations
    let maxCount = -1;
    for (const [curr, list] of currencyGroups.entries()) {
      if (list.length > maxCount) {
        maxCount = list.length;
        targetCurrency = curr;
      }
    }

    if (targetCurrency !== 'NGN') {
      isForeignMarketEvidence = true;
      limitations.push('Result is based on foreign-market evidence (No verified Nigerian merchant quotes retrieved in search sample).');
    }
  }

  // Note other excluded currencies without inventing exchange rates
  for (const [curr, list] of currencyGroups.entries()) {
    if (curr !== targetCurrency) {
      limitations.push(
        `${list.length} listing(s) quoted in ${curr} were excluded because PRICERA preserves original currencies and does not fabricate unverified exchange rates.`
      );
      for (const obs of list) {
        excludedObservations.push({
          source: obs.source,
          title: obs.title,
          price: obs.price,
          currency: obs.currency,
          reason: 'market_mismatch',
          explanation: `Listing quoted in ${curr} excluded to preserve original currency without unverified currency conversion.`,
          url: obs.url,
        });
      }
    }
  }

  const activeObservations = currencyGroups.get(targetCurrency) || [];
  if (activeObservations.length === 0) {
    const counts: EvidenceCounts = {
      totalResearchSources,
      referenceSourcesCount,
      commercialSourcesCount,
      usablePriceObservations: candidateObservations.length,
      comparableListingsCount: 0,
      excludedObservationsCount: excludedObservations.length,
    };

    return {
      currency: targetCurrency,
      minPrice: null,
      maxPrice: null,
      estimatedPrice: null,
      confidence: 'low',
      priceObservations: [],
      excludedObservations,
      counts,
      methodology: `No reliable ${targetCurrency} listings available for estimation.`,
      limitations,
      sampleSize: 0,
      isForeignMarketEvidence,
      nigerianSourceCount: 0,
    };
  }

  // Step 4: Single observation case (Prompt 5 Rule 4)
  if (activeObservations.length === 1) {
    const single = activeObservations[0];
    const methodology = isForeignMarketEvidence
      ? `Based on 1 available foreign commercial listing in ${targetCurrency} (Reference price · Foreign-Market Evidence).`
      : `Based on 1 available comparable source listing in ${targetCurrency} (Reference price).`;

    const counts: EvidenceCounts = {
      totalResearchSources,
      referenceSourcesCount,
      commercialSourcesCount,
      usablePriceObservations: candidateObservations.length,
      comparableListingsCount: 1,
      excludedObservationsCount: excludedObservations.length,
    };

    return {
      currency: targetCurrency,
      minPrice: single.price,
      maxPrice: single.price,
      estimatedPrice: single.price,
      confidence: 'low',
      priceObservations: activeObservations,
      excludedObservations,
      counts,
      methodology,
      limitations: [
        'Only one usable commercial price was found, so PRICERA cannot establish a reliable market range or competitive median. Treat this figure as a reference quote rather than an established market price.',
        ...limitations,
      ],
      sampleSize: 1,
      spreadPercent: 0,
      isForeignMarketEvidence,
      nigerianSourceCount: activeObservations.filter((o) => o.isNigerianSource).length,
    };
  }

  // Step 5: Multiple observations - Outlier detection and median calculation
  // Sort prices ascending
  const sortedObs = [...activeObservations].sort((a, b) => a.price - b.price);
  const rawPrices = sortedObs.map((o) => o.price);

  // Compute preliminary median
  const medianRaw = calculateMedian(rawPrices);

  // Outlier detection: filter values that are more than 3.5x higher or less than 0.25x lower than median
  const validObservations: PriceObservation[] = [];
  for (const obs of sortedObs) {
    if (obs.price > medianRaw * 3.5 || obs.price < medianRaw * 0.25) {
      obs.isOutlier = true;
      obs.varianceNote = `Flagged as extreme outlier (${obs.price} vs median ~${medianRaw})`;
      excludedObservations.push({
        source: obs.source,
        title: obs.title,
        price: obs.price,
        currency: obs.currency,
        reason: 'statistical_outlier',
        explanation: `Extreme statistical outlier (${obs.price} vs median ~${medianRaw}).`,
        url: obs.url,
      });
      limitations.push(
        `Observation from ${obs.source} (${obs.price} ${targetCurrency}) excluded as an extreme market outlier.`
      );
    } else {
      validObservations.push(obs);
    }
  }

  // Use valid non-outlier observations (or fallback to sortedObs if filtering was too aggressive)
  const finalObs = validObservations.length > 0 ? validObservations : sortedObs;
  const finalPrices = finalObs.map((o) => o.price);

  const minPrice = finalPrices[0];
  const maxPrice = finalPrices[finalPrices.length - 1];
  const estimatedPrice = calculateMedian(finalPrices);

  const spreadAmount = maxPrice - minPrice;
  const spreadPercent = estimatedPrice > 0 ? Math.round((spreadAmount / estimatedPrice) * 100) : 0;

  // Step 6: Confidence evaluation based on evidence quality
  let confidence: PricingConfidence = 'low';
  if (finalObs.length >= 4 && spreadPercent <= 35) {
    confidence = 'high';
  } else if (finalObs.length >= 2 && spreadPercent <= 65) {
    confidence = 'medium';
  } else {
    confidence = 'low';
    if (spreadPercent > 65) {
      limitations.push(
        `High price variance (${spreadPercent}% spread between min and max) observed across sellers.`
      );
    }
  }

  // Common market limitations
  limitations.push('Quotes exclude localized delivery freight, volume discounts, and municipal tax surcharges.');

  const methodology = isForeignMarketEvidence
    ? `Estimated from ${finalObs.length} comparable ${targetCurrency} listings using median observed price (Foreign-Market Evidence).`
    : `Estimated from ${finalObs.length} comparable ${targetCurrency} listings using the median observed price.`;

  const counts: EvidenceCounts = {
    totalResearchSources,
    referenceSourcesCount,
    commercialSourcesCount,
    usablePriceObservations: candidateObservations.length,
    comparableListingsCount: finalObs.length,
    excludedObservationsCount: excludedObservations.length,
  };

  return {
    currency: targetCurrency,
    minPrice,
    maxPrice,
    estimatedPrice,
    confidence,
    priceObservations: sortedObs,
    excludedObservations,
    counts,
    methodology,
    limitations,
    sampleSize: finalObs.length,
    spreadPercent,
    isForeignMarketEvidence,
    nigerianSourceCount: finalObs.filter((o) => o.isNigerianSource).length,
  };
}

function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const mid = Math.floor(numbers.length / 2);
  if (numbers.length % 2 !== 0) {
    return numbers[mid];
  }
  return Math.round(((numbers[mid - 1] + numbers[mid]) / 2) * 100) / 100;
}

/**
 * Checks if a retrieved listing title conflicts with the target specification variant
 */
function isVariantCompatible(title: string, context: QueryUnderstandingResult): boolean {
  const lowerTitle = title.toLowerCase();

  // Storage variant checks (e.g. 256GB vs 128GB)
  if (context.specifications?.some((s) => /256\s?gb/i.test(s))) {
    if (/\b128\s?gb\b/i.test(lowerTitle) && !/\b256\s?gb\b/i.test(lowerTitle)) return false;
    if (/\b512\s?gb\b/i.test(lowerTitle)) return false;
  }
  if (context.specifications?.some((s) => /128\s?gb/i.test(s))) {
    if (/\b256\s?gb\b/i.test(lowerTitle)) return false;
  }

  // Thickness / dimension checks (e.g. 12mm vs 18mm)
  if (context.specifications?.some((s) => /12\s?mm/i.test(s))) {
    if (/\b18\s?mm\b/i.test(lowerTitle) || /\b19\s?mm\b/i.test(lowerTitle)) return false;
    if (/\b6\s?mm\b/i.test(lowerTitle) || /\b9\s?mm\b/i.test(lowerTitle)) return false;
  }

  return true;
}
