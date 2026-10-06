/**
 * ISOLATED DEMONSTRATION & UI SCHEMA FIXTURES
 *
 * IMPORTANT COMPLIANCE NOTICE:
 * This file contains strictly isolated demonstration mock data used exclusively to validate
 * frontend component layout, responsive behavior, and data contract rendering during Prompts 1 & 2.
 *
 * In accordance with product principles:
 * - These figures are synthetic schema fixtures and DO NOT represent real live web research results.
 * - URLs reference non-commercial example domains (example.org / .test).
 * - All displayed estimates are explicitly labeled in the UI as prototype layout demonstrations.
 * - This mock module will be swapped for real server-side endpoints in Stage 3 without touching UI components.
 */

import { ResearchPipelineResult } from '@/src/types';

export const DEMO_DATASETS: Record<string, ResearchPipelineResult> = {
  '12mm marine plywood': {
    queryId: 'demo-plywood-001',
    timestamp: '2026-10-06T16:00:00Z',
    rawQuery: '12mm marine plywood',
    isMockData: true,
    executionTimeMs: 840,
    interpretation: {
      rawQuery: '12mm marine plywood',
      normalizedQuery: 'Marine Plywood Sheet 12mm BS1088',
      identifiedCategory: 'Building Materials / Structural Timber & Sheet Goods',
      detectedSpecifications: {
        'Nominal Thickness': '12 mm (~1/2 inch)',
        'Grade Standard': 'BS 1088 Marine Grade',
        'Core Veneer': 'Hardwood / Okoume / Sapele',
        'Standard Sheet Dimension': '2440 x 1220 mm (4 ft x 8 ft)',
        'Glue Spec': 'WBP (Weather and Boil Proof) Phenolic',
      },
      possibleAmbiguities: [
        'Differentiate between BS 1088 certified marine grade vs standard exterior WBP plywood.',
        'Okoume vs Keruing hardwood core introduces price variance.'
      ],
      suggestedSearchQueries: [
        { query: '12mm marine plywood BS1088 sheet price', intent: 'price_check', targetAudience: 'contractor' },
        { query: 'marine grade hardwood plywood 2440x1220 12mm trade distributor', intent: 'supplier_lookup', targetAudience: 'b2b_wholesale' },
        { query: 'marine plywood 12mm spec sheet density durability', intent: 'spec_sheet', targetAudience: 'contractor' }
      ]
    },
    product: {
      id: 'prod-plywood-12mm',
      canonicalName: '12mm BS 1088 Marine Hardwood Plywood',
      shortDescription: 'Specially treated moisture-resistant structural plywood manufactured with high-grade hardwood veneers and phenolic glue for marine, humid, and architectural applications.',
      primaryCategory: 'Sheet Materials',
      subCategory: 'Marine Grade Plywood',
      materialType: 'Okoume / Hardwood Core with WBP Resin',
      commonApplications: [
        'Boat building & marine joinery',
        'High-humidity bathrooms & wet room paneling',
        'Exterior signage & exposed architectural cabinetry',
        'Specialist structural subflooring'
      ],
      specifications: [
        { id: 's1', name: 'Thickness', value: '12 mm', unit: 'mm', category: 'dimension', confidence: 'high' },
        { id: 's2', name: 'Sheet Dimensions', value: '2440 x 1220 mm (8 x 4 ft)', unit: 'mm', category: 'dimension', confidence: 'high' },
        { id: 's3', name: 'Grading Standard', value: 'BS 1088-1:2003', category: 'standard', confidence: 'high' },
        { id: 's4', name: 'Adhesive Class', value: 'EN 314-2 Class 3 (Exterior)', category: 'performance', confidence: 'high' },
        { id: 's5', name: 'Approx. Weight', value: '~19.5 - 22.0 kg per sheet', unit: 'kg', category: 'dimension', confidence: 'medium' },
        { id: 's6', name: 'Face Veneer Quality', value: 'Grade B/BB or BB/BB sanded', category: 'grade', confidence: 'high' }
      ],
      knownBrandsOrManufacturers: ['Joubert Plywood', 'Robbins Timber', 'Bruynzeel', 'Generic BS1088 Importers'],
      variants: [
        { id: 'v1', title: '100% Okoume Lightweight Marine', distinguishingFeatures: ['Lightweight', 'High flexibility', 'Premium aesthetic finish'], approximateRelativeCost: 'higher' },
        { id: 'v2', title: 'Mixed Hardwood Core Marine', distinguishingFeatures: ['Higher density', 'Heavy duty', 'Cost-optimized for sub-structures'], approximateRelativeCost: 'standard' }
      ],
      standardUnitsOfMeasure: ['per standard sheet (2440 x 1220 mm)', 'per pack (50 sheets wholesale)', 'per square meter']
    },
    pricingEstimate: {
      range: {
        min: 44.50,
        median: 58.20,
        max: 76.00,
        currency: 'USD',
        unit: 'per sheet (2440 x 1220 x 12mm)'
      },
      confidenceRating: 'HIGH',
      sampleSize: 14,
      dataFreshness: 'Simulated Prototype Baseline',
      marketConditionNotes: 'Timber freight surcharges and timber timber harvesting quotas cause notable regional variance. Bulk packs (20+ sheets) typically trade 15-22% below single-sheet counter prices.',
      priceSpreadPercent: 41,
      assumptions: [
        {
          id: 'a1',
          statement: 'Pricing represents individual sheet counter retail/trade price; wholesale pallet orders yield lower per-unit cost.',
          impactLevel: 'high',
          context: 'Volume procurement discounts apply for packs exceeding 25 sheets.'
        },
        {
          id: 'a2',
          statement: 'Excludes local delivery freight, cutting fees, and value-added tax/customs.',
          impactLevel: 'medium',
          context: 'Sheet materials incur localized oversize delivery charges depending on distance.'
        },
        {
          id: 'a3',
          statement: 'Assumes genuine certified BS 1088 stamp rather than standard non-certified exterior WBP.',
          impactLevel: 'high',
          context: 'Uncertified WBP plywood is frequently 30-40% cheaper but lacks marine durability.'
        }
      ],
      disclaimer: 'Prototype Demonstration Data: This price estimate is a synthetic structural fixture demonstrating the UI layout. Real web research and live quotes will activate in subsequent implementation stages.'
    },
    sources: [
      {
        id: 'src-1',
        sourceName: 'Example National Timber Merchants',
        sourceDomain: 'example-timber-merchant.test',
        sourceUrl: 'https://example.com/demo-source-timber-1',
        pageTitle: '12mm Marine Hardwood Plywood BS1088 2440x1220mm',
        observedPrice: 56.90,
        currency: 'USD',
        unitOfMeasure: 'per sheet',
        observationDate: '2026-09-28',
        sourceType: 'trade_supplier',
        extractedSnippet: 'Top-tier BS1088 certified 12mm marine ply suitable for boat construction and wet applications. Cut to size available. Standard sheet $56.90 inc trade discount.',
        specMatchScore: 0.96,
        isVerified: true
      },
      {
        id: 'src-2',
        sourceName: 'Example Construction Supply Direct',
        sourceDomain: 'example-constructionsupply.test',
        sourceUrl: 'https://example.com/demo-source-timber-2',
        pageTitle: 'Marine Grade Plywood 12mm (8ft x 4ft) Phenolic Bond',
        observedPrice: 62.50,
        currency: 'USD',
        unitOfMeasure: 'per sheet',
        observationDate: '2026-10-01',
        sourceType: 'distributor',
        extractedSnippet: 'Engineered with selected tropical hardwood veneers and waterproof boiling-proof glue. Tested to BS1088 specification. $62.50 per unit.',
        specMatchScore: 0.94,
        isVerified: true
      },
      {
        id: 'src-3',
        sourceName: 'Example Specialist Marine Timber Hub',
        sourceDomain: 'example-marinetimber.test',
        sourceUrl: 'https://example.com/demo-source-timber-3',
        pageTitle: 'Premium Lightweight Okoume Marine Plywood 12mm',
        observedPrice: 74.00,
        currency: 'USD',
        unitOfMeasure: 'per sheet',
        observationDate: '2026-09-15',
        sourceType: 'retailer',
        extractedSnippet: 'Lloyds Register type-approved Okoume marine plywood 12mm. Exceptional face veneers on both sides. $74.00 single sheet retail price.',
        specMatchScore: 0.98,
        isVerified: true
      },
      {
        id: 'src-4',
        sourceName: 'Example Wholesale Building Warehouse',
        sourceDomain: 'example-warehouse.test',
        sourceUrl: 'https://example.com/demo-source-timber-4',
        pageTitle: 'Bulk Structural Plywood 12mm Exterior Marine Spec',
        observedPrice: 47.80,
        currency: 'USD',
        unitOfMeasure: 'per sheet (min 10)',
        observationDate: '2026-10-03',
        sourceType: 'distributor',
        extractedSnippet: 'Trade pack pricing for contractors: 12mm exterior marine grade sheet, minimum 10 sheet order. $47.80 per sheet.',
        specMatchScore: 0.88,
        isVerified: true
      }
    ]
  },

  'cement board': {
    queryId: 'demo-cement-002',
    timestamp: '2026-10-06T16:00:00Z',
    rawQuery: 'cement board',
    isMockData: true,
    executionTimeMs: 780,
    interpretation: {
      rawQuery: 'cement board',
      normalizedQuery: 'Cement Backer Board 1/2 in. (12.7mm) / 1/4 in. (6mm)',
      identifiedCategory: 'Building Materials / Tile Substrates & Underlayment',
      detectedSpecifications: {
        'Common Thicknesses': '1/2 inch (12.7mm) for walls; 1/4 inch (6mm) for floors',
        'Common Sheet Sizes': '3 ft x 5 ft (914 x 1524 mm) or 4 ft x 8 ft',
        'Composition': 'Portland cement base reinforced with polymer-coated glass-fiber mesh',
        'Fire Rating': 'Non-combustible (Class A)',
      },
      possibleAmbiguities: [
        'Differentiate between floor underlayment (1/4") and wall backer board (1/2").',
        'Differentiate cement board (HardieBacker/Durock) from fiber cement siding or magnesium oxide board.'
      ],
      suggestedSearchQueries: [
        { query: 'cement backer board 1/2 inch 3x5 sheet price contractor', intent: 'price_check', targetAudience: 'contractor' },
        { query: 'cement board Durock vs HardieBacker unit cost', intent: 'supplier_lookup', targetAudience: 'contractor' }
      ]
    },
    product: {
      id: 'prod-cement-board',
      canonicalName: 'Cement Backer Board (Standard 1/2 in. 3ft x 5ft)',
      shortDescription: 'High-density moisture-resistant substrate panel designed for ceramic tile, stone installation in wet areas like showers, tub surrounds, and exterior cladding.',
      primaryCategory: 'Substrates & Underlayments',
      subCategory: 'Tile Backer Boards',
      materialType: 'Portland Cement & Glass-Fiber Mesh Reinforcement',
      commonApplications: [
        'Tile backer for shower enclosures and tub surrounds',
        'Kitchen countertops tile underlayment',
        'Fireplace hearth surrounds (heat-resistant up to rated temps)',
        'Exterior thin-brick and stone veneer substrate'
      ],
      specifications: [
        { id: 'c1', name: 'Standard Thickness', value: '1/2 in. (12.7 mm)', unit: 'inch', category: 'dimension', confidence: 'high' },
        { id: 'c2', name: 'Sheet Size', value: '3 ft x 5 ft (914 x 1524 mm)', unit: 'ft', category: 'dimension', confidence: 'high' },
        { id: 'c3', name: 'Unit Weight', value: '~35 - 40 lbs (~16 - 18 kg)', unit: 'lbs', category: 'dimension', confidence: 'high' },
        { id: 'c4', name: 'Water Absorption', value: '< 8% (ASTM C473)', category: 'performance', confidence: 'high' },
        { id: 'c5', name: 'Surface Flammability', value: 'Flame Spread: 0, Smoke: 0 (ASTM E84)', category: 'performance', confidence: 'high' }
      ],
      knownBrandsOrManufacturers: ['USG Durock', 'James Hardie (HardieBacker)', 'National Gypsum (PermaBase)', 'WonderBoard'],
      variants: [
        { id: 'cv1', title: '1/4-inch Floor Underlayment', distinguishingFeatures: ['Thinner profile', 'Minimizes floor transition heights', 'Floor-only rated'], approximateRelativeCost: 'lower' },
        { id: 'cv2', title: '1/2-inch Wet-Area Wall Board', distinguishingFeatures: ['Full wall stud spacing support', 'Standard drywall transition thickness'], approximateRelativeCost: 'standard' }
      ],
      standardUnitsOfMeasure: ['per 3x5 ft sheet', 'per 4x8 ft sheet', 'per square foot']
    },
    pricingEstimate: {
      range: {
        min: 13.50,
        median: 16.75,
        max: 22.00,
        currency: 'USD',
        unit: 'per 3ft x 5ft sheet (1/2 in.)'
      },
      confidenceRating: 'HIGH',
      sampleSize: 18,
      dataFreshness: 'Simulated Prototype Baseline',
      marketConditionNotes: 'Cement board pricing exhibits consistent national stability across hardware and masonry supply houses, with pallet pricing (50-60 sheets) providing 10-15% margin reductions.',
      priceSpreadPercent: 38,
      assumptions: [
        {
          id: 'ca1',
          statement: 'Quoted benchmark corresponds to standard 3 ft x 5 ft (15 sq ft) 1/2 in. sheet.',
          impactLevel: 'high',
          context: '4 ft x 8 ft commercial sheets scale higher roughly proportional to surface area.'
        },
        {
          id: 'ca2',
          statement: 'Excludes specialized alkali-resistant screws and fiberglass seam tape required for installation.',
          impactLevel: 'medium',
          context: 'Accessories typically add $0.30 - $0.50 per square foot to overall assembly.'
        }
      ],
      disclaimer: 'Prototype Demonstration Data: This price estimate is a synthetic structural fixture demonstrating the UI layout. Real web research and live quotes will activate in subsequent implementation stages.'
    },
    sources: [
      {
        id: 'src-c1',
        sourceName: 'Example Hardware & Building Depot',
        sourceDomain: 'example-depot.test',
        sourceUrl: 'https://example.com/demo-source-cement-1',
        pageTitle: '1/2 in. x 3 ft. x 5 ft. Cement Board Underlayment',
        observedPrice: 15.98,
        currency: 'USD',
        unitOfMeasure: 'per sheet',
        observationDate: '2026-10-02',
        sourceType: 'retailer',
        extractedSnippet: 'Durock brand 1/2 in. x 3 ft. x 5 ft. cement board panel for tile walls and floors. Moisture and mold resistant. In stock $15.98.',
        specMatchScore: 0.98,
        isVerified: true
      },
      {
        id: 'src-c2',
        sourceName: 'Example Pro Contractor Supply',
        sourceDomain: 'example-prosupply.test',
        sourceUrl: 'https://example.com/demo-source-cement-2',
        pageTitle: 'HardieBacker 0.5 in. 36x60 in. Cement Backer Board',
        observedPrice: 17.50,
        currency: 'USD',
        unitOfMeasure: 'per sheet',
        observationDate: '2026-09-29',
        sourceType: 'distributor',
        extractedSnippet: 'HardieBacker 1/2 in. cement board with EZ Grid technology. Commercial contractor bundle pricing available. Unit price $17.50.',
        specMatchScore: 0.97,
        isVerified: true
      }
    ]
  },

  'samsung a55': {
    queryId: 'demo-samsung-003',
    timestamp: '2026-10-06T16:00:00Z',
    rawQuery: 'Samsung A55',
    isMockData: true,
    executionTimeMs: 650,
    interpretation: {
      rawQuery: 'Samsung A55',
      normalizedQuery: 'Samsung Galaxy A55 5G Smartphone',
      identifiedCategory: 'Consumer Electronics / Smartphones',
      detectedSpecifications: {
        'Display': '6.6-inch Super AMOLED, 120Hz, FHD+ (1080 x 2340)',
        'Processor': 'Exynos 1480 (4nm)',
        'Storage Variants': '128GB / 256GB with expandable microSD',
        'RAM': '8GB / 12GB',
        'Main Camera': '50MP with OIS + 12MP Ultra-wide + 5MP Macro',
        'Battery': '5000 mAh with 25W Fast Charging'
      },
      possibleAmbiguities: [
        'Storage variant (128GB vs 256GB) significantly affects price point.',
        'Regional LTE/5G network band variants (global dual-SIM vs carrier locked).'
      ],
      suggestedSearchQueries: [
        { query: 'Samsung Galaxy A55 5G 256GB unlocked price', intent: 'price_check', targetAudience: 'retail' },
        { query: 'Samsung A55 128GB authorized retailer deals', intent: 'supplier_lookup', targetAudience: 'retail' }
      ]
    },
    product: {
      id: 'prod-samsung-a55',
      canonicalName: 'Samsung Galaxy A55 5G (Dual SIM / Unlocked)',
      shortDescription: 'Mid-tier Android smartphone featuring premium glass and metal build, 6.6-inch 120Hz AMOLED display, 50MP OIS camera, and IP67 dust/water resistance.',
      primaryCategory: 'Consumer Electronics',
      subCategory: 'Mobile Phones',
      materialType: 'Gorilla Glass Victus+ Front/Back with Aluminum Frame',
      commonApplications: [
        'Everyday mobile communication',
        'High-resolution mobile photography & 4K video recording',
        'Enterprise fleet mobility with Samsung Knox security'
      ],
      specifications: [
        { id: 'p1', name: 'Screen Size', value: '6.6 inches (Super AMOLED)', unit: 'in', category: 'dimension', confidence: 'high' },
        { id: 'p2', name: 'Refresh Rate', value: '120 Hz', unit: 'Hz', category: 'performance', confidence: 'high' },
        { id: 'p3', name: 'Storage Capacity', value: '128GB / 256GB', category: 'general', confidence: 'high' },
        { id: 'p4', name: 'Battery Capacity', value: '5,000 mAh', unit: 'mAh', category: 'performance', confidence: 'high' },
        { id: 'p5', name: 'Ingress Protection', value: 'IP67 water/dust resistant', category: 'standard', confidence: 'high' }
      ],
      knownBrandsOrManufacturers: ['Samsung Electronics'],
      variants: [
        { id: 'sv1', title: '128GB Storage / 8GB RAM', distinguishingFeatures: ['Base storage tier'], approximateRelativeCost: 'lower' },
        { id: 'sv2', title: '256GB Storage / 8GB RAM', distinguishingFeatures: ['Expanded onboard memory'], approximateRelativeCost: 'higher' }
      ],
      standardUnitsOfMeasure: ['per unit (unlocked handset)']
    },
    pricingEstimate: {
      range: {
        min: 349.00,
        median: 389.00,
        max: 449.00,
        currency: 'USD',
        unit: 'per unit (unlocked 256GB)'
      },
      confidenceRating: 'HIGH',
      sampleSize: 22,
      dataFreshness: 'Simulated Prototype Baseline',
      marketConditionNotes: 'Subject to regional import variations and promotional rebates. 128GB model typically trades $40 - $50 below 256GB variant.',
      priceSpreadPercent: 25,
      assumptions: [
        {
          id: 'sa1',
          statement: 'Pricing represents factory unlocked international/regional model, not subsidized carrier contract.',
          impactLevel: 'high',
          context: 'Carrier financing agreements frequently mask true hardware retail valuation.'
        },
        {
          id: 'sa2',
          statement: 'Standard packaging does not include wall charger adapter in box.',
          impactLevel: 'low',
          context: 'Wall plug accessory requires separate purchase.'
        }
      ],
      disclaimer: 'Prototype Demonstration Data: This price estimate is a synthetic structural fixture demonstrating the UI layout. Real web research and live quotes will activate in subsequent implementation stages.'
    },
    sources: [
      {
        id: 'src-s1',
        sourceName: 'Example Electronics Superstore',
        sourceDomain: 'example-techstore.test',
        sourceUrl: 'https://example.com/demo-source-phone-1',
        pageTitle: 'Samsung Galaxy A55 5G 256GB Awesome Navy Unlocked',
        observedPrice: 389.99,
        currency: 'USD',
        unitOfMeasure: 'per unit',
        observationDate: '2026-10-04',
        sourceType: 'retailer',
        extractedSnippet: 'Official unlocked Samsung A55 5G smartphone. 8GB RAM, 256GB internal storage. Aluminum frame and Awesome Navy finish. $389.99.',
        specMatchScore: 0.98,
        isVerified: true
      },
      {
        id: 'src-s2',
        sourceName: 'Example Global Telecom Marketplace',
        sourceDomain: 'example-telemarket.test',
        sourceUrl: 'https://example.com/demo-source-phone-2',
        pageTitle: 'Galaxy A55 A556E 5G Dual SIM 128GB Factory Unlocked',
        observedPrice: 349.00,
        currency: 'USD',
        unitOfMeasure: 'per unit',
        observationDate: '2026-09-30',
        sourceType: 'marketplace',
        extractedSnippet: 'Brand new in box Samsung Galaxy A55 5G 128GB ROM global version. Unlocked for all GSM carriers worldwide. $349.00 with fast dispatch.',
        specMatchScore: 0.93,
        isVerified: true
      }
    ]
  },

  'industrial safety helmet': {
    queryId: 'demo-helmet-004',
    timestamp: '2026-10-06T16:00:00Z',
    rawQuery: 'industrial safety helmet',
    isMockData: true,
    executionTimeMs: 690,
    interpretation: {
      rawQuery: 'industrial safety helmet',
      normalizedQuery: 'Industrial Hard Hat / Safety Helmet (EN 397 / ANSI Z89.1 Type 1)',
      identifiedCategory: 'Industrial Supplies / Personal Protective Equipment (PPE)',
      detectedSpecifications: {
        'Impact Protection Standard': 'ANSI/ISEA Z89.1 Type 1 / EN 397',
        'Electrical Class': 'Class E (20,000V rated) or Class C (conductive/vented)',
        'Suspension Mechanism': '4-point or 6-point ratchet suspension',
        'Shell Material': 'High-Density Polyethylene (HDPE) or ABS / Polycarbonate'
      },
      possibleAmbiguities: [
        'Vented helmets offer superior heat comfort but forfeit electrical Class E rating.',
        'Climbing/work-at-height helmets (EN 12492) with chin strap versus standard cap-style construction hard hats.'
      ],
      suggestedSearchQueries: [
        { query: 'industrial safety helmet ANSI Class E ratchet suspension price', intent: 'price_check', targetAudience: 'contractor' },
        { query: 'construction hard hat bulk pricing wholesale supplier', intent: 'supplier_lookup', targetAudience: 'b2b_wholesale' }
      ]
    },
    product: {
      id: 'prod-safety-helmet',
      canonicalName: 'Industrial Safety Hard Hat with Ratchet Suspension',
      shortDescription: 'Certified heavy-duty protective headwear engineered to protect personnel against falling debris, top impact, and high-voltage electrical hazards.',
      primaryCategory: 'Personal Protective Equipment',
      subCategory: 'Head Protection',
      materialType: 'Impact-Resistant HDPE / ABS Polymer Shell',
      commonApplications: [
        'Construction site general labor and trade management',
        'Manufacturing and heavy assembly plants',
        'Electrical utility and sub-station service',
        'Warehouse logistics and materials handling'
      ],
      specifications: [
        { id: 'h1', name: 'Certification Standard', value: 'ANSI/ISEA Z89.1-2014 Type 1', category: 'standard', confidence: 'high' },
        { id: 'h2', name: 'Electrical Protection', value: 'Class E (Tested to 20,000 Volts)', category: 'performance', confidence: 'high' },
        { id: 'h3', name: 'Suspension System', value: '6-Point Wheel Ratchet Adjustment', category: 'performance', confidence: 'high' },
        { id: 'h4', name: 'Shell Material', value: 'High-Density Polyethylene (HDPE)', category: 'material', confidence: 'high' },
        { id: 'h5', name: 'Weight', value: '~380 grams (13.4 oz)', unit: 'g', category: 'dimension', confidence: 'medium' }
      ],
      knownBrandsOrManufacturers: ['MSA Safety (V-Gard)', '3M (SecureFit)', 'Honeywell (Fibre-Metal)', 'JSP Safety'],
      variants: [
        { id: 'hv1', title: 'Cap Style with Front Brim', distinguishingFeatures: ['Traditional visor', 'Compact profile for confined quarters'], approximateRelativeCost: 'standard' },
        { id: 'hv2', title: 'Full Brim 360° Shield', distinguishingFeatures: ['Complete UV sun and rain deflection all around'], approximateRelativeCost: 'higher' }
      ],
      standardUnitsOfMeasure: ['per unit (single pack)', 'per box (case of 20 units)']
    },
    pricingEstimate: {
      range: {
        min: 14.20,
        median: 19.50,
        max: 32.00,
        currency: 'USD',
        unit: 'per helmet (ANSI Class E ratchet)'
      },
      confidenceRating: 'HIGH',
      sampleSize: 26,
      dataFreshness: 'Simulated Prototype Baseline',
      marketConditionNotes: 'High-volume contractor cases (20-100 units) usually lower the per-helmet price to $11.00-$13.50. Specialized climbing style helmets with integrated visors range up to $85.00+.',
      priceSpreadPercent: 55,
      assumptions: [
        {
          id: 'ha1',
          statement: 'Pricing baseline reflects standard ANSI Class E non-vented ratchet hard hat.',
          impactLevel: 'high',
          context: 'Helmets featuring integrated chin-guards or dielectric face-shields fall into separate pricing categories.'
        },
        {
          id: 'ha2',
          statement: 'Does not include custom corporate company logo printing/tamping.',
          impactLevel: 'medium',
          context: 'Custom corporate branding setup runs $40-$100 initial print screen.'
        }
      ],
      disclaimer: 'Prototype Demonstration Data: This price estimate is a synthetic structural fixture demonstrating the UI layout. Real web research and live quotes will activate in subsequent implementation stages.'
    },
    sources: [
      {
        id: 'src-h1',
        sourceName: 'Example Industrial Safety Supply Co.',
        sourceDomain: 'example-safetysupply.test',
        sourceUrl: 'https://example.com/demo-source-helmet-1',
        pageTitle: 'MSA V-Gard Cap Style Hard Hat with Fas-Trac III Suspension',
        observedPrice: 18.75,
        currency: 'USD',
        unitOfMeasure: 'per unit',
        observationDate: '2026-10-03',
        sourceType: 'trade_supplier',
        extractedSnippet: 'Industry-standard MSA V-Gard protective cap. Durable polyethylene shell, certified ANSI Z89.1 Type I Class E. Unit price $18.75.',
        specMatchScore: 0.98,
        isVerified: true
      },
      {
        id: 'src-h2',
        sourceName: 'Example National MRO Distribution',
        sourceDomain: 'example-mrosupply.test',
        sourceUrl: 'https://example.com/demo-source-helmet-2',
        pageTitle: '3M SecureFit Safety Helmet H-700 Series Ratchet',
        observedPrice: 21.30,
        currency: 'USD',
        unitOfMeasure: 'per unit',
        observationDate: '2026-09-27',
        sourceType: 'distributor',
        extractedSnippet: 'Pressure diffusion technology reduces forehead pressure. Certified Type I Class C/G/E options. List price $21.30.',
        specMatchScore: 0.95,
        isVerified: true
      }
    ]
  },

  'stainless steel pipe 2 inch': {
    queryId: 'demo-pipe-005',
    timestamp: '2026-10-06T16:00:00Z',
    rawQuery: 'stainless steel pipe 2 inch',
    isMockData: true,
    executionTimeMs: 810,
    interpretation: {
      rawQuery: 'stainless steel pipe 2 inch',
      normalizedQuery: '2" Nominal Pipe Size (NPS) Stainless Steel Pipe (Grade 304/316)',
      identifiedCategory: 'Metals & Piping / Industrial Process Piping',
      detectedSpecifications: {
        'Nominal Size': '2 inch NPS (Outside Diameter 2.375 in / 60.3 mm)',
        'Standard Schedule': 'Schedule 10 (2.77mm wall) or Schedule 40 (3.91mm wall)',
        'Alloy Grade': 'ASTM A312 TP304 / TP304L or TP316 / TP316L',
        'Manufacturing': 'Welded (ERW) or Seamless (SMLS)'
      },
      possibleAmbiguities: [
        'Seamless vs welded construction: seamless is roughly 40-70% higher in cost.',
        'Grade 316 (marine/chemical resistant with molybdenum) carries a ~30% premium over Grade 304.',
        'Schedule 10 (thin wall) vs Schedule 40 (standard industrial).'
      ],
      suggestedSearchQueries: [
        { query: 'stainless steel pipe 2 inch schedule 40 304 welded price per foot', intent: 'price_check', targetAudience: 'contractor' },
        { query: '2 NPS 316 stainless pipe distributor 20ft length wholesale', intent: 'supplier_lookup', targetAudience: 'b2b_wholesale' }
      ]
    },
    product: {
      id: 'prod-ss-pipe-2in',
      canonicalName: '2-inch NPS Stainless Steel Pipe (ASTM A312 Grade 304 Sch 40)',
      shortDescription: 'Industrial corrosion-resistant metallic pipe designed for chemical transport, food and beverage processing lines, architectural handrails, and pressure piping.',
      primaryCategory: 'Metals & Raw Materials',
      subCategory: 'Stainless Steel Piping',
      materialType: 'Austenitic Stainless Steel (Alloy 304 / 304L)',
      commonApplications: [
        'Industrial chemical fluid and water handling',
        'Dairy and food sanitary processing lines',
        'Architectural balustrades and marine handrails',
        'High-temperature exhaust manifolds'
      ],
      specifications: [
        { id: 'sp1', name: 'Nominal Pipe Size', value: '2 inch (DN 50)', unit: 'in', category: 'dimension', confidence: 'high' },
        { id: 'sp2', name: 'Outside Diameter (OD)', value: '2.375 inches (60.3 mm)', unit: 'in', category: 'dimension', confidence: 'high' },
        { id: 'sp3', name: 'Wall Thickness (Sch 40)', value: '0.154 inches (3.91 mm)', unit: 'in', category: 'dimension', confidence: 'high' },
        { id: 'sp4', name: 'Alloy Grade', value: 'ASTM A312 TP304 / TP304L', category: 'material', confidence: 'high' },
        { id: 'sp5', name: 'Weight per Linear Foot', value: '~3.65 lbs / ft (~5.44 kg/m)', unit: 'lbs/ft', category: 'dimension', confidence: 'high' }
      ],
      knownBrandsOrManufacturers: ['Outokumpu', 'Tubacex', 'Sandvik / Alleima', 'Bristol Metals'],
      variants: [
        { id: 'spv1', title: 'Welded (ERW) Schedule 40 Grade 304', distinguishingFeatures: ['Cost-effective', 'Standard pressure rating'], approximateRelativeCost: 'standard' },
        { id: 'spv2', title: 'Seamless Grade 316L Schedule 40', distinguishingFeatures: ['Severe chemical/acid tolerance', 'High pressure critical service'], approximateRelativeCost: 'higher' }
      ],
      standardUnitsOfMeasure: ['per linear foot', 'per 20-foot standard mill stick', 'per meter']
    },
    pricingEstimate: {
      range: {
        min: 19.80,
        median: 26.50,
        max: 38.00,
        currency: 'USD',
        unit: 'per linear foot (Sch 40 Welded 304)'
      },
      confidenceRating: 'HIGH',
      sampleSize: 15,
      dataFreshness: 'Simulated Prototype Baseline',
      marketConditionNotes: 'Nickel and chromium commodity exchange futures cause frequent monthly raw material surcharges (RMS). Quoted figures reflect standard cut-to-length commercial sticks.',
      priceSpreadPercent: 48,
      assumptions: [
        {
          id: 'spa1',
          statement: 'Quotation assumes welded Grade 304 Schedule 40; Grade 316 seamless typically commands 1.7x to 2.2x this baseline.',
          impactLevel: 'high',
          context: 'Seamless pipe testing and Molybdenum alloying adds heavy production costs.'
        },
        {
          id: 'spa2',
          statement: 'Pricing based on 20 ft standard lengths; cut-to-order small sections incur minimum saw charges.',
          impactLevel: 'medium',
          context: 'Metal service centers charge $5-$12 per mechanical saw cut.'
        }
      ],
      disclaimer: 'Prototype Demonstration Data: This price estimate is a synthetic structural fixture demonstrating the UI layout. Real web research and live quotes will activate in subsequent implementation stages.'
    },
    sources: [
      {
        id: 'src-p1',
        sourceName: 'Example Metals & Alloy Depot',
        sourceDomain: 'example-metalsdepot.test',
        sourceUrl: 'https://example.com/demo-source-pipe-1',
        pageTitle: 'Stainless Steel Pipe 2 in. NPS Sch 40 Welded 304/304L',
        observedPrice: 25.80,
        currency: 'USD',
        unitOfMeasure: 'per foot',
        observationDate: '2026-10-02',
        sourceType: 'distributor',
        extractedSnippet: 'ASTM A312 welded stainless steel pipe 2" Sch 40. Available in random 20ft lengths or cut-to-length. $25.80/ft standard stock.',
        specMatchScore: 0.99,
        isVerified: true
      },
      {
        id: 'src-p2',
        sourceName: 'Example Industrial Piping Warehouse',
        sourceDomain: 'example-pipingwarehouse.test',
        sourceUrl: 'https://example.com/demo-source-pipe-2',
        pageTitle: '2 Inch Schedule 40 Stainless 304 Pipe Stick (20ft)',
        observedPrice: 510.00,
        currency: 'USD',
        unitOfMeasure: 'per 20ft length ($25.50/ft)',
        observationDate: '2026-09-28',
        sourceType: 'trade_supplier',
        extractedSnippet: 'Full 20-foot stick bundle price for contractors. Mill test report certified. $510.00 per 20ft stick ($25.50/ft equivalent).',
        specMatchScore: 0.97,
        isVerified: true
      }
    ]
  },

  'office chair': {
    queryId: 'demo-chair-006',
    timestamp: '2026-10-06T16:00:00Z',
    rawQuery: 'office chair',
    isMockData: true,
    executionTimeMs: 620,
    interpretation: {
      rawQuery: 'office chair',
      normalizedQuery: 'Ergonomic Mesh Task Office Chair (BIFMA Certified)',
      identifiedCategory: 'Commercial Furniture / Office Seating',
      detectedSpecifications: {
        'Ergonomic Mechanism': 'Synchro-tilt with multi-position lock',
        'Backrest Material': 'Breathable elastomeric mesh',
        'Adjustability': '4D armrests, pneumatic seat height, dynamic lumbar support',
        'Weight Capacity Standard': '275 - 350 lbs (BIFMA X5.1 rated)'
      },
      possibleAmbiguities: [
        'Broad query encompasses budget consumer task chairs ($70-$150) up to enterprise ergonomic chairs ($800-$1,400 like Herman Miller Aeron / Steelcase Gesture).',
        'Executive leather chairs vs breathable task mesh.'
      ],
      suggestedSearchQueries: [
        { query: 'ergonomic mesh office chair mid back BIFMA rated commercial price', intent: 'price_check', targetAudience: 'contractor' },
        { query: 'office task chairs corporate commercial procurement pricing', intent: 'supplier_lookup', targetAudience: 'b2b_wholesale' }
      ]
    },
    product: {
      id: 'prod-office-chair',
      canonicalName: 'Mid-Tier Ergonomic Mesh Task Chair',
      shortDescription: 'Adjustable high-performance workstation chair designed for 8+ hour commercial desk environments, featuring dynamic lumbar feedback and synchro-tilt mechanics.',
      primaryCategory: 'Commercial Furniture',
      subCategory: 'Ergonomic Task Seating',
      materialType: 'Nylon Polymer Frame, High-Resilience Molded Foam, Mesh Back',
      commonApplications: [
        'Corporate office workstations and conference facilities',
        'Home office ergonomic computing setups',
        'Control room 24/7 task environments'
      ],
      specifications: [
        { id: 'oc1', name: 'Certification Standard', value: 'ANSI/BIFMA X5.1 Commercial Seating', category: 'standard', confidence: 'high' },
        { id: 'oc2', name: 'Weight Rating', value: '300 lbs (136 kg)', unit: 'lbs', category: 'performance', confidence: 'high' },
        { id: 'oc3', name: 'Seat Height Travel', value: '17.5 to 21.5 inches', unit: 'in', category: 'dimension', confidence: 'high' },
        { id: 'oc4', name: 'Armrest Movement', value: '3D (Height, depth, pivot angle)', category: 'performance', confidence: 'high' },
        { id: 'oc5', name: 'Base Construction', value: 'Heavy-duty 5-star reinforced aluminum', category: 'material', confidence: 'high' }
      ],
      knownBrandsOrManufacturers: ['Steelcase', 'Herman Miller', 'HON Furniture', 'Haworth', 'Branch Ergonomic'],
      variants: [
        { id: 'ocv1', title: 'Mid-Tier Contract Commercial Chair', distinguishingFeatures: ['Durable fabric seat', 'Mesh back', '5-year trade warranty'], approximateRelativeCost: 'standard' },
        { id: 'ocv2', title: 'Premium Flagship Task Chair', distinguishingFeatures: ['Cast aluminum frame', 'Elastomeric suspension', '12-year 24/7 warranty'], approximateRelativeCost: 'higher' }
      ],
      standardUnitsOfMeasure: ['per unit', 'per lot (10+ units commercial floor fitout)']
    },
    pricingEstimate: {
      range: {
        min: 185.00,
        median: 279.00,
        max: 420.00,
        currency: 'USD',
        unit: 'per unit (commercial grade task chair)'
      },
      confidenceRating: 'MODERATE',
      sampleSize: 31,
      dataFreshness: 'Simulated Prototype Baseline',
      marketConditionNotes: 'Wide variance exists based on warranty duration and build material. Premium architectural benchmarks (Herman Miller Aeron) retail above $1,200, while generic flat-pack chairs sell under $120.',
      priceSpreadPercent: 62,
      assumptions: [
        {
          id: 'oca1',
          statement: 'Estimate targets ANSI/BIFMA commercial contract grade task chairs, not budget consumer flat-pack seating.',
          impactLevel: 'high',
          context: 'Consumer budget chairs lack commercial warranties and steel chassis components.'
        },
        {
          id: 'oca2',
          statement: 'Excludes commercial assembly labor and freight dock liftgate fees.',
          impactLevel: 'medium',
          context: 'Delivered knocked-down in box; assembly requires 15-20 minutes per unit.'
        }
      ],
      disclaimer: 'Prototype Demonstration Data: This price estimate is a synthetic structural fixture demonstrating the UI layout. Real web research and live quotes will activate in subsequent implementation stages.'
    },
    sources: [
      {
        id: 'src-oc1',
        sourceName: 'Example Commercial Office Outfitter',
        sourceDomain: 'example-officeoutfitters.test',
        sourceUrl: 'https://example.com/demo-source-chair-1',
        pageTitle: 'Ergonomic Task Chair with 3D Adjustable Arms & Mesh Back',
        observedPrice: 289.00,
        currency: 'USD',
        unitOfMeasure: 'per unit',
        observationDate: '2026-10-01',
        sourceType: 'trade_supplier',
        extractedSnippet: 'Commercial rated BIFMA task chair with synchronized tilt mechanism and pneumatic height adjustment. In stock $289.00.',
        specMatchScore: 0.94,
        isVerified: true
      },
      {
        id: 'src-oc2',
        sourceName: 'Example Business Furniture Supply',
        sourceDomain: 'example-businessfurniture.test',
        sourceUrl: 'https://example.com/demo-source-chair-2',
        pageTitle: 'Contract Ergonomic Seating Series 500 Mesh Chair',
        observedPrice: 255.00,
        currency: 'USD',
        unitOfMeasure: 'per unit (qty 5+)',
        observationDate: '2026-09-26',
        sourceType: 'distributor',
        extractedSnippet: 'High-durability mesh task chair suitable for open-plan corporate installations. Volume quote $255.00/unit.',
        specMatchScore: 0.92,
        isVerified: true
      }
    ]
  }
};

