/**
 * PRICERA Source Classification Engine
 *
 * Classifies research findings into distinct source types:
 * - PRICE_SOURCE
 * - SPECIFICATION_SOURCE
 * - MANUFACTURER_SOURCE
 * - MARKETPLACE
 * - RETAILER
 * - DISTRIBUTOR
 * - GENERAL_REFERENCE
 *
 * Detects Nigerian market sources (.ng domains, known Nigerian merchants)
 * and ensures ONLY appropriate commercial price sources are used for price observations.
 * Specification sources (like GSMArena, Kimovil) are strictly kept for spec context
 * and excluded from commercial price observation pools.
 */

import { QueryUnderstandingResult } from '@/src/types/queryUnderstanding';
import { SourceClassification, SourceRole, SourceRoleGroup } from '@/src/types/research';

export type { SourceClassification, SourceRole, SourceRoleGroup };

export interface SourceClassificationInfo {
  classification: SourceClassification;
  sourceRole: SourceRole;
  sourceRoleGroup: SourceRoleGroup;
  isCommercialPriceSource: boolean;
  isNigerianSource: boolean;
  label: string;
  sourceDomain: string;
  locationLabel: string;
}

// Known Nigerian Marketplace domains
const NIGERIAN_MARKETPLACES = new Set([
  'jumia.com.ng',
  'jumia.ng',
  'konga.com',
  'jiji.ng',
  'marketng.com',
  'supermart.ng',
]);

// Known Nigerian Retailers & Distributors
const NIGERIAN_RETAILERS_AND_DISTRIBUTORS = new Set([
  'slot.ng',
  'pointekonline.com',
  '3chub.com',
  'kara.com.ng',
  'fouanistore.com',
  'obejor.com.ng',
  'alabamart.com',
  'spar.com.ng',
  'hubmart.com',
  'parktelonline.com',
  'cdlphub.com',
  'bimcomng.com',
  'buildingsandmoreng.com',
  'deluxe.com.ng',
  'megaplaza.com.ng',
  'priceinngn.com',
  'specificationsng.com',
  'directgadgets.ng',
  'techpoint.africa',
]);

// Known Specification, Review & Database portals (NEVER commercial price quotes)
const SPECIFICATION_DOMAINS = [
  'gsmarena.com',
  'gsmarena.ng',
  'gsmarena.com.ng',
  'kimovil.com',
  'devicespecifications.com',
  'phonearena.com',
  'notebookcheck.net',
  'nanoreview.net',
  'versus.com',
  'techradar.com',
  'tomshardware.com',
  'anandtech.com',
  'cnet.com',
  'theverge.com',
  'digitaltrends.com',
  'tomsguide.com',
  'gadgets360.com',
  '91mobiles.com',
  'gsmchoice.com',
  'phonecurry.com',
  'specs-tech.com',
  'mobilityarena.com',
  'mobile57.com',
  'gizmochina.com',
  'smartprix.com',
  'whatmobile.com',
  'specout.com',
];

// Global Marketplaces
const GLOBAL_MARKETPLACES = [
  'amazon.',
  'ebay.',
  'aliexpress.',
  'walmart.com',
  'target.com',
  'rakuten.',
  'etsy.com',
];

// Global Tech/Electronics Retailers
const GLOBAL_RETAILERS = [
  'bestbuy.com',
  'currys.co.uk',
  'argos.co.uk',
  'microcenter.com',
  'bhphotovideo.com',
  'newegg.com',
  'johnlewis.com',
  'mediamarkt.',
  'saturn.de',
];

// Global Reference, Corporate Directory & Community platforms
const GENERAL_REFERENCE_DOMAINS = [
  'wikipedia.org',
  'reddit.com',
  'quora.com',
  'medium.com',
  'youtube.com',
  'x.com',
  'twitter.com',
  'facebook.com',
  'instagram.com',
  'bloomberg.com',
  'forbes.com',
  'finance.yahoo.com',
  'reuters.com',
  'coingecko.com',
  'coinmarketcap.com',
  'binance.com',
  'coinbase.com',
  'investing.com',
  'tradingview.com',
  'telecompaper.com',
  'businessinsider.com',
  'cnbc.com',
  'rocketreach.co',
  'zoominfo.com',
  'crunchbase.com',
  'pitchbook.com',
  'bbb.org',
  'dnb.com',
  'linkedin.com',
  'glassdoor.com',
  'owler.com',
  'trustpilot.com',
  'yelp.com',
];

