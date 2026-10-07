/**
 * Product Research Layer (Prompt 5)
 * Modular, provider-agnostic external search coordinator.
 *
 * Takes structured query understanding from Prompt 4, dispatches targeted research queries
 * to external search providers if configured, normalizes results, extracts prices if present,
 * deduplicates findings, and enforces untrusted content security.
 */

import { QueryUnderstandingResult } from '@/src/types/queryUnderstanding';
import { NormalizedResearchResult, ResearchServiceResponse, ResearchStatus } from '@/src/types/research';
import { classifySource } from './sourceClassifier';

export interface ResearchProvider {
  name: string;
  isAvailable(): boolean;
  search(
    queries: string[],
    context: QueryUnderstandingResult
  ): Promise<{ status: ResearchStatus; results: NormalizedResearchResult[]; message?: string }>;
}

/**
 * Real External Web Search Provider using configurable HTTP Search APIs (e.g. SerpAPI, Tavily, Serper)
 */
class ExternalHttpSearchProvider implements ResearchProvider {
  name = 'External Web Search Provider';

  isAvailable(): boolean {
    const key = process.env.SEARCH_API_KEY || process.env.TAVILY_API_KEY || process.env.SERPER_API_KEY;
    return Boolean(key && key.trim().length > 0 && key !== 'MY_SEARCH_API_KEY');
  }

  async search(
    queries: string[],
    context: QueryUnderstandingResult
  ): Promise<{ status: ResearchStatus; results: NormalizedResearchResult[]; message?: string }> {
    const apiKey = process.env.SEARCH_API_KEY || process.env.TAVILY_API_KEY || process.env.SERPER_API_KEY;
    if (!apiKey) {
      return {
        status: 'provider_unconfigured',
        results: [],
        message: 'No external search provider API key (SEARCH_API_KEY) configured.',
      };
    }

    const allResults: NormalizedResearchResult[] = [];

    // Prioritize Nigerian market queries when no other region is explicitly specified
    const userExplicitlyRequestedOtherRegion = Boolean(
      /\b(uk|united kingdom|usa|us|united states|canada|germany|europe|australia|india|china|dubai|uae)\b/i.test(context.name) ||
      context.specifications?.some((s) => /\b(uk|usa|us|europe|canada)\b/i.test(s))
    );

    const targetedList: string[] = [];
    if (!userExplicitlyRequestedOtherRegion) {
      // Prioritize Nigeria queries
      targetedList.push(`${context.name} price Nigeria`);
      targetedList.push(`${context.name} price NGN Naira`);
      for (const q of queries) {
        if (!targetedList.includes(q)) targetedList.push(q);
      }
    } else {
      targetedList.push(...queries);
    }

    const targetQueries = targetedList.slice(0, 2);

    for (const q of targetQueries) {
      try {
        // If Tavily API is configured
        if (process.env.TAVILY_API_KEY || (process.env.SEARCH_API_KEY && process.env.SEARCH_API_KEY.startsWith('tvly-'))) {
          const tavilyKey = process.env.TAVILY_API_KEY || process.env.SEARCH_API_KEY;
          const res = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: tavilyKey,
              query: q,
              search_depth: 'basic',
              include_raw_content: false,
              max_results: 8,
            }),
            signal: AbortSignal.timeout(8000),
          });

          if (!res.ok) {
            if (res.status === 429) return { status: 'rate_limited', results: [], message: 'Search API rate limit reached.' };
            continue;
          }

          const data = await res.json();
          if (Array.isArray(data.results)) {
            for (const item of data.results) {
              const normalized = parseSnippetToResearchResult(item.title, item.url, item.content, context);
              if (normalized) allResults.push(normalized);
            }
          }
        } else if (process.env.SERPER_API_KEY) {
          // Serper.dev integration
          const res = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
              'X-API-KEY': process.env.SERPER_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q, num: 8 }),
            signal: AbortSignal.timeout(8000),
          });

          if (!res.ok) continue;
          const data = await res.json();
          if (Array.isArray(data.organic)) {
            for (const item of data.organic) {
              const normalized = parseSnippetToResearchResult(item.title, item.link, item.snippet, context);
              if (normalized) allResults.push(normalized);
            }
          }
        }
      } catch (err) {
        console.warn(`[SearchProvider] Query "${q}" failed:`, (err as any)?.message || err);
      }
    }

    const deduplicated = deduplicateResearchResults(allResults);
    return {
      status: deduplicated.length > 0 ? 'success' : 'no_results',
      results: deduplicated,
    };
  }
}

/**
 * Extracts seller, price, currency, availability, and classification from a retrieved web snippet.
 * Enforces classification rules: only commercial price sources are evaluated for usable prices.
 */
