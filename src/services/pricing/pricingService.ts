/**
 * Pricing Intelligence Service Abstraction Layer
 * Defines statistical algorithms, unit normalization, outlier rejection, and confidence calculation.
 *
 * NOTE: Real implementation scheduled for future development stages.
 */

import { PhysicalProduct, SourceObservation, PriceEstimate } from '@/src/types';

export interface PricingServiceInterface {
  /**
   * Calculates market price bounds, median, spread, and confidence score based on verified observations.
   */
  calculatePricing(
    product: PhysicalProduct, 
    observations: SourceObservation[]
  ): Promise<PriceEstimate>;
}

/**
 * Service placeholder ensuring compile-time adherence and readiness for Stage 3 integration.
 */
export class PricingServicePlaceholder implements PricingServiceInterface {
  async calculatePricing(
    _product: PhysicalProduct, 
    _observations: SourceObservation[]
  ): Promise<PriceEstimate> {
    throw new Error('PricingService.calculatePricing: Real calculation engine not yet activated. Scheduled for future stage.');
  }
}
