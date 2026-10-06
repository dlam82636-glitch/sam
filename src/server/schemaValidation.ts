/**
 * Runtime Schema Validator for AI Query-Understanding Output
 *
 * Validates untrusted AI responses against the required QueryUnderstandingResult contract.
 * Rejects or safely normalizes malformed structures before passing data downstream.
 */

import { QueryUnderstandingResult } from '@/src/types/queryUnderstanding';

export interface SchemaValidationResult {
  isValid: boolean;
  data?: QueryUnderstandingResult;
  errors: string[];
}

export function validateQueryUnderstandingSchema(raw: unknown): SchemaValidationResult {
  const errors: string[] = [];

  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      isValid: false,
      errors: ['AI response root must be a non-null object.'],
    };
  }

  const obj = raw as Record<string, unknown>;

  // 1. Validate "name" (required string)
  let name = '';
  if (typeof obj.name !== 'string' || obj.name.trim().length === 0) {
    errors.push('Field "name" must be a non-empty string.');
  } else {
    name = obj.name.trim();
  }

  // 2. Validate "category" (required string)
  let category = '';
  if (typeof obj.category !== 'string' || obj.category.trim().length === 0) {
    errors.push('Field "category" must be a non-empty string.');
  } else {
    category = obj.category.trim();
  }

  // 3. Validate "description" (required string)
  let description = '';
  if (typeof obj.description !== 'string' || obj.description.trim().length === 0) {
    errors.push('Field "description" must be a non-empty string.');
  } else {
    description = obj.description.trim();
  }

  // 4. Validate "brand" (nullable string)
  let brand: string | null = null;
  if (obj.brand !== undefined && obj.brand !== null) {
    if (typeof obj.brand === 'string') {
      brand = obj.brand.trim() || null;
    } else {
      errors.push('Field "brand" must be a string or null.');
    }
  }

  // 5. Validate "model" (nullable string)
  let model: string | null = null;
  if (obj.model !== undefined && obj.model !== null) {
    if (typeof obj.model === 'string') {
      model = obj.model.trim() || null;
    } else {
      errors.push('Field "model" must be a string or null.');
    }
  }

  // 6. Validate "material" (nullable string)
  let material: string | null = null;
  if (obj.material !== undefined && obj.material !== null) {
    if (typeof obj.material === 'string') {
      material = obj.material.trim() || null;
    } else {
      errors.push('Field "material" must be a string or null.');
    }
  }

  // 7. Validate "specifications" (array of strings, or object convertible to string items)
  const specifications: string[] = [];
  if (Array.isArray(obj.specifications)) {
    for (let i = 0; i < obj.specifications.length; i++) {
      const item = obj.specifications[i];
      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (trimmed.length > 0) specifications.push(trimmed);
      } else if (item && typeof item === 'object') {
        // e.g. { name: "Thickness", value: "12mm" }
        const itemObj = item as Record<string, unknown>;
        const parts = Object.entries(itemObj).map(([k, v]) => `${k}: ${v}`);
        if (parts.length > 0) specifications.push(parts.join(' - '));
      }
    }
  } else if (obj.specifications && typeof obj.specifications === 'object') {
    // If returned as key-value map e.g. { "Thickness": "12mm", "Material": "Steel" }
    for (const [key, val] of Object.entries(obj.specifications as Record<string, unknown>)) {
      if (val !== undefined && val !== null) {
        specifications.push(`${key}: ${val}`);
      }
    }
  } else {
    errors.push('Field "specifications" must be an array of strings or a specifications map.');
  }

  // 8. Validate "possible_variants" (array of strings)
  const possible_variants: string[] = [];
  if (!Array.isArray(obj.possible_variants)) {
    errors.push('Field "possible_variants" must be an array of strings.');
  } else {
    for (let i = 0; i < obj.possible_variants.length; i++) {
      const item = obj.possible_variants[i];
      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (trimmed.length > 0) possible_variants.push(trimmed);
      } else {
        errors.push(`Possible variant item at index ${i} must be a string.`);
      }
    }
  }

  // 9. Validate "search_queries" (array of strings, minimum 1)
  const search_queries: string[] = [];
  if (!Array.isArray(obj.search_queries)) {
    errors.push('Field "search_queries" must be an array of strings.');
  } else {
    for (let i = 0; i < obj.search_queries.length; i++) {
      const item = obj.search_queries[i];
      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (trimmed.length > 0) search_queries.push(trimmed);
      } else {
        errors.push(`Search query item at index ${i} must be a string.`);
      }
    }
    if (search_queries.length === 0) {
      errors.push('Field "search_queries" must contain at least one valid search query string.');
    }
  }

  // 10. Validate "confidence" (number between 0 and 1)
  let confidence = 0.5;
  if (typeof obj.confidence !== 'number' || isNaN(obj.confidence)) {
    errors.push('Field "confidence" must be a valid number.');
  } else {
    // If model returned percentage like 85 or 95, normalize to 0.85
    let c = obj.confidence;
    if (c > 1 && c <= 100) {
      c = c / 100;
    }
    // Clamp to 0..1
    confidence = Math.max(0, Math.min(1, Math.round(c * 100) / 100));
  }

  // 11. Validate "uncertainties" (array of strings)
  const uncertainties: string[] = [];
  if (!Array.isArray(obj.uncertainties)) {
    errors.push('Field "uncertainties" must be an array of strings.');
  } else {
    for (let i = 0; i < obj.uncertainties.length; i++) {
      const item = obj.uncertainties[i];
      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (trimmed.length > 0) uncertainties.push(trimmed);
      } else {
        errors.push(`Uncertainty item at index ${i} must be a string.`);
      }
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
    };
  }

  return {
    isValid: true,
    data: {
      name,
      category,
      description,
      brand,
      model,
      material,
      specifications,
      possible_variants,
      search_queries,
      confidence,
      uncertainties,
    },
    errors: [],
  };
}
