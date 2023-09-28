export interface MigrationStatus {
  currentBatchNumber: number;
}

export interface MigrationBatch {
  batchNumber: number;
  migratedEntities: Array<{
    entityName: string;
    entityId: string;
  }>;
}
