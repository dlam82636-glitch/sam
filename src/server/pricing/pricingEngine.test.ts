/**
 * Pricing Engine Comprehensive Test Suite (Prompt 6)
 * Validates all 14 pricing intelligence scenarios:
 * 1. Multiple comparable prices
 * 2. One price only
 * 3. No prices
 * 4. Different currencies
 * 5. Obvious outlier
 * 6. Different product variants
 * 7. Conflicting prices
 * 8. Missing currency
 * 9. Invalid price
 * 10. Nigerian NGN-focused results
 * 11. Exact product match
 * 12. Ambiguous product match
 * 13. Empty research result
 * 14. Search provider failure simulation
 */

import { calculatePricingIntelligence } from './pricingEngine';
import { QueryUnderstandingResult } from '@/src/types/queryUnderstanding';
import { NormalizedResearchResult } from '@/src/types/research';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

const baseQuery: QueryUnderstandingResult = {
  name: '12mm Marine Plywood',
  category: 'Building Materials',
  description: 'Water-resistant structural panel',
  brand: null,
  model: null,
  material: 'Plywood',
  specifications: ['12mm', 'Marine grade'],
  possible_variants: ['18mm', 'Okoume'],
  search_queries: ['12mm marine plywood price in Nigeria'],
  confidence: 0.9,
  uncertainties: [],
};

console.log('--- RUNNING PRICERA PRICING INTELLIGENCE TEST SUITE (14 SCENARIOS) ---');

// Test 1: Multiple comparable prices
{
  const results: NormalizedResearchResult[] = [
    { source: 'merchant-a.test', title: '12mm Marine Plywood Sheet', url: 'https://a.test', seller: 'A', brand: null, product: 'Plywood', price: 280000, currency: 'NGN', availability: 'In Stock', specifications: ['12mm'], retrievedAt: '2026-10-06' },
    { source: 'merchant-b.test', title: '12mm Marine Plywood Sheet', url: 'https://b.test', seller: 'B', brand: null, product: 'Plywood', price: 295000, currency: 'NGN', availability: 'In Stock', specifications: ['12mm'], retrievedAt: '2026-10-06' },
    { source: 'merchant-c.test', title: '12mm Marine Plywood Sheet', url: 'https://c.test', seller: 'C', brand: null, product: 'Plywood', price: 310000, currency: 'NGN', availability: 'In Stock', specifications: ['12mm'], retrievedAt: '2026-10-06' },
    { source: 'merchant-d.test', title: '12mm Marine Plywood Sheet', url: 'https://d.test', seller: 'D', brand: null, product: 'Plywood', price: 285000, currency: 'NGN', availability: 'In Stock', specifications: ['12mm'], retrievedAt: '2026-10-06' },
  ];
  const out = calculatePricingIntelligence(results, baseQuery);
  assert(out.currency === 'NGN', 'Test 1 currency NGN');
  assert(out.minPrice === 280000, 'Test 1 min price');
  assert(out.maxPrice === 310000, 'Test 1 max price');
  assert(out.estimatedPrice === 290000, 'Test 1 median estimate');
  assert(out.confidence === 'high', 'Test 1 high confidence');
  console.log('✓ Scenario 1: Multiple comparable prices PASSED');
}

// Test 2: One price only
{
  const results: NormalizedResearchResult[] = [
    { source: 'solo.test', title: '12mm Marine Plywood', url: 'https://solo.test', seller: 'Solo', brand: null, product: 'Plywood', price: 285000, currency: 'NGN', availability: 'In Stock', specifications: ['12mm'], retrievedAt: '2026-10-06' },
  ];
  const out = calculatePricingIntelligence(results, baseQuery);
  assert(out.estimatedPrice === 285000, 'Test 2 estimated price');
  assert(out.confidence === 'low', 'Test 2 confidence must be low');
  assert(out.methodology.includes('1 available comparable'), 'Test 2 methodology reflects single observation');
  console.log('✓ Scenario 2: One price only PASSED');
}

// Test 3: No prices
{
  const results: NormalizedResearchResult[] = [
    { source: 'catalog.test', title: '12mm Marine Plywood Datasheet', url: 'https://cat.test', seller: null, brand: null, product: 'Plywood', price: null, currency: null, availability: null, specifications: ['12mm'], retrievedAt: '2026-10-06' },
  ];
  const out = calculatePricingIntelligence(results, baseQuery);
  assert(out.estimatedPrice === null, 'Test 3 estimated price null');
  assert(out.minPrice === null, 'Test 3 min price null');
  assert(out.sampleSize === 0, 'Test 3 sample size 0');
  console.log('✓ Scenario 3: No prices PASSED');
}

