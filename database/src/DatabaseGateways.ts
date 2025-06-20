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
  APIKeyHash,
  CommitId,
  EntityName,
  FolderId,
  ResourceId,
  ResourceLockId,
  User,
  UserId,
  UserName,
  dateToTimestamp,
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
  VizHubError,
} from 'gateways';
import { otType, diff } from 'ot';
import { toCollectionName } from './toCollectionName';
import { pageSize as defaultPageSize } from 'gateways/src/Gateways';
import { ShareDBDoc } from 'vzcode';
import { CommitImageKey } from 'entities/src/Images';
import { VizId } from '@vizhub/viz-types';
// import { embeddingMethods } from './embeddingMethods';

const debug = false;

// An in-database implementation for gateways,
// for use in production.
export const DatabaseGateways = ({
  shareDBConnection,
  mongoDBDatabase,
  // redlock,
  // supabase,
}) => {
  // A function that locks a set or resources,
  // and then executes a function.
  // Uses RedLock to ensure that the lock is acquired.
  // This is important for data integrity if the server is scaled up.
  const lock = async <T>(
    lockIds: Array<ResourceLockId>,
    fn: () => Promise<T>,
    duration = 20000,
  ) => {
    let returnValue: T | null = null;

    // await redlock.using(lockIds, duration, async () => {
    //   returnValue = await fn();
    // });

    returnValue = await fn();

    // if (returnValue === null) {
    //   throw new Error(
    //     'Function did not return a value for locks ' +
    //       lockIds.join(', '),
    //   );
    // }

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
                return resolve(
                  err(
                    new VizHubError(
                      error.message,
                      error.code,
                    ),
                  ),
                );
              }

              const callback = (error) => {
                if (error) {
                  return resolve(
                    err(
                      new VizHubError(
                        error.message,
                        error.code,
                      ),
                    ),
                  );
                }
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
    vizIds,
    disablePagination = false,
    query,
    pageSize = defaultPageSize,
  }: {
    owner?: UserId;
    forkedFrom?: ResourceId;
    sortField?: string;
    pageNumber?: number;
    sortOrder?: string;
    includeTrashed?: boolean;
    visibilities?: Array<string>;
    vizIds?: Array<VizId>;
    disablePagination?: boolean;
    query?: string;
    pageSize?: number;
  }) =>
    new Promise((resolve) => {
      const entityName = 'Info';

      // Restrict search to given owner and/or forkedFrom.
      const mongoQuery = {
        ...(owner && { owner }),
        ...(forkedFrom && { forkedFrom }),
        trashed: { $exists: includeTrashed },
        ...(!disablePagination && {
          $limit: pageSize,
          $skip: pageNumber * pageSize,
        }),
        $sort: {
          [sortField]: sortOrder === 'ascending' ? 1 : -1,
        },
        ...(visibilities && {
          visibility: { $in: visibilities },
        }),
        ...(vizIds && { id: { $in: vizIds } }),
        ...(query && {
          // Index required for this to work:
          // db.info.createIndex( { title: "text"})
          $text: { $search: query },
        }),
      };

      // console.log(
      //   'mongoQuery',
      //   JSON.stringify(mongoQuery, null, 2),
      // );

      const fetchQuery = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        mongoQuery,
        {},
        (error, results) => {
          fetchQuery.destroy();
          if (error) return resolve(err(error));
          resolve(
            ok(results.map((doc) => doc.toSnapshot())),
          );
        },
      );
    });

  // Mongo query for popularity being defined:
  // { popularity: { $exists: true } }
  // Count of those:
  // db.Info.count({ popularity: { $exists: true } })

  const staleAgeDays = 3;
  const staleAgeMS = 1000 * 60 * 60 * 24 * staleAgeDays;
  const getStaleInfoIds = async (batchSize) => {
    const entityName = 'Info';
    const from = toCollectionName(entityName);
    const collection = mongoDBDatabase.collection(from);

    // Get info IDs where the 'popularityUpdated' field is older than 1 day
    // or nonexistent. Limited to 500 results. Sorted by priority.
    const staleTime = dateToTimestamp(
      new Date(Date.now() - staleAgeMS),
    );

    // Also, because sometimes vizzes created in the last 24 hours
    // are scored much higher than they shouold be, we want to update
    // them more frequently. So we also include vizzes that were created
    // less than 24 hours ago AND have been scored more than 30 minutes ago.
    const thirtyMinutesAgo = dateToTimestamp(
      new Date(Date.now() - 1000 * 60 * 30),
    );

    const results = await collection
      .aggregate([
        {
          $match: {
            $or: [
              // Score vizzes whose popularity score
              // has not been updated in the last 1 day.
              { popularityUpdated: { $lt: staleTime } },

              // Score vizzes that have never been scored
              { popularityUpdated: { $exists: false } },

              // Score Infos created less than 24 hours ago
              // AND scored more than 30 minutes ago
              // so that vizzes created in the last 24 hours
              // are scored more frequently.
              //
              // The problem this solves is that non-interesting
              // vizzes tend to cluster at the top of the list
              // just because they happen to be scored soon
              // after creation.
              {
                $and: [
                  { created: { $gt: staleTime } },
                  {
                    popularityUpdated: {
                      $lt: thirtyMinutesAgo,
                    },
                  },
                ],
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            popularityUpdated: 1,

            // Figure out if it was created in the last 24 hours
            recentlyCreated: {
              $cond: {
                if: { $gte: ['$created', staleTime] },
                then: 1,
                else: 0,
              },
            },
            // Add a field to sort documents with no popularityUpdated to the top
            neverScored: {
              $cond: {
                if: {
                  $ifNull: ['$popularityUpdated', false],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
        {
          // Sort by the new fields in the following order:
          // 1. Documents with no popularityUpdated (nulls first)
          // 2. Documents created within the last 24 hours (recent first)
          // 3. Documents with popularityUpdated, updating the oldest scores first.
          $sort: {
            neverScored: -1,
            recentlyCreated: -1,
            popularityUpdated: 1,
          },
        },
        { $limit: batchSize },
      ])
      .toArray();

    // console.log(results);

    return ok(results.map((result) => result._id));
  };

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

  const getPermissions = (
    user: UserId | null,
    resources: Array<ResourceId> | null,
  ) =>
    new Promise((resolve) => {
      const entityName = 'Permission';
      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        {
          $and: [
            // user could be null
            ...(user !== null ? [{ user }] : []),
            // resources could be null
            ...(resources !== null
              ? [{ resource: { $in: resources } }]
              : []),
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

  const getUpvotes = (
    user: UserId | null,
    vizzes: Array<VizId> | null,
  ) =>
    new Promise((resolve) => {
      const entityName = 'Upvote';
      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        {
          $and: [
            // user could be null
            ...(user !== null ? [{ user }] : []),
            // vizzes could be null
            ...(vizzes !== null
              ? [{ viz: { $in: vizzes } }]
              : []),
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

  const incrementUserUnreadNotificationsCount = shareDBAdd(
    'User',
    toCollectionName('User'),
    'numUnreadNotifications',
    1,
  );

  const decrementUserUnreadNotificationsCount = shareDBAdd(
    'User',
    toCollectionName('User'),
    'numUnreadNotifications',
    -1,
  );

  // From v2
  // const pageSize = 10;

  // export const searchUsers = (connection) => async ({ query, offset }) => {
  //   const mongoQuery = {
  //     $limit: pageSize,
  //     $skip: offset * pageSize,
  //     $or: [
  //       { userName: { $regex: query, $options: 'i' } },
  //       { fullName: { $regex: query, $options: 'i' } },
  //     ],
  //   };
  //   const results = await fetchShareDBQuery(USER, mongoQuery, connection);

  //   // Uncomment to introduce delay for manual testing.
  //   //const foo = await new Promise(resolve => {setTimeout(() => resolve(), 3000);});
  //   return results.map((shareDBDoc) => new User(shareDBDoc.data));
  // };

  const typeaheadPageSize = 20;
  const getUsersForTypeahead = (query: string) =>
    new Promise((resolve) => {
      const entityName = 'User';
      const fetchQuery = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        {
          $limit: typeaheadPageSize,
          $or: [
            { userName: { $regex: query, $options: 'i' } },
            { fullName: { $regex: query, $options: 'i' } },
          ],
        },
        {},
        (error, results) => {
          fetchQuery.destroy();
          if (error) return resolve(err(error));
          resolve(
            ok(
              results.map(
                (doc: ShareDBDoc<User>) => doc.data,
              ),
            ),
          );
        },
      );
    });

  const getInfoByUserAndSlug = ({
    userId,
    slug,
  }: {
    userId: UserId;
    slug: string;
  }) =>
    new Promise((resolve) => {
      const entityName = 'Info';
      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        { owner: userId, slug },
        {},
        (error, results) => {
          query.destroy();
          if (error) return resolve(err(error));
          if (results.length === 0) {
            return resolve(
              err(resourceNotFoundError(slug, 'Info')),
            );
          }
          resolve(ok(results[0].toSnapshot()));
        },
      );
    });

  const getUserIdByStripeCustomerId = async (
    stripeCustomerId: string,
  ) => {
    const entityName = 'User';
    const from = toCollectionName(entityName);
    const collection = mongoDBDatabase.collection(from);

    const result = await collection.findOne({
      stripeCustomerId,
    });

    if (result === null) {
      return err(
        resourceNotFoundError(stripeCustomerId, entityName),
      );
    }

    return ok(result._id);
  };

  const getCommentsForResource = async (resource: VizId) =>
    new Promise((resolve) => {
      const entityName = 'Comment';
      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        { resource },
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

  const getRevisionHistoryCommitMetadata = async (
    vizId: VizId,
  ) => {
    const entityName = 'Commit';
    const from = toCollectionName(entityName);
    const collection = mongoDBDatabase.collection(from);
    const results = await collection
      .find(
        { viz: vizId },
        {
          projection: {
            _id: 1,
            parent: 1,
            timestamp: 1,
            authors: 1,
          },
        },
      )
      .toArray();
    return ok(
      results.map((commitMetadata) => ({
        id: commitMetadata._id,
        parent: commitMetadata.parent,
        timestamp: commitMetadata.timestamp,
        authors: commitMetadata.authors,
      })),
    );
  };

  const getAPIKeys = async (userId: UserId) => {
    const entityName = 'APIKey';
    const from = toCollectionName(entityName);
    const collection = mongoDBDatabase.collection(from);
    const results = await collection
      .find({ owner: userId })
      .toArray();
    for (const result of results) {
      delete result._id;
    }
    return ok(results);
  };

  const getAPIKeyIdFromHash = async (hash: string) => {
    const entity = 'APIKeyHash';
    const from = toCollectionName(entity);
    const collection = mongoDBDatabase.collection(from);
    const result: APIKeyHash = await collection.findOne({
      hash,
    });
    if (result === null) {
      return err(resourceNotFoundError(hash, entity));
    }
    return ok(result.id);
  };

  const getCommitImageKeys = async (
    commitIds: Array<CommitId>,
  ) => {
    const entityName = 'CommitImageKey';
    const from = toCollectionName(entityName);
    const collection = mongoDBDatabase.collection(from);
    const results = await collection
      .find({ commitId: { $in: commitIds } })
      .toArray();
    for (const result of results) {
      delete result._id;
    }
    return ok(results);
  };

  const saveCommitImageKeys = async (
    commitImageKeys: Array<CommitImageKey>,
  ) => {
    const entityName = 'CommitImageKey';
    const from = toCollectionName(entityName);
    const collection = mongoDBDatabase.collection(from);

    if (commitImageKeys.length === 0) return ok('success');

    const bulkOps = commitImageKeys.map(
      (commitImageKey) => ({
        updateOne: {
          filter: { commitId: commitImageKey.commitId },
          update: { $set: commitImageKey },
          upsert: true,
        },
      }),
    );

    await collection.bulkWrite(bulkOps);

    return ok('success');
  };

  const getAIEditMetadataForUser = async (
    userId: UserId,
  ) => {
    const entityName = 'AIEditMetadata';
    const from = toCollectionName(entityName);
    const collection = mongoDBDatabase.collection(from);
    const result = await collection
      .find({ user: userId })
      .toArray();

    for (const item of result) {
      delete item._id;
      delete item.openRouterGenerationId;
      delete item.user;
      delete item.viz;
      delete item.upstreamCostCents;
      delete item.provider;
      delete item.inputTokens;
      delete item.outputTokens;
      delete item.promptTemplateVersion;
    }

    // Reverse so most recent comes first in the list
    result.reverse();

    return ok(result);
  };

  const getNotificationsByUserId = async (userId: UserId) =>
    new Promise((resolve) => {
      const entityName = 'Notification';
      //TODO: consider adding limit for how many notifications are returned.
      const query = shareDBConnection.createFetchQuery(
        toCollectionName(entityName),
        { user: userId },
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

  let databaseGateways = {
    type: 'DatabaseGateways',
    getForks,
    getInfos,
    incrementForksCount,
    decrementForksCount,
    incrementUpvotesCount,
    decrementUpvotesCount,
    incrementUserUnreadNotificationsCount,
    decrementUserUnreadNotificationsCount,
    getCommitAncestors,
    getFolderAncestors,
    getUserByUserName,
    getUserByEmails,
    getUsersByIds,
    getPermissions,
    getUpvotes,
    lock,
    getUsersForTypeahead,
    getStaleInfoIds,
    getInfoByUserAndSlug,
    getUserIdByStripeCustomerId,
    getCommentsForResource,
    getRevisionHistoryCommitMetadata,
    getAPIKeys,
    getAPIKeyIdFromHash,
    getCommitImageKeys,
    saveCommitImageKeys,
    getAIEditMetadataForUser,
    getNotificationsByUserId,
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
