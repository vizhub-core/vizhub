// This package defines an implementation of the "gateways" of VizHub
// backed by a real database. See also gateways/MemoryGateways
//
// See also
// https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/src/DatabaseGateways.ts
// https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/initGateways.ts
// https://github.com/vizhub-core/vizhub/blob/main/prototypes/open-core-first-attempt/packages/vizhub-core/src/server/index.js
// https://gitlab.com/curran/vizhub-ee/-/blob/main/prototypes/commitDataModelV1/src/gateways/DatabaseGateways.js
import { descending } from 'd3-array';
import {
  resourceNotFoundError,
  invalidDecrementError,
  ok,
  err,
  crudEntityNames,
  noSnapshot,
  otType,
  diff,
} from 'gateways';

// Converts and entity name to a MongoDB collection name
const toCollectionName = (entityName) => entityName.toLowerCase() + 's';

// An in-database implementation for gateways,
// for use in production.
export const DatabaseGateways = ({ shareDBConnection, mongoDBDatabase }) => {
  // A generic "save" implementation for ShareDB.
  const shareDBSave = (collectionName) => (entity) =>
    new Promise((resolve) => {
      const shareDBDoc = shareDBConnection.get(collectionName, entity.id);
      shareDBDoc.fetch((error) => {
        if (error) return resolve(err(error));

        const callback = (error) => {
          if (error) return resolve(err(error));
          resolve(ok('success'));
        };

        if (!shareDBDoc.type) {
          shareDBDoc.create(entity, otType.uri, callback);
        } else {
          shareDBDoc.submitOp(diff(shareDBDoc.data, entity), callback);
        }
      });
    });

  // A generic "get" implementation for ShareDB.
  const shareDBGet = (collectionName) => (id) =>
    new Promise((resolve) => {
      const shareDBDoc = shareDBConnection.get(collectionName, id);
      shareDBDoc.fetch((error) => {
        if (error) return resolve(err(error));
        if (!shareDBDoc.type) return resolve(err(resourceNotFoundError(id)));
        resolve(ok(shareDBDoc.toSnapshot()));
      });
    });

  // A generic "delete" implementation for ShareDB.
  const shareDBDelete = (collectionName) => (id) =>
    new Promise((resolve) => {
      const shareDBDoc = shareDBConnection.get(collectionName, id);
      shareDBDoc.del((error) => {
        if (error && error.code === 'ERR_DOC_DOES_NOT_EXIST') {
          return resolve(err(resourceNotFoundError(id)));
        }
        if (error) return resolve(err(error));
        resolve(ok('success'));
      });
    });

  // A generic "add" implementation for ShareDB,
  // for incrementing and decrementing numeric fields.
  //  * `id` - the id of the document
  //  * `field` - the field to add to
  //  * `number` - the number to add to the field value
  const shareDBAdd = (collectionName, field, number) => (id) =>
    new Promise((resolve) => {
      const shareDBDoc = shareDBConnection.get(collectionName, id);
      shareDBDoc.fetch((error) => {
        if (error) return resolve(err(error));

        const callback = (error) => {
          if (error) return resolve(err(error));
          resolve(ok('success'));
        };

        if (!shareDBDoc.type) {
          return resolve(err(resourceNotFoundError(id)));
        } else {
          if (number < 0 && shareDBDoc.data[field] === 0) {
            return resolve(err(invalidDecrementError(id, field)));
          }
          // Leverage the `ena` operator,
          // which is an isolated addition of a number.
          // See https://github.com/ottypes/json1/blob/master/spec.md#parts-of-an-operation
          const op = [field, { ena: number }];
          shareDBDoc.submitOp(op, callback);
        }
      });
    });

  // A generic "save" implementation for MongoDB.
  const mongoDBSave = (collectionName) => {
    const collection = mongoDBDatabase.collection(collectionName);
    return async (entity) => {
      // Expose our id field as _id so MongoDB uses it as an id
      const doc = { ...entity, _id: entity.id };

      // See https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/
      await collection.updateOne(
        { _id: entity.id },
        { $set: doc },
        { upsert: true }
      );

      return ok('success');
    };
  };

  // A generic "get" implementation for MongoDB.
  const mongoDBGet = (collectionName) => {
    const collection = mongoDBDatabase.collection(collectionName);
    return async (id) => {
      const entity = await collection.findOne({ _id: id });
      if (entity === null) {
        return err(resourceNotFoundError(id));
      }
      delete entity._id;
      return ok(entity);
    };
  };

  // A generic "delete" implementation for MongoDB.
  const mongoDBDelete = (collectionName) => {
    const collection = mongoDBDatabase.collection(collectionName);
    return async (id) => {
      const results = await collection.deleteOne({ _id: id });
      if (results.deletedCount === 0) {
        return err(resourceNotFoundError(id));
      }
      return ok('success');
    };
  };

  const crud = (entityName, collectionName, layer) => ({
    [`save${entityName}`]:
      layer === 'sharedb'
        ? shareDBSave(collectionName)
        : mongoDBSave(collectionName),
    [`get${entityName}`]:
      layer === 'sharedb'
        ? shareDBGet(collectionName)
        : mongoDBGet(collectionName),
    [`delete${entityName}`]:
      layer === 'sharedb'
        ? shareDBDelete(collectionName)
        : mongoDBDelete(collectionName),
  });

  const getForks = (id) =>
    new Promise((resolve, reject) => {
      const entityName = 'Info';
      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        { forkedFrom: id },
        {},
        (error, results) => {
          // Avoid memory leak.
          // See https://github.com/share/sharedb/blob/4067b0c5d194a1e4078d52dadd668492dafe017b/lib/client/connection.js#L541
          query.destroy();

          if (error) return resolve(err(error));
          resolve(ok(results.map((doc) => doc.toSnapshot())));
        }
      );
    });

  const getCommitAncestors = async (id, toNearestMilestone, start) => {
    const entityName = 'Commit';
    const from = toCollectionName(entityName);
    const collection = mongoDBDatabase.collection(from);

    const $graphLookup = {
      from,
      startWith: '$parent',
      connectFromField: 'parent',
      connectToField: '_id',
      as: 'ancestors',
      depthField: 'order',
      restrictSearchWithMatch: toNearestMilestone
        ? { milestone: { $ne: null } }
        : {},
    };

    if (toNearestMilestone) {
      $graphLookup.restrictSearchWithMatch = { milestone: { $ne: null } };
    }

    if (start) {
      $graphLookup.restrictSearchWithMatch = { _id: start };
    }

    const results = await (
      await collection.aggregate([{ $match: { _id: id } }, { $graphLookup }])
    ).toArray();

    if (results.length === 0) {
      return err(resourceNotFoundError(id));
    }

    // Sanity check.
    if (results.length > 1) {
      throw new Error('Results.length should be exactly 1.');
    }

    const [result] = results;
    // Mongo does not guarantee any ordering, so we need to
    // sort on the order here to ensure lineage ordering.
    // This is the order in which the commits must be "replayed".
    //
    // Note: Sorting by timestamp does not work, because they are not granular enough.
    // If two commits happen during the same second, the correct ordering
    // cannot be determined by timestamps alone.
    const ancestors = result.ancestors.sort((a, b) =>
      descending(a.order, b.order)
    );
    // Derive the final result as an array of pure Commit objects,
    // including the one that matches commitId.
    delete result.ancestors;
    for (const commit of ancestors) {
      delete commit.order;
    }
    ancestors.push(result);

    // Remove Mongo's internal id.
    for (const commit of ancestors) {
      delete commit._id;
    }

    return ok(ancestors);
  };

  const getFolderAncestors = async (id) => {
    const entityName = 'Folder';
    const from = toCollectionName(entityName);
    const collection = mongoDBDatabase.collection(from);

    const $graphLookup = {
      from,
      startWith: '$parent',
      connectFromField: 'parent',
      connectToField: '_id',
      as: 'ancestors',
      depthField: 'order',
    };

    const results = await (
      await collection.aggregate([{ $match: { _id: id } }, { $graphLookup }])
    ).toArray();

    if (results.length === 0) {
      return err(resourceNotFoundError(id));
    }

    // Sanity check.
    if (results.length > 1) {
      throw new Error('Results.length should be exactly 1.');
    }

    const [result] = results;
    const ancestors = result.ancestors.sort((a, b) =>
      descending(a.order, b.order)
    );
    ancestors.push(result);

    // Remove any unwanted fields and guard against mutability bugs
    // by making a shallow copy of each folder.
    // See entities/Folders for a list of fields.

    const folders = ancestors.map(
      ({ id, name, parent, owner, visibility }) => ({
        id,
        name,
        parent,
        owner,
        visibility,
      })
    );

    return ok(folders);
  };

  const getUserByEmails = (emails) =>
    new Promise((resolve, reject) => {
      const entityName = 'User';
      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        {
          $or: [
            { primaryEmail: { $in: emails } },
            { secondaryEmails: { $elemMatch: { $in: emails } } },
          ],
        },
        {},
        (error, results) => {
          query.destroy();
          if (error) return resolve(err(error));
          if (results.length === 0) {
            return resolve(err(resourceNotFoundError(emails)));
          }
          resolve(ok(results[0].toSnapshot()));
        }
      );
    });

  const from = toCollectionName('Info');
  const incrementForksCount = shareDBAdd(from, 'forksCount', 1);
  const decrementForksCount = shareDBAdd(from, 'forksCount', -1);
  const incrementUpvotesCount = shareDBAdd(from, 'upvotesCount', 1);
  const decrementUpvotesCount = shareDBAdd(from, 'upvotesCount', -1);

  let databaseGateways = {
    getForks,
    incrementForksCount,
    decrementForksCount,
    incrementUpvotesCount,
    decrementUpvotesCount,
    getCommitAncestors,
    getFolderAncestors,
    getUserByEmails,
  };

  for (const entityName of crudEntityNames) {
    databaseGateways = {
      ...databaseGateways,
      ...crud(
        entityName,
        toCollectionName(entityName),
        noSnapshot[entityName] ? 'mongodb' : 'sharedb'
      ),
    };
  }

  return databaseGateways;
};