/**
 * Fallback generator for queries not in the fixed dataset.
 * It builds a normalized generic prototype result strictly tagged with isMockData: true,
 * demonstrating how any entered product query will display inside the UI layout.
 */
export function generateGenericDemoResult(query: string): ResearchPipelineResult {
  const cleanTerm = query.trim();
  const lower = cleanTerm.toLowerCase();

  return {
    queryId: `demo-generic-${Date.now()}`,
    timestamp: new Date().toISOString(),
    rawQuery: cleanTerm,
    isMockData: true,
    executionTimeMs: 720,
    interpretation: {
      rawQuery: cleanTerm,
      normalizedQuery: `${cleanTerm.charAt(0).toUpperCase() + cleanTerm.slice(1)} (Commercial Grade)`,
      identifiedCategory: 'Physical Goods / General Material Classification',
      detectedSpecifications: {
        'Query Term': cleanTerm,
        'Item Archetype': 'Physical Product / Material',
        'Classification': 'Standard Commercial Specification',
        'Research Scope': 'Industrial Suppliers, Distributors, Specialized Retailers'
      },
      possibleAmbiguities: [
        'Precise dimension, grade standard, and batch volume will narrow the pricing window.',
        'Distributor tier (wholesale vs retail single unit) affects observed pricing.'
      ],
      suggestedSearchQueries: [
        { query: `${cleanTerm} commercial supplier price specification`, intent: 'price_check', targetAudience: 'contractor' },
        { query: `${cleanTerm} technical datasheet dimensions standards`, intent: 'spec_sheet', targetAudience: 'b2b_wholesale' },
        { query: `${cleanTerm} wholesale distributor catalog price`, intent: 'supplier_lookup', targetAudience: 'b2b_wholesale' }
      ]
    },
    product: {
      id: `prod-generic-${Date.now()}`,
      canonicalName: `${cleanTerm.charAt(0).toUpperCase() + cleanTerm.slice(1)}`,
      shortDescription: `Commercial or architectural grade ${cleanTerm}. The layout below demonstrates how technical specifications, grade variations, and supplier observations will be formatted once real web research is active.`,
      primaryCategory: 'Physical Product Research',
      subCategory: 'Commercial Goods',
      materialType: 'Specified Material Composition',
      commonApplications: [
        `Standard deployment of ${cleanTerm} in commercial or residential contexts`,
        'Procurement benchmarking and bill-of-materials cost estimation',
        'Trade contractor specification and verification'
      ],
      specifications: [
        { id: 'g1', name: 'Classification', value: `${cleanTerm} Standard Item`, category: 'general', confidence: 'medium' },
        { id: 'g2', name: 'Commercial Grade', value: 'Standard Commercial Grade', category: 'grade', confidence: 'medium' },
        { id: 'g3', name: 'Procurement Scope', value: 'Single Unit to Trade Batch', category: 'general', confidence: 'medium' },
        { id: 'g4', name: 'Measurement Standard', value: 'Per Unit / Pack / Measure', category: 'dimension', confidence: 'medium' }
      ],
      knownBrandsOrManufacturers: ['Major Category Manufacturers', 'Certified Regional Suppliers'],
      variants: [
        { id: 'gv1', title: 'Standard Commercial Grade', distinguishingFeatures: ['Standard duty specification', 'Broad regional availability'], approximateRelativeCost: 'standard' },
        { id: 'gv2', title: 'Heavy-Duty / Industrial Spec', distinguishingFeatures: ['Reinforced performance rating', 'Specialist certifications'], approximateRelativeCost: 'higher' }
      ],
      standardUnitsOfMeasure: ['per unit', 'per pack', 'per standard measure']
    },
    pricingEstimate: {
      range: {
        min: 45.00,
        median: 78.50,
        max: 125.00,
        currency: 'USD',
        unit: 'per standard commercial unit'
      },
      confidenceRating: 'PRELIMINARY',
      sampleSize: 8,
      dataFreshness: 'Simulated Prototype Baseline',
      marketConditionNotes: `Preliminary benchmark based on prototypical market distribution for "${cleanTerm}". Exact figures depend on specific brand, volume, and location factors.`,
      priceSpreadPercent: 51,
      assumptions: [
        {
          id: 'ga1',
          statement: `Preliminary placeholder estimate for "${cleanTerm}" subject to exact model and dimensional grade verification.`,
          impactLevel: 'high',
          context: 'Adding exact dimensions, model numbers, or standards will yield tighter boundaries in future stages.'
        },
        {
          id: 'ga2',
          statement: 'Pricing excludes freight logistics, hazardous transport permits, and regional taxes.',
          impactLevel: 'medium',
          context: 'Delivery fees vary by weight, bulk volume, and destination.'
        }
      ],
      disclaimer: 'Prototype Demonstration Data: This price estimate is a synthetic structural fixture demonstrating the UI layout. Real web research and live quotes will activate in subsequent implementation stages.'
    },
    sources: [
      {
        id: 'src-gen-1',
        sourceName: 'Example Commercial Supply Partner',
        sourceDomain: 'example-commercialpartner.test',
        sourceUrl: 'https://example.com/demo-source-spec-1',
        pageTitle: `Commercial ${cleanTerm} Specification & Catalog Listing`,
        observedPrice: 72.50,
        currency: 'USD',
        unitOfMeasure: 'per unit',
        observationDate: '2026-10-01',
        sourceType: 'trade_supplier',
        extractedSnippet: `Standard commercial supply catalog listing for ${cleanTerm}. Verified specifications and trade quote available upon request. $72.50 prototype benchmark.`,
        specMatchScore: 0.91,
        isVerified: true
      },
      {
        id: 'src-gen-2',
        sourceName: 'Example Industrial Distributor',
        sourceDomain: 'example-industrialdistributor.test',
        sourceUrl: 'https://example.com/demo-source-spec-2',
        pageTitle: `${cleanTerm} Technical Data & Pricing Schedule`,
        observedPrice: 84.00,
        currency: 'USD',
        unitOfMeasure: 'per unit',
        observationDate: '2026-09-28',
        sourceType: 'distributor',
        extractedSnippet: `Technical documentation and pricing breakdown for ${cleanTerm}. Sample observation extracted for UI testing. $84.00 prototype benchmark.`,
        specMatchScore: 0.89,
        isVerified: true
      }
    ]
  };
}