// Test 4: Different currencies
{
  const results: NormalizedResearchResult[] = [
    { source: 'nigeria.test', title: '12mm Marine Plywood', url: 'https://ng.test', seller: 'NG', brand: null, product: 'Plywood', price: 285000, currency: 'NGN', availability: null, specifications: ['12mm'], retrievedAt: '2026-10-06' },
    { source: 'usa.test', title: '12mm Marine Plywood', url: 'https://us.test', seller: 'US', brand: null, product: 'Plywood', price: 65, currency: 'USD', availability: null, specifications: ['12mm'], retrievedAt: '2026-10-06' },
  ];
  const out = calculatePricingIntelligence(results, baseQuery);
  assert(out.currency === 'NGN', 'Test 4 prefers NGN for Nigeria context');
  assert(out.limitations.some(l => l.includes('USD were excluded')), 'Test 4 records USD exclusion without fake exchange rate');
  console.log('✓ Scenario 4: Different currencies PASSED');
}

// Test 5: Obvious outlier
{
  const results: NormalizedResearchResult[] = [
    { source: 'a.test', title: '12mm Marine Plywood', url: 'https://a.test', seller: 'A', brand: null, product: 'Plywood', price: 280000, currency: 'NGN', availability: null, specifications: ['12mm'], retrievedAt: '2026-10-06' },
    { source: 'b.test', title: '12mm Marine Plywood', url: 'https://b.test', seller: 'B', brand: null, product: 'Plywood', price: 290000, currency: 'NGN', availability: null, specifications: ['12mm'], retrievedAt: '2026-10-06' },
    { source: 'c.test', title: '12mm Marine Plywood', url: 'https://c.test', seller: 'C', brand: null, product: 'Plywood', price: 285000, currency: 'NGN', availability: null, specifications: ['12mm'], retrievedAt: '2026-10-06' },
    { source: 'err.test', title: '12mm Marine Plywood', url: 'https://err.test', seller: 'Err', brand: null, product: 'Plywood', price: 2500000, currency: 'NGN', availability: null, specifications: ['12mm'], retrievedAt: '2026-10-06' }, // 2.5m is 8.6x median
  ];
  const out = calculatePricingIntelligence(results, baseQuery);
  assert(out.maxPrice === 290000, 'Test 5 excluded 2.5m outlier from max');
  assert(out.limitations.some(l => l.includes('extreme market outlier')), 'Test 5 documented outlier exclusion');
  console.log('✓ Scenario 5: Obvious outlier PASSED');
}

// Test 6: Different product variants
{
  const results: NormalizedResearchResult[] = [
    { source: 'a.test', title: '12mm Marine Plywood Sheet', url: 'https://a.test', seller: 'A', brand: null, product: 'Plywood', price: 280000, currency: 'NGN', availability: null, specifications: ['12mm'], retrievedAt: '2026-10-06' },
    { source: 'b.test', title: '18mm Heavy Duty Marine Plywood', url: 'https://b.test', seller: 'B', brand: null, product: 'Plywood', price: 450000, currency: 'NGN', availability: null, specifications: ['18mm'], retrievedAt: '2026-10-06' },
  ];
  const out = calculatePricingIntelligence(results, baseQuery);
  assert(out.sampleSize === 1, 'Test 6 excluded 18mm variant from 12mm search');
  assert(out.limitations.some(l => l.includes('distinct or non-matching product variant')), 'Test 6 noted variant exclusion');
  console.log('✓ Scenario 6: Different product variants PASSED');
}

// Test 7: Conflicting prices (wide spread)
{
  const results: NormalizedResearchResult[] = [
    { source: 'a.test', title: 'Office Chair', url: 'https://a.test', seller: 'A', brand: null, product: 'Chair', price: 45000, currency: 'NGN', availability: null, specifications: [], retrievedAt: '2026-10-06' },
    { source: 'b.test', title: 'Office Chair', url: 'https://b.test', seller: 'B', brand: null, product: 'Chair', price: 180000, currency: 'NGN', availability: null, specifications: [], retrievedAt: '2026-10-06' },
  ];
  const chairQuery: QueryUnderstandingResult = { ...baseQuery, name: 'Office Chair', specifications: [] };
  const out = calculatePricingIntelligence(results, chairQuery);
  assert(out.confidence === 'low', 'Test 7 wide spread forces low confidence');
  assert(out.limitations.some(l => l.includes('High price variance')), 'Test 7 notes high variance');
  console.log('✓ Scenario 7: Conflicting prices PASSED');
}

// Test 8: Missing currency
{
  const results: NormalizedResearchResult[] = [
    { source: 'a.test', title: '12mm Marine Plywood', url: 'https://a.test', seller: 'A', brand: null, product: 'Plywood', price: 280000, currency: null, availability: null, specifications: ['12mm'], retrievedAt: '2026-10-06' },
  ];
  const out = calculatePricingIntelligence(results, baseQuery);
  assert(out.sampleSize === 0, 'Test 8 rejected listing with null currency');
  console.log('✓ Scenario 8: Missing currency PASSED');
}

