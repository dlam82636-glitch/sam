/**
 * Research API Client Coordinator
 *
 * Provides a clean interface for executing product and material research requests.
 * In this foundation stage (Prompts 1 & 2):
 * - Simulates the multi-step intelligence pipeline progression.
 * - In Stage 3, the internal implementation will be switched to a real POST /api/research
 *   backend call without modifying consuming React components.
 */

import { validateProductQuery } from '@/src/lib/validation';
import { DEMO_DATASETS, generateGenericDemoResult } from '@/src/mocks/demonstrationData';
import { ResearchPipelineResult, PipelineStage } from '@/src/types';

export interface ResearchRequestOptions {
  onStageChange?: (stage: PipelineStage, message: string) => void;
  simulateFailure?: boolean;
}

export async function executeResearchQuery(
  rawQuery: string,
  options?: ResearchRequestOptions
): Promise<ResearchPipelineResult> {
  const { onStageChange, simulateFailure = false } = options || {};

  // Step 1: Client Validation
  onStageChange?.('validating', 'Validating input query and sanitizing characters...');
  await delay(250);

  const validation = validateProductQuery(rawQuery);
  if (!validation.isValid) {
    throw new Error(validation.errorMessage || 'Invalid search query.');
  }

  // Artificial error simulation for UI verification
  if (simulateFailure) {
    await delay(300);
    throw new Error('Simulation Error: Unable to contact market research index. Please verify your connection.');
  }

  // Step 2: AI Query Understanding Simulation
  onStageChange?.('understanding', 'Parsing query intent, dimensional specs, and product category...');
  await delay(350);

  // Step 3: Web Research Query Generation & Retrieval Simulation
  onStageChange?.('searching', 'Dispatching targeted supplier queries across distributor catalogs...');
  await delay(450);

  // Step 4: Normalization & Specification Extraction Simulation
  onStageChange?.('extracting', 'Extracting technical specifications and verifying source domains...');
  await delay(300);

  // Step 5: Pricing Intelligence Calculation Simulation
  onStageChange?.('calculating', 'Calculating median market estimates, confidence bounds, and assumptions...');
  await delay(250);

  // Resolution: Find in demo dataset or generate generic demo layout
  const normalizedKey = validation.sanitizedQuery.toLowerCase();
  const matchedKey = Object.keys(DEMO_DATASETS).find(
    (k) => k === normalizedKey || normalizedKey.includes(k) || k.includes(normalizedKey)
  );

  const result = matchedKey
    ? DEMO_DATASETS[matchedKey]
    : generateGenericDemoResult(validation.sanitizedQuery);

  onStageChange?.('completed', 'Research intelligence synthesis complete.');
  return result;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
