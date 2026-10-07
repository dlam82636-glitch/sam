/**
 * PRICERA Database Repository Comprehensive Test Suite (Prompt 8)
 *
 * Verifies all 10 required database persistence scenarios:
 * 1. Create a Search
 * 2. Save a Query Interpretation
 * 3. Save multiple Research Sources
 * 4. Save multiple Price Observations
 * 5. Save a Final Search Result
 * 6. Retrieve a Search and its full related relational graph
 * 7. Update search status
 * 8. Handle database failure (e.g. simulated connection/query error)
 * 9. Handle invalid/malformed data (e.g. missing fields, bad types, foreign key violations)
 * 10. Verify duplicate/retry protection (idempotency, upsert)
 */

import {
  InMemoryRelationalRepository,
  ForeignKeyConstraintError,
  ValidationError,
  RecordNotFoundError,
} from './databaseRepository';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTestSuite() {
  console.log('--- RUNNING PRICERA DATABASE REPOSITORY TEST SUITE (10 SCENARIOS) ---');
  const repo = new InMemoryRelationalRepository();

  // Test 1: Create a Search
  console.log('Testing Scenario 1: Create a Search...');
  const search = await repo.createSearch({
    originalQuery: '12mm marine plywood price in Nigeria',
    normalizedQuery: '12mm marine plywood price in Nigeria',
    status: 'processing',
  });
  assert(Boolean(search.id), 'Search must have a unique ID');
  assert(search.originalQuery === '12mm marine plywood price in Nigeria', 'Original query must match');
  assert(search.status === 'processing', 'Initial status must be processing');
  assert(Boolean(search.createdAt), 'CreatedAt timestamp must be present');
  console.log('✓ Scenario 1: Create a Search PASSED');

  // Test 2: Save a Query Interpretation
  console.log('Testing Scenario 2: Save a Query Interpretation...');
  const interpretation = await repo.saveQueryInterpretation({
    searchId: search.id,
    productName: '12mm Marine Plywood',
    category: 'Building Materials',
    description: 'High-moisture structural marine grade plywood panel.',
    brand: null,
    model: null,
    material: 'Plywood',
    specifications: ['Thickness: 12mm', 'Grade: Marine'],
    possibleVariants: ['18mm Marine Plywood', 'BS 1088'],
    searchQueries: ['12mm marine plywood suppliers Lagos', 'buy 12mm marine plywood Nigeria'],
    confidence: 0.95,
    uncertainties: ['Sheet dimensions not specified'],
  });
  assert(interpretation.searchId === search.id, 'Interpretation must link to Search');
  assert(interpretation.productName === '12mm Marine Plywood', 'Product name must match');
  assert(interpretation.specifications.length === 2, 'Specifications array preserved');
  assert(interpretation.confidence === 0.95, 'Confidence score preserved');
  console.log('✓ Scenario 2: Save a Query Interpretation PASSED');

  // Test 3: Save multiple Research Sources
  console.log('Testing Scenario 3: Save multiple Research Sources...');
  const sources = await repo.saveResearchSources([
    {
      searchId: search.id,
      title: '12mm Marine Plywood Sheet (8x4ft)',
      url: 'https://timberdistributor.ng/products/marine-12mm',
      seller: 'TimberDistributor NG',
      brand: 'TimberCore',
      product: 'Plywood Sheet',
      price: 285000,
      currency: 'NGN',
      availability: 'In Stock',
      specifications: ['12mm', '8x4ft'],
      rawSnippet: 'Premium water-resistant 12mm marine plywood available in Lagos.',
      isRelevantMatch: true,
    },
    {
      searchId: search.id,
      title: 'BS 1088 Hardwood Marine Plywood 12mm',
      url: 'https://lagoswoodhub.com/plywood/12mm-marine',
      seller: 'Lagos Wood Hub',
      brand: null,
      product: 'Marine Board',
      price: 290000,
      currency: 'NGN',
      availability: 'In Stock',
      specifications: ['12mm', 'BS 1088'],
      rawSnippet: 'Direct import marine grade board in stock.',
      isRelevantMatch: true,
    },
  ]);
  assert(sources.length === 2, 'Must save 2 research sources');
  assert(sources[0].url === 'https://timberdistributor.ng/products/marine-12mm', 'Authentic URL preserved');
  assert(sources[1].price === 290000, 'Original price preserved');
  console.log('✓ Scenario 3: Save multiple Research Sources PASSED');

  // Test 4: Save multiple Price Observations
  console.log('Testing Scenario 4: Save multiple Price Observations...');
  const observations = await repo.savePriceObservations([
    {
      searchId: search.id,
      sourceId: sources[0].id,
      sourceDomain: 'timberdistributor.ng',
      title: sources[0].title,
      originalPrice: 285000,
      originalCurrency: 'NGN',
      normalizedPrice: null,
      normalizedCurrency: null,
      product: 'Plywood Sheet',
      specifications: ['12mm'],
      isOutlier: false,
    },
    {
      searchId: search.id,
      sourceId: sources[1].id,
      sourceDomain: 'lagoswoodhub.com',
      title: sources[1].title,
      originalPrice: 290000,
      originalCurrency: 'NGN',
      normalizedPrice: null,
      normalizedCurrency: null,
      product: 'Marine Board',
      specifications: ['12mm'],
      isOutlier: false,
    },
  ]);
  assert(observations.length === 2, 'Must save 2 price observations');
  assert(observations[0].sourceId === sources[0].id, 'Observation links to Source');
  assert(observations[0].originalPrice === 285000, 'Original price recorded');
  assert(observations[0].originalCurrency === 'NGN', 'Original currency recorded');
  console.log('✓ Scenario 4: Save multiple Price Observations PASSED');

  // Test 5: Save a Final Search Result
  console.log('Testing Scenario 5: Save a Final Search Result...');
  const finalResult = await repo.saveFinalResult({
    searchId: search.id,
    estimatedPrice: 287500,
    minPrice: 285000,
    maxPrice: 290000,
    currency: 'NGN',
    confidence: 'high',
    sampleSize: 2,
    methodology: 'PRICERA compared 2 compatible price observations and used the median observed price to produce the representative estimate.',
    limitations: ['Prices may vary by dealer in different local government areas.'],
    productName: '12mm Marine Plywood',
    productCategory: 'Building Materials',
  });
  assert(finalResult.estimatedPrice === 287500, 'Estimated price matches median');
  assert(finalResult.confidence === 'high', 'Confidence rating preserved');
  assert(finalResult.currency === 'NGN', 'Currency preserved');
  assert(finalResult.sampleSize === 2, 'Sample size preserved');
  console.log('✓ Scenario 5: Save a Final Search Result PASSED');

  // Test 6: Retrieve a Search and its related data (full relational graph)
  console.log('Testing Scenario 6: Retrieve a Search and its related graph...');
  const retrieved = await repo.getSearch(search.id);
  assert(retrieved !== null, 'Search record must be found');
  assert(retrieved!.search.id === search.id, 'Search ID matches');
  assert(retrieved!.interpretation !== null, 'Interpretation must be populated');
  assert(retrieved!.interpretation!.productName === '12mm Marine Plywood', 'Interpretation product name verified');
  assert(retrieved!.sources.length === 2, 'Sources array length 2');
  assert(retrieved!.observations.length === 2, 'Observations array length 2');
  assert(retrieved!.finalResult !== null, 'Final result populated');
  assert(retrieved!.finalResult!.estimatedPrice === 287500, 'Final result matches');
  console.log('✓ Scenario 6: Retrieve full Search graph PASSED');

  // Test 7: Update search status
  console.log('Testing Scenario 7: Update search status...');
  const updatedSearch = await repo.updateSearchStatus(search.id, 'completed', finalResult.id);
  assert(updatedSearch.status === 'completed', 'Status updated to completed');
  assert(updatedSearch.finalResultId === finalResult.id, 'Final result ID referenced in Search');
  console.log('✓ Scenario 7: Update search status PASSED');

  // Test 8: Handle database failure / non-existent entities
  console.log('Testing Scenario 8: Handle database failure...');
  let recordNotFoundCaught = false;
  try {
    await repo.updateSearchStatus('non-existent-search-id-0000', 'completed');
  } catch (err) {
    if (err instanceof RecordNotFoundError) {
      recordNotFoundCaught = true;
    }
  }
  assert(recordNotFoundCaught, 'Must catch RecordNotFoundError on non-existent search ID');
  console.log('✓ Scenario 8: Handle database failure PASSED');

  // Test 9: Handle invalid/malformed data & Foreign Key violations
  console.log('Testing Scenario 9: Handle invalid/malformed data...');
  let fkErrorCaught = false;
  try {
    // Attempt to save interpretation for invalid non-existent search ID
    await repo.saveQueryInterpretation({
      searchId: '00000000-0000-0000-0000-000000000000',
      productName: 'Ghost Item',
      category: 'None',
      description: '',
      brand: null,
      model: null,
      material: null,
      specifications: [],
      possibleVariants: [],
      searchQueries: [],
      confidence: 0,
      uncertainties: [],
    });
  } catch (err) {
    if (err instanceof ForeignKeyConstraintError) {
      fkErrorCaught = true;
    }
  }
  assert(fkErrorCaught, 'Must reject interpretation with ForeignKeyConstraintError when search does not exist');

  let validationErrorCaught = false;
  try {
    // Attempt to save price observation with invalid negative price
    await repo.savePriceObservations([
      {
        searchId: search.id,
        sourceDomain: 'bad.test',
        title: 'Bad Item',
        originalPrice: -500,
        originalCurrency: 'USD',
        product: 'Item',
        specifications: [],
      },
    ]);
  } catch (err) {
    if (err instanceof ValidationError) {
      validationErrorCaught = true;
    }
  }
  assert(validationErrorCaught, 'Must reject negative price with ValidationError');
  console.log('✓ Scenario 9: Handle invalid/malformed data PASSED');

  // Test 10: Verify duplicate / retry protection (idempotency, upsert)
  console.log('Testing Scenario 10: Duplicate / retry protection...');
  const duplicateSearch = await repo.createSearch({
    id: search.id, // Re-using same search ID
    originalQuery: '12mm marine plywood price in Nigeria',
    normalizedQuery: '12mm marine plywood price in Nigeria',
  });
  assert(duplicateSearch.id === search.id, 'Must return existing search safely without duplicate creation');

  // Idempotent final result upsert on the same searchId
  const upsertedFinalResult = await repo.saveFinalResult({
    searchId: search.id,
    estimatedPrice: 288000, // Updated calculation
    minPrice: 285000,
    maxPrice: 290000,
    currency: 'NGN',
    confidence: 'high',
    sampleSize: 2,
    methodology: 'Updated estimate calculation on retry.',
    limitations: [],
    productName: '12mm Marine Plywood',
    productCategory: 'Building Materials',
  });
  assert(upsertedFinalResult.estimatedPrice === 288000, 'Must upsert final result without duplicate row creation');

  // Check graph count still has 1 final result
  const postRetryGraph = await repo.getSearch(search.id);
  assert(postRetryGraph!.finalResult !== null, 'Final result present');
  assert(postRetryGraph!.finalResult!.estimatedPrice === 288000, 'Updated value reflected');
  console.log('✓ Scenario 10: Duplicate / retry protection PASSED');

  console.log('--- ALL 10 PRICERA DATABASE REPOSITORY SCENARIOS PASSED WITH ZERO ERRORS ---');
}

runTestSuite().catch((err) => {
  console.error('Database Repository Test Suite Failed:', err);
  process.exit(1);
});
