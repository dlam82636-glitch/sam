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
    // Search using top 2 targeted queries to respect rate limits
    const targetQueries = queries.slice(0, 2);

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
              max_results: 5,
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
            body: JSON.stringify({ q, num: 5 }),
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
 * Extracts seller, price, currency, and availability from a retrieved web snippet
 * without hallucinating values.
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

  // Extract domain for source
  let sourceDomain = 'Web Source';
  try {
    const parsedUrl = new URL(url);
    sourceDomain = parsedUrl.hostname.replace(/^www\./, '');
  } catch {}

  // Attempt real price extraction using currency regexes
  const { price, currency } = extractPriceFromText(`${cleanTitle} ${cleanSnippet}`);

  return {
    source: sourceDomain,
    title: cleanTitle,
    url,
    seller: sourceDomain,
    brand: context.brand || null,
    product: context.name,
    price,
    currency,
    availability: cleanSnippet.toLowerCase().includes('in stock') ? 'In Stock' : null,
    specifications: context.specifications || [],
    retrievedAt: new Date().toISOString(),
    rawSnippet: cleanSnippet.slice(0, 300),
    isRelevantMatch: checkProductRelevance(cleanTitle, cleanSnippet, context),
  };
}

/**
 * Regular expressions to detect authentic pricing in unstructured web text
 */
function extractPriceFromText(text: string): { price: number | null; currency: string | null } {
  // Check NGN (₦ or NGN)
  const ngnMatch = text.match(/(?:₦|NGN|Naira)\s?([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]{2})?|[0-9]+(?:\.[0-9]{2})?)/i);
  if (ngnMatch && ngnMatch[1]) {
    const num = parseFloat(ngnMatch[1].replace(/,/g, ''));
    if (!isNaN(num) && num > 0) return { price: num, currency: 'NGN' };
  }

  // Check USD ($ or USD)
  const usdMatch = text.match(/(?:\$|USD)\s?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i);
  if (usdMatch && usdMatch[1]) {
    const num = parseFloat(usdMatch[1].replace(/,/g, ''));
    if (!isNaN(num) && num > 0) return { price: num, currency: 'USD' };
  }

  // Check EUR (€ or EUR)
  const eurMatch = text.match(/(?:€|EUR)\s?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i);
  if (eurMatch && eurMatch[1]) {
    const num = parseFloat(eurMatch[1].replace(/,/g, ''));
    if (!isNaN(num) && num > 0) return { price: num, currency: 'EUR' };
  }

  // Check GBP (£ or GBP)
  const gbpMatch = text.match(/(?:£|GBP)\s?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/i);
  if (gbpMatch && gbpMatch[1]) {
    const num = parseFloat(gbpMatch[1].replace(/,/g, ''));
    if (!isNaN(num) && num > 0) return { price: num, currency: 'GBP' };
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
 * Deduplicates results by canonical URL or matching title and seller
 */
export function deduplicateResearchResults(results: NormalizedResearchResult[]): NormalizedResearchResult[] {
  const seenUrls = new Set<string>();
  const seenSignatures = new Set<string>();
  const deduplicated: NormalizedResearchResult[] = [];

  for (const item of results) {
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