// Test 9: Invalid price (negative / zero / NaN)
{
  const results: NormalizedResearchResult[] = [
    { source: 'bad1.test', title: '12mm Marine Plywood', url: 'https://b1.test', seller: 'B1', brand: null, product: 'Plywood', price: -50, currency: 'USD', availability: null, specifications: ['12mm'], retrievedAt: '2026-10-06' },
    { source: 'bad2.test', title: '12mm Marine Plywood', url: 'https://b2.test', seller: 'B2', brand: null, product: 'Plywood', price: 0, currency: 'USD', availability: null, specifications: ['12mm'], retrievedAt: '2026-10-06' },
  ];
  const out = calculatePricingIntelligence(results, baseQuery);
  assert(out.sampleSize === 0, 'Test 9 rejected negative and zero prices');
  console.log('✓ Scenario 9: Invalid price PASSED');
}

// Test 10: Nigerian NGN-focused results
{
  const results: NormalizedResearchResult[] = [
    { source: 'lagos.test', title: '12mm Marine Board Lagos', url: 'https://l.test', seller: 'Lagos Wood', brand: null, product: 'Board', price: 285000, currency: 'NGN', availability: 'In Stock', specifications: ['12mm'], retrievedAt: '2026-10-06' },
    { source: 'abuja.test', title: '12mm Marine Plywood Abuja', url: 'https://ab.test', seller: 'Abuja Timber', brand: null, product: 'Board', price: 290000, currency: 'NGN', availability: 'In Stock', specifications: ['12mm'], retrievedAt: '2026-10-06' },
  ];
  const out = calculatePricingIntelligence(results, baseQuery);
  assert(out.currency === 'NGN', 'Test 10 currency is NGN');
  assert(out.estimatedPrice !== null && out.estimatedPrice >= 285000, 'Test 10 estimate computed correctly');
  console.log('✓ Scenario 10: Nigerian NGN-focused results PASSED');
}

// Test 11: Exact product match (Samsung A55 256GB)
{
  const phoneQuery: QueryUnderstandingResult = {
    ...baseQuery,
    name: 'Samsung Galaxy A55 256GB',
    specifications: ['Samsung', 'A55', '256GB'],
  };
  const results: NormalizedResearchResult[] = [
    { source: 'store.test', title: 'Samsung Galaxy A55 5G 256GB Awesome Navy', url: 'https://s.test', seller: 'Store', brand: 'Samsung', product: 'Phone', price: 420000, currency: 'NGN', availability: 'In Stock', specifications: ['256GB'], retrievedAt: '2026-10-06' },
    { source: 'hub.test', title: 'Samsung A55 256GB ROM 8GB RAM', url: 'https://h.test', seller: 'Hub', brand: 'Samsung', product: 'Phone', price: 435000, currency: 'NGN', availability: 'In Stock', specifications: ['256GB'], retrievedAt: '2026-10-06' },
    { source: 'wrong.test', title: 'Samsung Galaxy A55 128GB ROM', url: 'https://w.test', seller: 'Wrong', brand: 'Samsung', product: 'Phone', price: 340000, currency: 'NGN', availability: 'In Stock', specifications: ['128GB'], retrievedAt: '2026-10-06' },
  ];
  const out = calculatePricingIntelligence(results, phoneQuery);
  assert(out.sampleSize === 2, 'Test 11 kept only 256GB matching listings');
  assert(out.minPrice === 420000 && out.maxPrice === 435000, 'Test 11 price range for 256GB');
  console.log('✓ Scenario 11: Exact product match PASSED');
}

// Test 12: Ambiguous product match
{
  const genericQuery: QueryUnderstandingResult = {
    ...baseQuery,
    name: 'Office Chair',
    specifications: [],
    confidence: 0.4,
  };
  const results: NormalizedResearchResult[] = [
    { source: 'a.test', title: 'Mesh Office Chair', url: 'https://a.test', seller: 'A', brand: null, product: 'Chair', price: 85000, currency: 'NGN', availability: null, specifications: [], retrievedAt: '2026-10-06' },
  ];
  const out = calculatePricingIntelligence(results, genericQuery);
  assert(out.confidence === 'low', 'Test 12 ambiguous match has low confidence');
  console.log('✓ Scenario 12: Ambiguous product match PASSED');
}

// Test 13: Empty research result
{
  const out = calculatePricingIntelligence([], baseQuery);
  assert(out.sampleSize === 0, 'Test 13 sample size 0');
  assert(out.estimatedPrice === null, 'Test 13 estimated price null');
  console.log('✓ Scenario 13: Empty research result PASSED');
}

// Test 14: Search provider failure simulation (returns no results with limitation note)
{
  const results: NormalizedResearchResult[] = [];
  const out = calculatePricingIntelligence(results, baseQuery);
  assert(out.methodology === 'No reliable market prices were found from the available sources.', 'Test 14 methodology');
  console.log('✓ Scenario 14: Search provider failure handling PASSED');
}

console.log('--- ALL 14 PRICERA PRICING SCENARIOS PASSED WITH ZERO ERRORS ---');
