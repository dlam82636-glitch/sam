import { extractCommercialOffers } from './offerService';
import { NormalizedResearchResult } from '@/src/types/research';
import { QueryUnderstandingResult } from '@/src/types/queryUnderstanding';

function runOfferTests() {
  console.log('--- RUNNING COMMERCIAL OFFER EXTRACTOR TESTS ---');

  const mockUnderstanding: QueryUnderstandingResult = {
    name: 'Samsung Galaxy A55 5G',
    category: 'Smartphones',
    brand: 'Samsung',
    model: 'Galaxy A55 5G',
    description: 'Mid-range Android smartphone',
    material: 'Glass and aluminum',
    specifications: ['8GB RAM', '256GB Storage', '5G'],
    possible_variants: ['128GB', '256GB'],
    search_queries: ['Samsung Galaxy A55 5G price Nigeria'],
    confidence: 0.95,
    uncertainties: [],
  };

  const mockSources: NormalizedResearchResult[] = [
    {
      source: 'slot.ng',
      title: 'Samsung Galaxy A55 5G (8GB/256GB) Awesome Iceblue',
      url: 'https://slot.ng/product/samsung-galaxy-a55-5g-256gb.html',
      seller: 'Slot Systems',
      brand: 'Samsung',
      product: 'Samsung Galaxy A55 5G',
      price: 520000,
      currency: 'NGN',
      availability: 'In Stock',
      specifications: ['8GB RAM', '256GB'],
      retrievedAt: new Date().toISOString(),
      rawSnippet: 'Buy Samsung Galaxy A55 5G 256GB online at Slot Nigeria for N520,000.',
      classification: 'RETAILER',
      sourceRole: 'retailer',
      isCommercialPriceSource: true,
      isNigerianSource: true,
      location: 'Nigeria (Retailer)',
    },
    {
      source: 'gsmarena.com',
      title: 'Samsung Galaxy A55 - Full phone specifications',
      url: 'https://www.gsmarena.com/samsung_galaxy_a55-12824.php',
      seller: null,
      brand: 'Samsung',
      product: 'Samsung Galaxy A55 5G',
      price: null,
      currency: null,
      availability: null,
      specifications: ['6.6 inch Super AMOLED', 'Exynos 1480'],
      retrievedAt: new Date().toISOString(),
      rawSnippet: 'Samsung Galaxy A55 Android smartphone. Announced Mar 2024. Features 6.6″ display...',
      classification: 'SPECIFICATION_SOURCE',
      sourceRole: 'specification_reference',
      isCommercialPriceSource: false,
      isNigerianSource: false,
    },
    {
      source: 'jumia.com.ng',
      title: 'Samsung Galaxy A55 5G Smartphone - 8GB RAM + 128GB ROM',
      url: 'https://www.jumia.com.ng/samsung-galaxy-a55-5g-smartphone-298174.html',
      seller: 'Jumia Nigeria',
      brand: 'Samsung',
      product: 'Samsung Galaxy A55 5G',
      price: 495000,
      currency: 'NGN',
      availability: 'In Stock',
      specifications: ['8GB RAM', '128GB'],
      retrievedAt: new Date().toISOString(),
      rawSnippet: 'Order Samsung Galaxy A55 5G Smartphone on Jumia Nigeria. Pay on delivery available.',
      classification: 'MARKETPLACE',
      sourceRole: 'marketplace',
      isCommercialPriceSource: true,
      isNigerianSource: true,
      location: 'Nigeria Marketplace',
    },
    {
      source: 'wikipedia.org',
      title: 'Samsung Galaxy A series - Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Samsung_Galaxy_A_series',
      seller: null,
      brand: 'Samsung',
      product: 'Samsung Galaxy A series',
      price: null,
      currency: null,
      availability: null,
      specifications: [],
      retrievedAt: new Date().toISOString(),
      rawSnippet: 'The Samsung Galaxy A series is a line of mid-range smartphones...',
      classification: 'GENERAL_REFERENCE',
      sourceRole: 'general_information',
      isCommercialPriceSource: false,
      isNigerianSource: false,
    },
  ];

  const summary = extractCommercialOffers(mockSources, mockUnderstanding);

  // Assertions:
  // 1. GSMArena and Wikipedia must NOT appear in commercial offers
  const nonCommercial = summary.offers.filter(
    (o) => o.sellerDomain.includes('gsmarena') || o.sellerDomain.includes('wikipedia')
  );
  if (nonCommercial.length > 0) {
    throw new Error('FAILED: Non-commercial reference sources were incorrectly included in commercial offers!');
  }
  console.log('✓ Non-commercial reference sources excluded from commercial offers');

  // 2. Only authentic commercial stores included
  if (summary.totalOffers !== 2) {
    throw new Error(`FAILED: Expected 2 commercial offers, got ${summary.totalOffers}`);
  }
  console.log('✓ Commercial offer count matches genuine commercial sources (2)');

  // 3. Exact matching logic
  const slotOffer = summary.offers.find((o) => o.sellerDomain.includes('slot.ng'));
  if (!slotOffer || slotOffer.matchConfidence !== 'EXACT') {
    throw new Error('FAILED: Slot offer was not ranked as EXACT match');
  }
  console.log('✓ Slot offer identified as EXACT match');

  // 4. Nigerian merchant prioritization
  if (!summary.offers[0].isNigerianMerchant) {
    throw new Error('FAILED: Nigerian merchant was not prioritized');
  }
  console.log('✓ Nigerian merchant prioritization verified');

  // 5. Fallback search URL generation
  if (!slotOffer.fallbackSearchUrl || !slotOffer.fallbackSearchUrl.includes('search')) {
    throw new Error('FAILED: Missing fallback search URL for known merchant');
  }
  console.log('✓ Fallback search URL generation verified');

  console.log('--- ALL COMMERCIAL OFFER TESTS PASSED ---');
}

runOfferTests();
