// MigrationStatusId
//  * Unique identifier string for a migration.
//  * There are only two migrations: 'v2' and 'bl.ocks'.
export type MigrationStatusId = 'v2' | 'bl.ocks';

export interface MigrationStatus {
  id: MigrationStatusId;
  currentBatchNumber: number;
  // Whether or not this batch was completed successfully.
  // If false, the batch will be retried.
  currentBatchCompleted?: boolean;
}
// MigrationBatchId
//  * Unique identifier string for a migration batch.
//  * The first batch is '1', the second is '2', etc.
//  * This is a concatenation of the migration status ID
//    and the batch number, e.g. 'v2-1' or 'bl.ocks-2'.
export type MigrationBatchId = string;

export interface MigrationBatch {
  id: MigrationBatchId;
  numVizzesProcessed: number;
  numVizzesMissed: number;
  // migratedEntities: Array<{
  //   entityName: string;
  //   entityId: string;
  // }>;
}

// We might need these at some point...
// export const getMigrationBatchId = (
//   migrationStatusId: MigrationStatusId,
//   batchNumber: number,
// ): MigrationBatchId =>
//   `${migrationStatusId}-${batchNumber}`;

// export const getMigrationStatusId = (
//   migrationBatchId: MigrationBatchId,
// ): MigrationStatusId =>
//   migrationBatchId.split('-')[0] as MigrationStatusId;
