// MemoryGateways is an implementation of the gateways
// using a simple in-memory setup.
// The main use of this is for fast-running tests,
// and to have a simple environment for a sample
// implementation of gateways, as a precursor to the
// database gateways implementation found in the
// `database` package.
import {
  resourceNotFoundError,
  invalidDecrementError,
} from './errors';
import {
  defaultSortOrder,
  defaultSortOption,
  VizId,
  VizEmbedding,
  CommitId,
  FolderId,
  UserName,
  EmailAddress,
  UserId,
  User,
  ResourceId,
  EntityName,
  ResourceLockId,
  Info,
} from 'entities';
import { fakeSnapshot } from 'entities/test/fixtures';
import { ok, err, Result } from './Result';
import { Gateways, pageSize } from './Gateways';
import { ascending, descending } from 'd3-array';

type Entity = { [key: string]: any };
type EntityId = string;

// No-operation, do nothing.
const noop = (d: Entity) => d;

// The same underlying CRUD (Create, Read, Update, Delete)
// implementation supports all these entities.
export const crudEntityNames: Array<EntityName> = [
  'Info',
  'Content',
  'User',
  'Upvote',
  'VizAuthorship',
  'Comment',
  'Mention',
  'Folder',
  'Permission',
  'Org',
  'OrgMembership',
  'Tagging',
  'Collection',
  'CollectionMembership',
  'Commit',
  'Milestone',
  'Deployment',
  'MergeRequest',
  'BetaProgramSignup',
  'AnalyticsEvent',
  // 'MigrationStatus',
  // 'MigrationBatch',
  'ImageMetadata',
  'StoredImage',
];

// These entities are stored directly in Mongo,
// not going through ShareDB, so they don't need to
// be wrapped in a Snapshot.
export const noSnapshot = {
  Commit: true,
  Milestone: true,
  BetaProgramSignup: true,
  StoredImage: true,
};

