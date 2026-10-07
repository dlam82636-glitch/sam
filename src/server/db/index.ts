/**
 * PRICERA Database Module Entrypoint
 */

import { DatabaseRepositoryInterface, InMemoryRelationalRepository } from './databaseRepository';

let repositoryInstance: DatabaseRepositoryInterface | null = null;

/**
 * Accesses the singleton database repository.
 * If DATABASE_URL is configured in future stages or real database provisioning is provided,
 * the driver connects to PostgreSQL / Cloud SQL; otherwise, it operates with strict in-memory relational semantics.
 */
export function getDatabaseRepository(): DatabaseRepositoryInterface {
  if (!repositoryInstance) {
    repositoryInstance = new InMemoryRelationalRepository();
  }
  return repositoryInstance;
}

/**
 * For testing: resets or overrides the active repository instance.
 */
export function setDatabaseRepositoryForTesting(repo: DatabaseRepositoryInterface | null): void {
  repositoryInstance = repo;
}

export * from './schema';
export * from './databaseRepository';
