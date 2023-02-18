// Count of V2 vizzes in the dataset.
// Used for reporting progress in terms of percentage.
export const vizCount = async (v2MongoDBDatabase) => {
  const infoCollection = v2MongoDBDatabase.collection('documentInfo');
  return await infoCollection.count();
};