export function isNigerianMarketSource(url: string, title: string = '', snippet: string = ''): boolean {
  try {
    const parsed = new URL(url);
    const domain = parsed.hostname.toLowerCase().replace(/^www\./, '');

    if (domain.endsWith('.ng') || domain.endsWith('.com.ng') || domain.endsWith('.org.ng')) {
      return true;
    }

    if (NIGERIAN_MARKETPLACES.has(domain) || NIGERIAN_RETAILERS_AND_DISTRIBUTORS.has(domain)) {
      return true;
    }

    if (domain === 'jumia.com' && (parsed.pathname.includes('/ng') || parsed.pathname.includes('/nigeria'))) {
      return true;
    }
  } catch {
    // Ignore URL parse error
  }

  // Check snippet text cues for Nigerian commercial context
  const text = `${title} ${snippet}`.toLowerCase();
  if (
    text.includes('nigeria') ||
    text.includes('lagos') ||
    text.includes('abuja') ||
    text.includes('naira') ||
    text.includes('ngn') ||
    text.includes('₦') ||
    text.includes('slot.ng') ||
    text.includes('konga') ||
    text.includes('jumia')
  ) {
    return true;
  }

  return false;
}

export function classifySource(
  url: string,
  title: string,
  snippet: string,
  context?: QueryUnderstandingResult
): SourceClassificationInfo {
  let domain = 'web-source';
  try {
    const parsed = new URL(url);
    domain = parsed.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    // Use fallback
  }

  const isNigerian = isNigerianMarketSource(url, title, snippet);
  const lowerTitle = title.toLowerCase();
  const lowerSnippet = snippet.toLowerCase();
  const lowerUrl = url.toLowerCase();
  const fullText = `${lowerTitle} ${lowerSnippet} ${lowerUrl}`;

  // 1. SPECIFICATION_SOURCE check (Strict: specs/reviews are not commercial price quotes)
  const isSpecDomain = SPECIFICATION_DOMAINS.some((d) => domain.includes(d));
  const hasSpecIndicators =
    (fullText.includes('full specification') ||
      fullText.includes('technical specs') ||
      fullText.includes('phone specs') ||
      fullText.includes('hands-on review') ||
      fullText.includes('in-depth review') ||
      fullText.includes('device specifications')) &&
    !fullText.includes('add to cart') &&
    !fullText.includes('buy now');

  if (isSpecDomain || hasSpecIndicators) {
    const isReview = fullText.includes('review') || fullText.includes('hands-on') || fullText.includes('benchmarks');
    return {
      classification: 'SPECIFICATION_SOURCE',
      sourceRole: isReview ? 'review' : 'specification_reference',
      sourceRoleGroup: 'REFERENCE_RESEARCH',
      isCommercialPriceSource: false,
      isNigerianSource: isNigerian,
      label: isReview ? 'Hardware Review' : 'Specification & Review Source',
      sourceDomain: domain,
      locationLabel: isNigerian ? 'Nigeria (Tech Spec)' : 'Global Tech Specs',
    };
  }

  // 2. GENERAL_REFERENCE check (Wikipedia, forums, news)
  const isGeneralRef = GENERAL_REFERENCE_DOMAINS.some((d) => domain.includes(d));
  if (isGeneralRef || domain.includes('blog') || domain.includes('news')) {
    const role: SourceRole = domain.includes('news') ? 'news' : domain.includes('blog') ? 'blog' : 'general_information';
    return {
      classification: 'GENERAL_REFERENCE',
      sourceRole: role,
      sourceRoleGroup: 'REFERENCE_RESEARCH',
      isCommercialPriceSource: false,
      isNigerianSource: isNigerian,
      label: 'General Reference',
      sourceDomain: domain,
      locationLabel: isNigerian ? 'Nigeria (Reference)' : 'Global Reference',
    };
  }

  // 3. MANUFACTURER_SOURCE check
  const brandName = context?.brand?.toLowerCase();
  const isBrandMatch = brandName && brandName.length > 2 && domain.includes(brandName);
  const isKnownOem = [
    'samsung.com',
    'apple.com',
    'hp.com',
    'dell.com',
    'lenovo.com',
    'sony.com',
    'lg.com',
    'asus.com',
    'mi.com',
    'huawei.com',
    'infinixmobility.com',
    'tecno-mobile.com',
    'oraimo.com',
    'itel-life.com',
    'caterpillar.com',
    'bosch.',
    'makita.',
    'dewalt.',
  ].some((m) => domain.includes(m));

  if (isBrandMatch || isKnownOem) {
    // Check if it's direct official store with price or pure brand portal
    const hasShopSignals =
      fullText.includes('shop') ||
      fullText.includes('store') ||
      fullText.includes('buy') ||
      fullText.includes('order');

    return {
      classification: 'MANUFACTURER_SOURCE',
      sourceRole: hasShopSignals ? 'official_brand_store' : 'manufacturer_information',
      sourceRoleGroup: hasShopSignals ? 'PRICE_EVIDENCE' : 'REFERENCE_RESEARCH',
      isCommercialPriceSource: Boolean(hasShopSignals),
      isNigerianSource: isNigerian,
      label: hasShopSignals ? 'Official Brand Store' : 'Manufacturer Information',
      sourceDomain: domain,
      locationLabel: isNigerian ? 'Nigeria (Official OEM)' : 'Official Brand Portal',
    };
  }

  // 4. MARKETPLACE check
  const isNigMarketplace = NIGERIAN_MARKETPLACES.has(domain);
  const isGlobalMarketplace = GLOBAL_MARKETPLACES.some((m) => domain.includes(m));
  if (isNigMarketplace || isGlobalMarketplace || fullText.includes('marketplace')) {
    return {
      classification: 'MARKETPLACE',
      sourceRole: 'marketplace',
      sourceRoleGroup: 'PRICE_EVIDENCE',
      isCommercialPriceSource: true,
      isNigerianSource: isNigerian || isNigMarketplace,
      label: isNigMarketplace || isNigerian ? 'Nigerian Marketplace' : 'Commercial Marketplace',
      sourceDomain: domain,
      locationLabel: isNigMarketplace || isNigerian ? 'Nigeria Marketplace' : 'International Marketplace',
    };
  }

  // 5. DISTRIBUTOR check
  const isKnownDistributor =
    domain.includes('fouani') ||
    domain.includes('distributor') ||
    domain.includes('wholesale') ||
    domain.includes('supply') ||
    domain.includes('b2b') ||
    fullText.includes('authorized distributor') ||
    fullText.includes('wholesale distributor');

  if (isKnownDistributor) {
    return {
      classification: 'DISTRIBUTOR',
      sourceRole: 'distributor',
      sourceRoleGroup: 'PRICE_EVIDENCE',
      isCommercialPriceSource: true,
      isNigerianSource: isNigerian,
      label: isNigerian ? 'Nigerian Distributor' : 'Wholesale Distributor',
      sourceDomain: domain,
      locationLabel: isNigerian ? 'Nigeria (Distributor)' : 'Wholesale Supplier',
    };
  }

  // 6. RETAILER check
  const isNigRetailer = NIGERIAN_RETAILERS_AND_DISTRIBUTORS.has(domain);
  const isGlobalRetailer = GLOBAL_RETAILERS.some((r) => domain.includes(r));
  const hasRetailerCues =
    domain.includes('store') ||
    domain.includes('shop') ||
    domain.includes('retail') ||
    domain.includes('electronics') ||
    fullText.includes('add to cart') ||
    fullText.includes('buy online');

  if (isNigRetailer || isGlobalRetailer || hasRetailerCues) {
    return {
      classification: 'RETAILER',
      sourceRole: 'retailer',
      sourceRoleGroup: 'PRICE_EVIDENCE',
      isCommercialPriceSource: true,
      isNigerianSource: isNigerian || isNigRetailer,
      label: isNigRetailer || isNigerian ? 'Nigerian Retailer' : 'Commercial Retailer',
      sourceDomain: domain,
      locationLabel: isNigRetailer || isNigerian ? 'Nigeria (Retailer)' : 'Commercial Retailer',
    };
  }

  // 7. Fallback to generic PRICE_SOURCE if commerce/price cues exist, otherwise GENERAL_REFERENCE
  const hasPriceCues =
    fullText.includes('price') ||
    fullText.includes('cost') ||
    fullText.includes('₦') ||
    fullText.includes('naira') ||
    fullText.includes('$') ||
    fullText.includes('€');

  if (hasPriceCues) {
    return {
      classification: 'PRICE_SOURCE',
      sourceRole: 'commercial_listing',
      sourceRoleGroup: 'PRICE_EVIDENCE',
      isCommercialPriceSource: true,
      isNigerianSource: isNigerian,
      label: isNigerian ? 'Nigerian Commercial Source' : 'Commercial Price Source',
      sourceDomain: domain,
      locationLabel: isNigerian ? 'Nigeria (Commercial)' : 'Commercial Source',
    };
  }

  return {
    classification: 'GENERAL_REFERENCE',
    sourceRole: 'general_information',
    sourceRoleGroup: 'REFERENCE_RESEARCH',
    isCommercialPriceSource: false,
    isNigerianSource: isNigerian,
    label: 'General Web Reference',
    sourceDomain: domain,
    locationLabel: isNigerian ? 'Nigeria (Reference)' : 'General Reference',
  };
}