function parseSnippetToResearchResult(
  title: string,
  url: string,
  snippet: string,
  context: QueryUnderstandingResult
): NormalizedResearchResult | null {
  if (!title || !url) return null;

  // Sanitize untrusted content (prevent injection overrides)
  const cleanTitle = title.replace(/<[^>]*>?/gm, '').trim();
  const cleanSnippet = snippet ? snippet.replace(/<[^>]*>?/gm, '').trim() : '';

  // Extract domain for source and strictly enforce safe web protocols (http / https)
  let sourceDomain = 'Web Source';
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return null; // Reject javascript:, data:, file:, etc.
    }
    sourceDomain = parsedUrl.hostname.replace(/^www\./, '');
    if (!sourceDomain) return null;
  } catch {
    return null; // Reject malformed URLs
  }

  // Classify source (Prompt 5: Classify into PRICE_SOURCE, SPECIFICATION_SOURCE, etc.)
  const classificationInfo = classifySource(url, cleanTitle, cleanSnippet, context);
  const { unit, packQuantity, packUnit } = extractUnitAndPack(`${cleanTitle} ${cleanSnippet}`);

  // CRITICAL RULE: Only commercial price sources yield usable price observations.
  // Specification sources (GSMArena, Kimovil) or general references never yield commercial price observations.
  let price: number | null = null;
  let currency: string | null = null;

  if (classificationInfo.isCommercialPriceSource) {
    const extracted = extractPriceFromText(`${cleanTitle} ${cleanSnippet}`, context);
    price = extracted.price;
    currency = extracted.currency;
  }

  return {
    source: classificationInfo.sourceDomain || sourceDomain,
    title: cleanTitle,
    url,
    seller: classificationInfo.sourceDomain || sourceDomain,
    brand: context.brand || null,
    product: context.name,
    price,
    currency,
    availability: cleanSnippet.toLowerCase().includes('in stock') ? 'In Stock' : null,
    specifications: context.specifications || [],
    retrievedAt: new Date().toISOString(),
    rawSnippet: cleanSnippet.slice(0, 300),
    isRelevantMatch: checkProductRelevance(cleanTitle, cleanSnippet, context),
    classification: classificationInfo.classification,
    sourceRole: classificationInfo.sourceRole,
    sourceRoleGroup: classificationInfo.sourceRoleGroup,
    isCommercialPriceSource: classificationInfo.isCommercialPriceSource,
    isNigerianSource: classificationInfo.isNigerianSource,
    location: classificationInfo.locationLabel,
    unit,
    packQuantity,
    packUnit,
  };
}

/**
 * Extracts unit and pack quantity information if explicitly present in source text
 */
function extractUnitAndPack(text: string): { unit: string | null; packQuantity: number | null; packUnit: string | null } {
  let unit: string | null = null;
  let packQuantity: number | null = null;
  let packUnit: string | null = null;

  const unitMatch = text.match(/\bper\s+(sheet|bag|piece|pcs|roll|meter|sqm|kg|bottle|pack|box|unit)\b/i);
  if (unitMatch) {
    unit = `per ${unitMatch[1].toLowerCase()}`;
  }

  const packMatch = text.match(/\b(\d+)\s*(tablets?|capsules?|sachets?|bottles?|packs?|sheets?|bags?|pills?|softgels?|kg|g|liters?)\b/i);
  if (packMatch) {
    packQuantity = parseInt(packMatch[1], 10);
    packUnit = packMatch[2].toLowerCase();
  }

  return { unit, packQuantity, packUnit };
}

/**
 * Regular expressions to detect authentic pricing in unstructured web text
 * Enhanced for Nigerian NGN formats (N580,000, ₦580,000, NGN 580,000, 580,000 Naira).
 * Enforces Phase 1 eligibility: rejects model numbers, spec values, calendar years, and review scores.
 */
