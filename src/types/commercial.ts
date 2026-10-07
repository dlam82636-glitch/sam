/**
 * Commercial Offer & Buy Link Types (Part 2)
 *
 * Models authentic merchant offers, listing URLs, fallback retailer searches,
 * confidence tiers, seller trust, and market match ratings.
 */

export type MatchConfidence = 'EXACT' | 'VARIANT_MATCH' | 'SIMILAR' | 'CATEGORY_FALLBACK';

export type CommercialSellerType =
  | 'RETAILER'
  | 'MARKETPLACE'
  | 'DISTRIBUTOR'
  | 'OFFICIAL_STORE'
  | 'COMMERCIAL_LISTING';

export interface CommercialOffer {
  id: string;
  seller: string;
  sellerDomain: string;
  sellerType: CommercialSellerType;
  title: string;
  price: number | null;
  currency: string | null;
  availability: string | null;
  
  // Link Architecture
  directUrl: string;
  isDirectListing: boolean; // true if this points to a specific product listing page
  fallbackSearchUrl?: string; // fallback search URL on merchant domain
  
  // Matching & Confidence
  matchConfidence: MatchConfidence;
  matchScore: number; // 0 to 1
  isNigerianMerchant: boolean;
  isOfficialOrVerified: boolean;
  
  // Additional context
  location?: string | null;
  specificationsSummary?: string[];
  lastObservedAt: string;
}

export interface BuyOpportunitiesSummary {
  offers: CommercialOffer[];
  totalOffers: number;
  exactListingsCount: number;
  topRecommendation: CommercialOffer | null;
  primaryMarket: 'NGN' | 'GLOBAL';
}