// An in-memory implementation for gateways,
// for use in unit tests (faster than using Mongo).
export const MemoryGateways = (): Gateways => {
  // Stores all documents.
  //  * Sort of simulates an instance of MongoDB.
  //  * Keys: entity names
  //  * Values: Objects having:
  //    * Keys: ids
  //    * Values: documents
  const documents: {
    [key: string]: { [key: EntityId]: Entity };
  } = {};

  // Stores all viz embeddings.
  // Keys: ids
  // Values: viz embeddings
  const vizEmbeddings: {
    [key: VizId]: VizEmbedding;
  } = {};

  // Writes a document.
  const genericSave =
    (entityName: EntityName) => async (entity: Entity) => {
      documents[entityName][entity.id] = entity;
      return ok('success');
    };

  // Reads a document
  const genericGet =
    (entityName: EntityName) => async (id: EntityId) =>
      id in documents[entityName]
        ? ok(
            (noSnapshot[entityName] ? noop : fakeSnapshot)(
              documents[entityName][id],
            ),
          )
        : err(resourceNotFoundError(id, entityName));

  // Deletes a document
  const genericDelete =
    (entityName: EntityName) => async (id: EntityId) => {
      if (id in documents[entityName]) {
        delete documents[entityName][id];
        return ok('success');
      } else {
        return err(resourceNotFoundError(id, entityName));
      }
    };

  const getForks = async (id: VizId) =>
    ok(
      Object.values(documents.Info)
        .filter(({ forkedFrom }) => forkedFrom === id)
        .map(fakeSnapshot<Info>),
    );

  const getInfos = async ({
    owner,
    forkedFrom,
    sortField = defaultSortOption.sortField,
    pageNumber = 0,
    sortOrder = defaultSortOrder,
    vizIds = null,
  }) => {
    const comparator =
      sortOrder === 'ascending' ? ascending : descending;
    return ok(
      Object.values(documents.Info)
        .filter(
          (d) => vizIds === null || vizIds.includes(d.id),
        )
        .filter(
          (d, i) =>
            // Return true if this document is in the current page specified by pageNumber
            // and matches the owner and forkedFrom filters.
            (owner === undefined || d.owner === owner) &&
            (forkedFrom === undefined ||
              d.forkedFrom === forkedFrom) &&
            i >= pageNumber * pageSize &&
            i < (pageNumber + 1) * pageSize,
        )
        .sort((a, b) =>
          comparator(a[sortField], b[sortField]),
        )
        .map(fakeSnapshot<Info>),
    );
  };

  const incrementForksCount = async (id: VizId) => {
    documents.Info[id].forksCount++;
    return ok('success');
  };

  const incrementUpvotesCount = async (id: VizId) => {
    documents.Info[id].upvotesCount++;
    return ok('success');
  };

  const decrementUpvotesCount = async (id: VizId) => {
    if (documents.Info[id].upvotesCount === 0) {
      return err(invalidDecrementError(id, 'upvotesCount'));
    }
    documents.Info[id].upvotesCount--;
    return ok('success');
  };

  const decrementForksCount = async (id: VizId) => {
    if (documents.Info[id].forksCount === 0) {
      return err(invalidDecrementError(id, 'forksCount'));
    }
    documents.Info[id].forksCount--;
    return ok('success');
  };

  const getCommitAncestors = async (
    id: CommitId,
    toNearestMilestone?: boolean,
    start?: CommitId,
  ) => {
    let commit = documents.Commit[id];
    if (!commit) {
      return err(resourceNotFoundError(id, 'Commit'));
    }
    const commits = [commit];
    while (
      commit.parent &&
      !(toNearestMilestone && commit.milestone) &&
      !(start && commit.id === start)
    ) {
      if (!(commit.parent in documents.Commit)) {
        return err(
          resourceNotFoundError(commit.parent, 'Commit'),
        );
      }
      commit = documents.Commit[commit.parent];
      commits.push(commit);
    }
    return ok(commits.reverse());
  };
  // TODO consider only returning ids here?
  // For permissions, onlu ids are needed.
  // For breadcrumbs, names are needed as well
  const getFolderAncestors = async (id: FolderId) => {
    let folder = documents.Folder[id];
    if (!folder) {
      return err(resourceNotFoundError(id, 'Folder'));
    }
    const folders = [folder];
    while (folder.parent) {
      if (!(folder.parent in documents.Folder)) {
        return err(
          resourceNotFoundError(folder.parent, 'Folder'),
        );
      }
      folder = documents.Folder[folder.parent];
      folders.push(folder);
    }
    return ok(folders.reverse());
  };

  const getUserByUserName = async (userName: UserName) => {
    const user = Object.values(documents.User).find(
      (user) => user.userName === userName,
    );
    return user
      ? ok(fakeSnapshot(user))
      : err(resourceNotFoundError(userName, 'User'));
  };

  const getUserByEmails = async (
    emails: Array<EmailAddress>,
  ) => {
    const user = Object.values(documents.User).find(
      (user) =>
        emails.includes(user.primaryEmail) ||
        (user.secondaryEmails &&
          user.secondaryEmails.find((email) =>
            emails.includes(email),
          )),
    );
    return user
      ? ok(fakeSnapshot(user))
      : err(
          resourceNotFoundError(emails.join(', '), 'User'),
        );
  };

  const getUsersByIds = async (ids: Array<UserId>) => {
    const users = Object.values(documents.User).filter(
      (user) => ids.includes(user.id),
    );
    if (users.length !== ids.length) {
      return err(
        resourceNotFoundError(ids.join(', '), 'User'),
      );
    }
    return ok(users.map(fakeSnapshot));
  };

  const getPermissions = async (
    user: User | null,
    resources: Array<ResourceId> | null,
  ) => {
    const allPermissions = Object.values(
      documents.Permission,
    );
    const permissions = allPermissions
      .filter((permission) =>
        user !== null ? permission.user === user : true,
      )
      .filter((permission) =>
        resources !== null
          ? resources.some(
              (resource) =>
                resource === permission.resource,
            )
          : true,
      );
    return ok(permissions.map(fakeSnapshot));
  };

  const getUpvotes = async (
    user: User | null,
    vizzes: Array<VizId> | null,
  ) => {
    const allUpvotes = Object.values(documents.Upvote);
    const upvotes = allUpvotes
      .filter((upvote) =>
        user !== null ? upvote.user === user : true,
      )
      .filter((upvote) =>
        vizzes !== null
          ? vizzes.some((viz) => viz === upvote.viz)
          : true,
      );
    return ok(upvotes.map(fakeSnapshot));
  };

  const saveVizEmbedding = async (
    vizEmbedding: VizEmbedding,
  ) => {
    vizEmbeddings[vizEmbedding.vizId] = vizEmbedding;
    return ok('success');
  };

  const getVizEmbedding = async (vizId: VizId) =>
    vizId in vizEmbeddings
      ? ok(vizEmbeddings[vizId])
      : err(resourceNotFoundError(vizId, 'VizEmbedding'));

  const deleteVizEmbedding = async (vizId: VizId) => {
    if (vizId in vizEmbeddings) {
      delete vizEmbeddings[vizId];
      return ok('success');
    } else {
      return err(
        resourceNotFoundError(vizId, 'VizEmbedding'),
      );
    }
  };

  // Utility function to compute cosine similarity between two vectors
  const cosineSimilarity = (
    vecA: Array<number>,
    vecB: Array<number>,
  ): number => {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    // If either of the norms is zero, return 0 (indicating vectors are orthogonal)
    if (normA === 0 || normB === 0) {
      return 0;
    }

    return (
      dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
    );
  };

  const knnVizEmbeddingSearch = async (
    embedding: Array<number>,
    k: number,
  ): Promise<Result<Array<VizId>>> => {
    // Compute cosine similarities
    const similarities: Array<[VizId, number]> = [];

    for (const id in vizEmbeddings) {
      const similarity = cosineSimilarity(
        embedding,
        vizEmbeddings[id].embedding,
      );
      similarities.push([id, similarity]);
    }

    // Sort by similarity in descending order and take top K
    const sorted = similarities
      .sort((a, b) => b[1] - a[1])
      .slice(0, k);

    // Return the VizIds of the top K
    return ok(sorted.map((item) => item[0]));
  };

  const lock = async (_, fn) => await fn();

  const getUsersForTypeahead = async (query: string) => {
    const users = Object.values(documents.User).filter(
      (user: User) =>
        user.userName
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        user.displayName
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
    return ok(users);
  };
  const getInfoByUserAndSlug = ({
    userId,
    slug,
  }: {
    userId: UserId;
    slug: string;
  }) => {
    const info = Object.values(documents.Info).find(
      (info: Info) => {
        console.log(
          'checking info ',
          JSON.stringify(info, null, 2),
        );
        console.log(
          'info.slug === slug ',
          info.slug === slug,
        );
        console.log(
          'info.owner === userId ',
          info.owner === userId,
        );
        return info.slug === slug && info.owner === userId;
      },
    );
    return info
      ? ok(fakeSnapshot(info))
      : err(resourceNotFoundError(slug, 'Info'));
  };

  const getCommitsForViz = async (vizId: VizId) =>
    ok(
      Object.values(documents.Commit).filter(
        (commit) => commit.viz === vizId,
      ),
    );

  // Populate non-CRUD methods.
  let memoryGateways: Gateways = {
    type: 'MemoryGateways',
    getForks,
    getInfos,

    // TODO (maybe): make TypeScript happy
    // Not sure it's worth it as we'd need to unroll
    // the spread AND for loop above, filling in
    // actual entity types for each entity name.

    // @ts-ignore
    incrementForksCount,
    // @ts-ignore
    decrementForksCount,
    // @ts-ignore
    incrementUpvotesCount,
    // @ts-ignore
    decrementUpvotesCount,
    // @ts-ignore
    getCommitAncestors,
    // @ts-ignore
    getFolderAncestors,
    // @ts-ignore
    getUserByUserName,
    // @ts-ignore
    getUserByEmails,
    // @ts-ignore
    getUsersByIds,
    // @ts-ignore
    getPermissions,
    // @ts-ignore
    getUpvotes,
    // @ts-ignore
    saveVizEmbedding,
    // @ts-ignore
    getVizEmbedding,
    // @ts-ignore
    deleteVizEmbedding,
    // @ts-ignore
    knnVizEmbeddingSearch,
    // @ts-ignore
    lock,
    // @ts-ignore
    getUsersForTypeahead,
    // @ts-ignore
    getInfoByUserAndSlug,
    // @ts-ignore
    getCommitsForViz,
  };

  // Packages up save, get, and delete
  // for a given entity name.
  const crud = (entityName: EntityName) => ({
    [`save${entityName}`]: genericSave(entityName),
    [`get${entityName}`]: genericGet(entityName),
    [`delete${entityName}`]: genericDelete(entityName),
  });

  // Populate CRUD methods.
  for (const entityName of crudEntityNames) {
    documents[entityName] = {};
    memoryGateways = {
      ...memoryGateways,
      ...crud(entityName),
    };
  }

  return memoryGateways;
};