function extractPriceFromText(
  text: string,
  context?: QueryUnderstandingResult
): { price: number | null; currency: string | null } {
  // Disqualifier helper
  const isInvalidPriceNumber = (num: number, rawMatchStr: string): boolean => {
    // 1. Calendar years
    if (num >= 2020 && num <= 2030 && !rawMatchStr.includes(',') && !rawMatchStr.includes('.')) {
      return true;
    }
    // 2. Review scores (e.g. 4.5, 4.8 / 5)
    if (num <= 5.0 && (text.includes('/5') || text.includes('/ 5') || text.toLowerCase().includes('stars') || text.toLowerCase().includes('rating'))) {
      return true;
    }
    // 3. Model number matches (e.g. A55 -> num is 55, T14 -> num is 14)
    if (context?.model) {
      const modelNumMatch = context.model.match(/\d+/);
      if (modelNumMatch && parseInt(modelNumMatch[0], 10) === num) {
        return true;
      }
    }
    if (context?.name) {
      const nameNumMatch = context.name.match(/\b([A-Za-z]+)?(\d+)\b/);
      if (nameNumMatch && parseInt(nameNumMatch[2], 10) === num) {
        return true;
      }
    }
    // 4. Specification value matches (e.g. 256GB -> 256, 12mm -> 12, 5000mAh -> 5000, 120Hz -> 120)
    if (context?.specifications) {
      for (const spec of context.specifications) {
        const specNum = spec.match(/\b\d+\b/);
        if (specNum && parseInt(specNum[0], 10) === num) {
          // If in NGN and under 1,000, it's definitely a spec value, not a commercial phone/plywood/tool price
          if (num < 1000) return true;
        }
      }
    }
    return false;
  };

  // Check NGN prefix: ₦, NGN, Naira, N580,000, N 580,000
  const ngnPrefix = text.match(/(?:₦|NGN|Naira|\bN)\s?([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]{2})?|[0-9]{4,}(?:\.[0-9]{2})?)/i);
  if (ngnPrefix && ngnPrefix[1]) {
    const num = parseFloat(ngnPrefix[1].replace(/,/g, ''));
    if (!isNaN(num) && num > 0 && !isInvalidPriceNumber(num, ngnPrefix[1])) {
      return { price: num, currency: 'NGN' };
    }
  }

  // Suffix NGN / Naira: 580,000 NGN or 580,000 Naira
  const ngnSuffix = text.match(/([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]{2})?|[0-9]{4,}(?:\.[0-9]{2})?)\s?(?:NGN|Naira)/i);
  if (ngnSuffix && ngnSuffix[1]) {
    const num = parseFloat(ngnSuffix[1].replace(/,/g, ''));
    if (!isNaN(num) && num > 0 && !isInvalidPriceNumber(num, ngnSuffix[1])) {
      return { price: num, currency: 'NGN' };
    }
  }

  // Check USD ($ or USD)
  const usdMatch = text.match(/(?:\$|USD)\s?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i);
  if (usdMatch && usdMatch[1]) {
    const num = parseFloat(usdMatch[1].replace(/,/g, ''));
    if (!isNaN(num) && num > 0 && !isInvalidPriceNumber(num, usdMatch[1])) {
      return { price: num, currency: 'USD' };
    }
  }

  // Check EUR (€ or EUR)
  const eurMatch = text.match(/(?:€|EUR)\s?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i);
  if (eurMatch && eurMatch[1]) {
    const num = parseFloat(eurMatch[1].replace(/,/g, ''));
    if (!isNaN(num) && num > 0 && !isInvalidPriceNumber(num, eurMatch[1])) {
      return { price: num, currency: 'EUR' };
    }
  }

  // Check GBP (£ or GBP)
  const gbpMatch = text.match(/(?:£|GBP)\s?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i);
  if (gbpMatch && gbpMatch[1]) {
    const num = parseFloat(gbpMatch[1].replace(/,/g, ''));
    if (!isNaN(num) && num > 0 && !isInvalidPriceNumber(num, gbpMatch[1])) {
      return { price: num, currency: 'GBP' };
    }
  }

  return { price: null, currency: null };
}

/**
 * Assesses whether the result is genuinely relevant to the queried product specifications
 */
function checkProductRelevance(title: string, snippet: string, context: QueryUnderstandingResult): boolean {
  const combined = `${title} ${snippet}`.toLowerCase();
  const nameTokens = context.name.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  
  if (nameTokens.length === 0) return true;
  const matchCount = nameTokens.filter((token) => combined.includes(token)).length;
  return matchCount / nameTokens.length >= 0.5;
}

/**
 * Deduplicates results by canonical URL or matching title and seller,
 * prioritizing Nigerian commercial sources first.
 */
export function deduplicateResearchResults(results: NormalizedResearchResult[]): NormalizedResearchResult[] {
  const seenUrls = new Set<string>();
  const seenSignatures = new Set<string>();
  const deduplicated: NormalizedResearchResult[] = [];

  // Sort candidate results so Nigerian commercial sources are given precedence
  const sorted = [...results].sort((a, b) => {
    const aNigScore = (a.isNigerianSource ? 10 : 0) + (a.isCommercialPriceSource ? 5 : 0) + (a.price ? 2 : 0);
    const bNigScore = (b.isNigerianSource ? 10 : 0) + (b.isCommercialPriceSource ? 5 : 0) + (b.price ? 2 : 0);
    return bNigScore - aNigScore;
  });

  for (const item of sorted) {
    const cleanUrl = item.url.split('?')[0].toLowerCase();
    const signature = `${item.source.toLowerCase()}::${item.title.toLowerCase().slice(0, 40)}`;

    if (!seenUrls.has(cleanUrl) && !seenSignatures.has(signature)) {
      seenUrls.add(cleanUrl);
      seenSignatures.add(signature);
      deduplicated.push(item);
    }
  }

  return deduplicated;
}

/**
 * Primary Product Research Coordinator
 */
export async function executeProductResearch(
  understanding: QueryUnderstandingResult
): Promise<ResearchServiceResponse> {
  const provider = new ExternalHttpSearchProvider();
  const queriesToRun = understanding.search_queries && understanding.search_queries.length > 0
    ? understanding.search_queries
    : [understanding.name];

  if (!provider.isAvailable()) {
    return {
      status: 'provider_unconfigured',
      provider: 'None (Unconfigured)',
      results: [],
      executedQueries: queriesToRun,
      totalFound: 0,
      message: 'External search provider (SEARCH_API_KEY) is not configured in the server environment. No fake search results were generated in accordance with PRICERA core rules.',
    };
  }

  const { status, results, message } = await provider.search(queriesToRun, understanding);

  return {
    status,
    provider: provider.name,
    results,
    executedQueries: queriesToRun,
    totalFound: results.length,
    message,
  };
}
