/**
 * Product & Specification Type Definitions
 * Represents the normalized physical product or material extracted from research.
 */

export interface SpecificationItem {
  id: string;
  name: string;
  value: string;
  unit?: string;
  category?: 'dimension' | 'material' | 'grade' | 'performance' | 'standard' | 'general';
  confidence?: 'high' | 'medium' | 'low';
}

export interface ProductVariant {
  id: string;
  title: string;
  distinguishingFeatures: string[];
  approximateRelativeCost?: 'lower' | 'standard' | 'higher';
}

export interface PhysicalProduct {
  id: string;
  canonicalName: string;
  shortDescription: string;
  primaryCategory: string;
  subCategory?: string;
  materialType?: string;
  commonApplications?: string[];
  specifications: SpecificationItem[];
  knownBrandsOrManufacturers?: string[];
  variants?: ProductVariant[];
  standardUnitsOfMeasure: string[]; // e.g. ["per sheet (4x8ft)", "per m2", "per unit"]
}
