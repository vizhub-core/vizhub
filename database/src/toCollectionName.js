// Converts and entity name to a MongoDB or ShareDB collection name.
// Example entity names: "AnalyticsEvent", "Folder", "Info" (same as type).
export const toCollectionName = (entityName) => entityName.toLowerCase() + 's';
