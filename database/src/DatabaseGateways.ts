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
  CommitId,
  EntityName,
  FolderId,
  ResourceLockId,
  UserName,
  defaultSortField,
  defaultSortOrder,
  saveLock,
} from 'entities';
import {
  resourceNotFoundError,
  invalidDecrementError,
  ok,
  err,
  crudEntityNames,
  noSnapshot,
} from 'gateways';
import { otType, diff } from 'ot';
import { toCollectionName } from './toCollectionName';
import { pageSize } from 'gateways/src/Gateways';
// import { embeddingMethods } from './embeddingMethods';

const debug = false;

// An in-database implementation for gateways,
// for use in production.
export const DatabaseGateways = ({
  shareDBConnection,
  mongoDBDatabase,
  redlock,
  // supabase,
}) => {
  // A function that locks a set or resources,
  // and then executes a function.
  // Uses RedLock to ensure that the lock is acquired.
  // This is important for data integrity if the server is scaled up.
  const lock = async <T>(
    lockIds: Array<ResourceLockId>,
    fn: () => Promise<T>,
  ) => {
    let returnValue: T | null = null;

    await redlock.using(lockIds, 10000, async () => {
      returnValue = await fn();
    });

    if (returnValue === null) {
      throw new Error(
        'Function did not return a value for locks ' +
          lockIds.join(', '),
      );
    }

    return returnValue;
  };

  // A generic "save" implementation for ShareDB.
  const shareDBSave =
    (entityName: EntityName, collectionName: string) =>
    async (entity) => {
      return lock(
        // We lock the entity here because we want to ensure that
        // the entity is not modified after we fetch it but before
        // we save it.
        [saveLock(entityName, entity.id)],
        () => {
          return new Promise((resolve) => {
            const shareDBDoc = shareDBConnection.get(
              collectionName,
              entity.id,
            );
            shareDBDoc.fetch((error) => {
              if (error) {
                return resolve(err(error));
              }

              const callback = (error) => {
                if (error) return resolve(err(error));
                resolve(ok('success'));
              };

              if (!shareDBDoc.type) {
                shareDBDoc.create(
                  entity,
                  otType.uri,
                  callback,
                );
              } else {
                shareDBDoc.submitOp(
                  diff(shareDBDoc.data, entity),
                  callback,
                );
              }
            });
          });
        },
      );
    };
  // A generic "get" implementation for ShareDB.
  const shareDBGet =
    (entityName: EntityName, collectionName: string) =>
    (id) =>
      new Promise((resolve) => {
        const shareDBDoc = shareDBConnection.get(
          collectionName,
          id,
        );
        shareDBDoc.fetch((error) => {
          if (error) {
            return resolve(err(error));
          }
          if (!shareDBDoc.type) {
            return resolve(
              err(resourceNotFoundError(id, entityName)),
            );
          }
          resolve(ok(shareDBDoc.toSnapshot()));
        });
      });

  // A generic "delete" implementation for ShareDB.
  const shareDBDelete =
    (entityName: EntityName, collectionName: string) =>
    (id) =>
      new Promise((resolve) => {
        const shareDBDoc = shareDBConnection.get(
          collectionName,
          id,
        );
        shareDBDoc.del((error) => {
          if (
            error &&
            error.code === 'ERR_DOC_DOES_NOT_EXIST'
          ) {
            return resolve(
              err(resourceNotFoundError(id, entityName)),
            );
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
  const shareDBAdd =
    (
      entityName: EntityName,
      collectionName: string,
      field: string,
      number: number,
    ) =>
    (id) =>
      new Promise((resolve) => {
        const shareDBDoc = shareDBConnection.get(
          collectionName,
          id,
        );
        shareDBDoc.fetch((error) => {
          if (error) return resolve(err(error));

          const callback = (error) => {
            if (error) return resolve(err(error));
            resolve(ok('success'));
          };

          if (!shareDBDoc.type) {
            return resolve(
              err(resourceNotFoundError(id, entityName)),
            );
          } else {
            if (
              number < 0 &&
              shareDBDoc.data[field] === 0
            ) {
              return resolve(
                err(invalidDecrementError(id, field)),
              );
            }
            // Leverage the `ena` operator,
            // which is an isolated addition of a number.
            // See https://github.com/ottypes/json1/blob/master/spec.md#parts-of-an-operation
            // Note that because this operation respects OT,
            // we do not need to use any lock.
            const op = [field, { ena: number }];
            shareDBDoc.submitOp(op, callback);
          }
        });
      });

  // A generic "save" implementation for MongoDB.
  const mongoDBSave = (collectionName) => {
    const collection =
      mongoDBDatabase.collection(collectionName);
    return async (entity) => {
      // Expose our id field as _id so MongoDB uses it as an id
      const doc = { ...entity, _id: entity.id };

      // See https://www.mongodb.com/docs/drivers/node/current/usage-examples/updateOne/
      await collection.updateOne(
        { _id: entity.id },
        { $set: doc },
        { upsert: true },
      );

      return ok('success');
    };
  };

  // A generic "get" implementation for MongoDB.
  const mongoDBGet = (
    entityName: EntityName,
    collectionName: string,
  ) => {
    const collection =
      mongoDBDatabase.collection(collectionName);
    return async (id) => {
      const entity = await collection.findOne({ _id: id });
      if (entity === null) {
        return err(resourceNotFoundError(id, entityName));
      }
      delete entity._id;
      return ok(entity);
    };
  };

  // A generic "delete" implementation for MongoDB.
  const mongoDBDelete = (
    entityName: EntityName,
    collectionName: string,
  ) => {
    const collection =
      mongoDBDatabase.collection(collectionName);
    return async (id) => {
      const results = await collection.deleteOne({
        _id: id,
      });
      if (results.deletedCount === 0) {
        return err(resourceNotFoundError(id, entityName));
      }
      return ok('success');
    };
  };

  const crud = (
    entityName: EntityName,
    collectionName: string,
    layer: 'sharedb' | 'mongodb',
  ) => ({
    [`save${entityName}`]:
      layer === 'sharedb'
        ? shareDBSave(entityName, collectionName)
        : mongoDBSave(collectionName),
    [`get${entityName}`]:
      layer === 'sharedb'
        ? shareDBGet(entityName, collectionName)
        : mongoDBGet(entityName, collectionName),
    [`delete${entityName}`]:
      layer === 'sharedb'
        ? shareDBDelete(entityName, collectionName)
        : mongoDBDelete(entityName, collectionName),
  });

  const getForks = (id) =>
    new Promise((resolve) => {
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
          resolve(
            ok(results.map((doc) => doc.toSnapshot())),
          );
        },
      );
    });

  const getInfos = ({
    owner,
    forkedFrom,
    sortField = defaultSortField,
    pageNumber = 0,
    sortOrder = defaultSortOrder,
    includeTrashed = false,
    visibilities = ['public'],
  }) =>
    new Promise((resolve) => {
      const entityName = 'Info';

      // Restrict search to given owner and/or forkedFrom.
      const mongoQuery = {
        ...(owner && { owner }),
        ...(forkedFrom && { forkedFrom }),
        trashed: { $exists: includeTrashed },
        $limit: pageSize,
        $skip: pageNumber * pageSize,
        $sort: {
          [sortField]: sortOrder === 'ascending' ? 1 : -1,
        },
        visibility: { $in: visibilities },
      };

      // // If this viz is currently in the "trash",
      // // this field represents when it was put there.
      // // If this viz is not in the "trash",
      // // this field is undefined.
      // trashed?: Timestamp;
      // if (includeTrashed) {
      //   // Match all documents where trashed is defined.
      //   mongoQuery.trashed = { $exists: true };
      // } else {
      //   // Match all documents where trashed is undefined.
      //   mongoQuery.trashed = { $exists: false };
      // }

      // TODO add test for basic access control - exclude non-public infos
      // mongoQuery['visibility'] = 'public';

      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        mongoQuery,
        {},
        (error, results) => {
          query.destroy();
          if (error) return resolve(err(error));
          resolve(
            ok(results.map((doc) => doc.toSnapshot())),
          );
        },
      );
    });

  const getCommitAncestors = async (
    id: string,
    toNearestMilestone: boolean,
    start: CommitId,
  ) => {
    const entityName: EntityName = 'Commit';
    const from = toCollectionName(entityName);
    const collection = mongoDBDatabase.collection(from);

    const $graphLookup = {
      from,
      startWith: '$parent',
      connectFromField: 'parent',
      connectToField: '_id',
      as: 'ancestors',
      depthField: 'order',
      restrictSearchWithMatch: {},
    };

    // If we want to get the ancestors up to the nearest milestone,
    // we need to restrict the search to only those commits that
    // do not have a milestone.
    // Note that the results DO NOT include the commit with the milestone.
    if (toNearestMilestone) {
      // @ts-ignore
      $graphLookup.restrictSearchWithMatch.milestone = {
        $eq: null,
      };
    }

    // TODO thoroughly test this. It may be buggy.
    if (start) {
      // @ts-ignore
      $graphLookup.restrictSearchWithMatch._id = start;
    }

    const results = await (
      await collection.aggregate([
        { $match: { _id: id } },
        { $graphLookup },
      ])
    ).toArray();

    if (results.length === 0) {
      return err(resourceNotFoundError(id, entityName));
    }

    // Sanity check.
    if (results.length > 1) {
      throw new Error(
        'Results.length should be exactly 1.',
      );
    }

    const [result] = results;
    // Mongo does not guarantee any ordering, so we need to
    // sort on the order here to ensure lineage ordering.
    // This is the order in which the commits must be "replayed".
    //
    // Note: Sorting by timestamp does not work, because they are not granular enough.
    // If two commits happen during the same second, the correct ordering
    // cannot be determined by timestamps alone.
    let ancestors = result.ancestors.sort((a, b) =>
      descending(a.order, b.order),
    );
    // Derive the final result as an array of pure Commit objects,
    // including the one that matches commitId.
    delete result.ancestors;
    for (const commit of ancestors) {
      delete commit.order;
    }
    ancestors.push(result);

    if (debug) {
      console.log(
        '[DatabaseGateways/getCommitAncestors] ancestors before',
      );
      console.log(JSON.stringify(ancestors, null, 2));
    }

    if (toNearestMilestone) {
      // Handle the case that the commit we searched from itself has a milestone.
      const mostRecentCommit =
        ancestors[ancestors.length - 1];
      if (mostRecentCommit.milestone) {
        // In this case, we only need to return the most recent commit.
        // The other commits are not needed, as they only connect this milestone
        // to the previous milestone.
        // TODO consider optimizing this case? We could do a find({ _id: id }) before
        // we attempt the aggregate step and check if the commit has a milestone.
        ancestors = [mostRecentCommit];
      } else {
        // Note that the results DO NOT include the commit with the milestone.
        // For that we may need to perform an additional query.
        // we only need to perform this additional query if the last returned commit
        // has a parent. If it doesn't, then there are no milestones in the DB.
        const firstCommitWithoutMilestone = ancestors[0];
        if (firstCommitWithoutMilestone.parent) {
          const commitWithMilestone =
            await collection.findOne({
              _id: firstCommitWithoutMilestone.parent,
            });
          if (commitWithMilestone === null) {
            return err(
              resourceNotFoundError(
                firstCommitWithoutMilestone.parent,
                entityName,
              ),
            );
          }
          ancestors.unshift(commitWithMilestone);
        }
      }
    }

    if (debug) {
      console.log(
        '[DatabaseGateways/getCommitAncestors] ancestors after',
      );
      console.log(JSON.stringify(ancestors, null, 2));
    }

    // Remove Mongo's internal id.
    for (const commit of ancestors) {
      delete commit._id;
    }

    return ok(ancestors);
  };

  // TODO consider making this a ShareDB query.
  // Use case: breadcrumbs that change in real time
  //   when a viz/folder is moved.
  const getFolderAncestors = async (id: FolderId) => {
    const entityName: EntityName = 'Folder';
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
      await collection.aggregate([
        { $match: { _id: id } },
        { $graphLookup },
      ])
    ).toArray();

    if (results.length === 0) {
      return err(resourceNotFoundError(id, entityName));
    }

    // Sanity check.
    if (results.length > 1) {
      throw new Error(
        'Results.length should be exactly 1.',
      );
    }

    const [result] = results;
    const ancestors = result.ancestors.sort((a, b) =>
      descending(a.order, b.order),
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
      }),
    );

    return ok(folders);
  };

  const getUserByUserName = (userName: UserName) =>
    new Promise((resolve) => {
      const entityName = 'User';
      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        { userName },
        {},
        (error, results) => {
          query.destroy();
          if (error) return resolve(err(error));
          if (results.length === 0) {
            return resolve(
              err(resourceNotFoundError(userName, 'User')),
            );
          }
          resolve(ok(results[0].toSnapshot()));
        },
      );
    });

  const getUserByEmails = (emails) =>
    new Promise((resolve) => {
      const entityName = 'User';
      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        {
          $or: [
            { primaryEmail: { $in: emails } },
            {
              secondaryEmails: {
                $elemMatch: { $in: emails },
              },
            },
          ],
        },
        {},
        (error, results) => {
          query.destroy();
          if (error) return resolve(err(error));
          if (results.length === 0) {
            return resolve(
              err(resourceNotFoundError(emails, 'User')),
            );
          }
          resolve(ok(results[0].toSnapshot()));
        },
      );
    });

  const getUsersByIds = (ids) =>
    new Promise((resolve) => {
      const entityName = 'User';
      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        { _id: { $in: ids } },
        {},
        (error, results) => {
          query.destroy();
          if (error) return resolve(err(error));

          // Guard against the case that some of the ids were not found.
          if (results.length !== ids.length) {
            resolve(
              err(
                resourceNotFoundError(
                  ids.join(', '),
                  'User',
                ),
              ),
            );
          }

          resolve(
            ok(results.map((doc) => doc.toSnapshot())),
          );
        },
      );
    });

  const getPermissions = (user, resources) =>
    new Promise((resolve) => {
      const entityName = 'Permission';
      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        {
          $and: [
            { user },
            { resource: { $in: resources } },
          ],
        },
        {},
        (error, results) => {
          query.destroy();
          if (error) return resolve(err(error));
          resolve(
            ok(results.map((doc) => doc.toSnapshot())),
          );
        },
      );
    });

  const from = toCollectionName('Info');
  const incrementForksCount = shareDBAdd(
    'Info',
    from,
    'forksCount',
    1,
  );
  const decrementForksCount = shareDBAdd(
    'Info',
    from,
    'forksCount',
    -1,
  );
  const incrementUpvotesCount = shareDBAdd(
    'Info',
    from,
    'upvotesCount',
    1,
  );
  const decrementUpvotesCount = shareDBAdd(
    'Info',
    from,
    'upvotesCount',
    -1,
  );

  let databaseGateways = {
    type: 'DatabaseGateways',
    getForks,
    getInfos,
    incrementForksCount,
    decrementForksCount,
    incrementUpvotesCount,
    decrementUpvotesCount,
    getCommitAncestors,
    getFolderAncestors,
    getUserByUserName,
    getUserByEmails,
    getUsersByIds,
    getPermissions,
    lock,
  };

  for (const entityName of crudEntityNames) {
    databaseGateways = {
      ...databaseGateways,
      ...crud(
        entityName,
        toCollectionName(entityName),
        noSnapshot[entityName] ? 'mongodb' : 'sharedb',
      ),
    };
  }

  // // console.log('supabase defined?', supabase);
  // databaseGateways = {
  //   ...databaseGateways,
  //   // ...embeddingMethods(supabase),
  // };

  return databaseGateways;
};
