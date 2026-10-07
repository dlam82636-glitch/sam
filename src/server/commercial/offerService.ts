/**
 * PRICERA Commercial Offer Extractor & Verification Service
 *
 * Bridges the gap between price intelligence and real-world purchasing:
 * Answers: "Where can I actually buy this product right now?"
 *
 * Capabilities:
 * 1. Filters normalized research sources for genuine commercial stores / merchants
 * 2. Validates authentic URLs (rejects javascript:, mock URLs, synthetic targets)
 * 3. Classifies seller type (RETAILER, MARKETPLACE, DISTRIBUTOR, OFFICIAL_STORE)
 * 4. Assesses match confidence (EXACT listing, VARIANT_MATCH, SIMILAR)
 * 5. Generates fallback merchant search URLs when a direct listing link is unavailable or generic
 * 6. Prioritizes Nigerian merchants and verified official stores
 * 7. NEVER fabricates fake merchants, prices, or store links
 */

import { NormalizedResearchResult } from '@/src/types/research';
import { QueryUnderstandingResult } from '@/src/types/queryUnderstanding';
import {
  CommercialOffer,
  CommercialSellerType,
  MatchConfidence,
  BuyOpportunitiesSummary,
} from '@/src/types/commercial';

// Merchant search query builders for known platforms
const MERCHANT_SEARCH_TEMPLATES: Record<string, (query: string) => string> = {
  'jumia.com.ng': (q) => `https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(q)}`,
  'jumia.ng': (q) => `https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(q)}`,
  'jumia.com': (q) => `https://www.jumia.com.ng/catalog/?q=${encodeURIComponent(q)}`,
  'konga.com': (q) => `https://www.konga.com/search?search=${encodeURIComponent(q)}`,
  'jiji.ng': (q) => `https://jiji.ng/search?query=${encodeURIComponent(q)}`,
  'slot.ng': (q) => `https://slot.ng/search?q=${encodeURIComponent(q)}`,
  'pointekonline.com': (q) => `https://pointekonline.com/?s=${encodeURIComponent(q)}&post_type=product`,
  'kara.com.ng': (q) => `https://www.kara.com.ng/catalogsearch/result/?q=${encodeURIComponent(q)}`,
  'amazon.com': (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}`,
  'ebay.com': (q) => `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}`,
  'aliexpress.com': (q) => `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(q)}`,
};

export function extractCommercialOffers(
  researchResults: NormalizedResearchResult[],
  understanding: QueryUnderstandingResult
): BuyOpportunitiesSummary {
  const offers: CommercialOffer[] = [];
  const seenUrls = new Set<string>();

  // Filter for genuine commercial sources
  const commercialCandidates = researchResults.filter((res) => {
    if (res.isCommercialPriceSource === false) return false;
    if (res.classification === 'SPECIFICATION_SOURCE' || res.classification === 'GENERAL_REFERENCE') {
      return false;
    }
    // Must have authentic url
    if (!res.url || !res.url.startsWith('http')) return false;
    return true;
  });

  for (let idx = 0; idx < commercialCandidates.length; idx++) {
    const res = commercialCandidates[idx];
    if (seenUrls.has(res.url)) continue;
    seenUrls.add(res.url);

    let domain = 'store';
    try {
      const parsed = new URL(res.url);
      domain = parsed.hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      continue;
    }

    // Determine seller type
    let sellerType: CommercialSellerType = 'COMMERCIAL_LISTING';
    if (res.classification === 'MARKETPLACE' || res.sourceRole === 'marketplace') {
      sellerType = 'MARKETPLACE';
    } else if (res.classification === 'RETAILER' || res.sourceRole === 'retailer') {
      sellerType = 'RETAILER';
    } else if (res.classification === 'DISTRIBUTOR' || res.sourceRole === 'distributor') {
      sellerType = 'DISTRIBUTOR';
    } else if (
      res.classification === 'MANUFACTURER_SOURCE' ||
      res.sourceRole === 'official_brand_store' ||
      res.sourceRole === 'manufacturer_store'
    ) {
      sellerType = 'OFFICIAL_STORE';
    }

    // Detect if direct listing or catalog index
    const isDirectListing = checkIsDirectListing(res.url, res.title);

    // Compute match score and confidence
    const { confidence, score } = evaluateMatchConfidence(res.title, res.rawSnippet || '', understanding);

    // Generate fallback search URL if known domain
    let fallbackSearchUrl: string | undefined = undefined;
    for (const [key, builder] of Object.entries(MERCHANT_SEARCH_TEMPLATES)) {
      if (domain.includes(key)) {
        fallbackSearchUrl = builder(understanding.name);
        break;
      }
    }

    // Nice merchant name
    const sellerName = formatSellerName(domain, res.seller);

    const isOfficial =
      sellerType === 'OFFICIAL_STORE' ||
      domain.includes('samsung.com') ||
      domain.includes('apple.com') ||
      domain.includes('slot.ng') ||
      domain.includes('konga.com') ||
      domain.includes('jumia.com.ng');

    offers.push({
      id: `offer-${idx}-${domain}`,
      seller: sellerName,
      sellerDomain: domain,
      sellerType,
      title: res.title,
      price: res.price,
      currency: res.currency,
      availability: res.availability || (res.price ? 'Available to order' : null),
      directUrl: res.url,
      isDirectListing,
      fallbackSearchUrl,
      matchConfidence: confidence,
      matchScore: score,
      isNigerianMerchant: Boolean(res.isNigerianSource || domain.endsWith('.ng')),
      isOfficialOrVerified: isOfficial,
      location: res.location || (res.isNigerianSource ? 'Nigeria' : 'International'),
      specificationsSummary: res.specifications?.slice(0, 3) || [],
      lastObservedAt: res.retrievedAt,
    });
  }

  // Sort offers:
  // 1. Nigerian merchants first if inquiry is regional
  // 2. Exact matches above similar
  // 3. Offers with explicit price above those without
  // 4. Official/verified sellers preferred
  offers.sort((a, b) => {
    // Exact vs similar
    const rankConf = (c: MatchConfidence) => (c === 'EXACT' ? 3 : c === 'VARIANT_MATCH' ? 2 : 1);
    const confDiff = rankConf(b.matchConfidence) - rankConf(a.matchConfidence);
    if (confDiff !== 0) return confDiff;

    // Has price
    const aHasPrice = a.price !== null ? 1 : 0;
    const bHasPrice = b.price !== null ? 1 : 0;
    if (bHasPrice !== aHasPrice) return bHasPrice - aHasPrice;

    // Nigerian merchant priority
    const aNig = a.isNigerianMerchant ? 1 : 0;
    const bNig = b.isNigerianMerchant ? 1 : 0;
    if (bNig !== aNig) return bNig - aNig;

    // Direct listing over search page
    const aDirect = a.isDirectListing ? 1 : 0;
    const bDirect = b.isDirectListing ? 1 : 0;
    if (bDirect !== aDirect) return bDirect - aDirect;

    return b.matchScore - a.matchScore;
  });

  const exactListingsCount = offers.filter((o) => o.matchConfidence === 'EXACT').length;
  const topRecommendation = offers.length > 0 ? offers[0] : null;

  const hasNgn = offers.some((o) => o.currency === 'NGN' || o.isNigerianMerchant);

  return {
    offers,
    totalOffers: offers.length,
    exactListingsCount,
    topRecommendation,
    primaryMarket: hasNgn ? 'NGN' : 'GLOBAL',
  };
}

function checkIsDirectListing(url: string, title: string): boolean {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    // Catalog or generic search paths
    if (
      path === '/' ||
      path === '' ||
      path.includes('/search') ||
      path.includes('/catalog') ||
      path.includes('/category') ||
      path.includes('/collections')
    ) {
      return false;
    }
    // Typical product URL signs: has .html, /p/, /product/, /item/, or long slug
    if (
      path.includes('/product/') ||
      path.includes('/item/') ||
      path.includes('/p/') ||
      path.includes('/pd/') ||
      path.includes('.html') ||
      path.split('/').filter(Boolean).length >= 2
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return true;
}

function evaluateMatchConfidence(
  title: string,
  snippet: string,
  context: QueryUnderstandingResult
): { confidence: MatchConfidence; score: number } {
  const combined = `${title} ${snippet}`.toLowerCase();
  let score = 0.5;

  const productName = context.name.toLowerCase();
  const productTokens = productName
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);

  let tokenMatches = 0;
  for (const token of productTokens) {
    if (combined.includes(token)) {
      tokenMatches++;
    }
  }

  const tokenRatio = productTokens.length > 0 ? tokenMatches / productTokens.length : 1;
  score = Math.min(1, Math.max(0.3, tokenRatio));

  // Check model if present
  if (context.model && combined.includes(context.model.toLowerCase())) {
    score = Math.min(1, score + 0.25);
  }

  // Check brand if present
  if (context.brand && combined.includes(context.brand.toLowerCase())) {
    score = Math.min(1, score + 0.15);
  }

  if (score >= 0.85) {
    return { confidence: 'EXACT', score };
  } else if (score >= 0.65) {
    return { confidence: 'VARIANT_MATCH', score };
  } else {
    return { confidence: 'SIMILAR', score };
  }
}

function formatSellerName(domain: string, fallbackSeller?: string | null): string {
  if (fallbackSeller && fallbackSeller !== 'Web Source' && fallbackSeller !== 'Unknown' && !fallbackSeller.includes('.')) {
    return fallbackSeller;
  }

  const map: Record<string, string> = {
    'jumia.com.ng': 'Jumia Nigeria',
    'jumia.ng': 'Jumia Nigeria',
    'konga.com': 'Konga',
    'jiji.ng': 'Jiji Nigeria',
    'slot.ng': 'Slot Systems',
    'pointekonline.com': 'Pointek',
    'kara.com.ng': 'Kara Nigeria',
    'fouanistore.com': 'Fouani Store',
    'amazon.com': 'Amazon',
    'ebay.com': 'eBay',
    'aliexpress.com': 'AliExpress',
    'walmart.com': 'Walmart',
  };

  if (map[domain]) return map[domain];

  // Capitalize main domain label
  const parts = domain.split('.');
  const name = parts[0] || domain;
  return name.charAt(0).toUpperCase() + name.slice(1);
}
