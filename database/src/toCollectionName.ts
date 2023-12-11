// Converts and entity name to a MongoDB or ShareDB collection name.
import { EntityName } from 'entities';

// Generates the MongoDB collecton names for each entity.
export const toCollectionName = (entityName: EntityName) =>
  // TODO maybe adopt ts-string to type this transformation
  entityName.toLowerCase();
