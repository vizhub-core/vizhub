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
} from 'entities';
import { ok, err } from './Result';
import { pageSize } from './Gateways';
import { ascending, descending } from 'd3-array';

// A stub similar to ShareDB snapshots.
export const fakeSnapshot = (data) => ({
  data,
  v: 1,
  type: 'json1',
});

// No-operation, do nothing.
const noop = (d) => d;

// The same underlying CRUD (Create, Read, Update, Delete)
// implementation supports all these entities.
export const crudEntityNames = [
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
  'Embedding',
];

// These entities are stored directly in Mongo,
// not going through ShareDB, so they don't need to
// be wrapped in a fake Snapshot.
export const noSnapshot = {
  Commit: true,
  Milestone: true,
  BetaProgramSignup: true,
  Embedding: true,
};

// An in-memory implementation for gateways,
// for use in unit tests (faster than using Mongo).
export const MemoryGateways = () => {
  // Stores all documents.
  //  * Sort of simulates an instance of MongoDB.
  // * Keys: entity names
  // Values: Objects having:
  //  * Keys: ids
  //  * Values: documents
  const documents = {};

  // Writes a document.
  const genericSave = (entityName) => async (entity) => {
    documents[entityName][entity.id] = entity;
    return ok('success');
  };

  // Reads a document
  const genericGet = (entityName) => async (id) =>
    id in documents[entityName]
      ? ok(
          (noSnapshot[entityName] ? noop : fakeSnapshot)(
            documents[entityName][id],
          ),
        )
      : err(resourceNotFoundError(id));

  // Deletes a document
  const genericDelete = (entityName) => async (id) => {
    if (id in documents[entityName]) {
      delete documents[entityName][id];
      return ok('success');
    } else {
      return err(resourceNotFoundError(id));
    }
  };

  // Packages up save, get, and delete
  // for a given entity name.
  const crud = (entityName) => ({
    [`save${entityName}`]: genericSave(entityName),
    [`get${entityName}`]: genericGet(entityName),
    [`delete${entityName}`]: genericDelete(entityName),
  });

  const getForks = async (id) =>
    ok(
      Object.values(documents.Info)
        .filter(({ forkedFrom }) => forkedFrom === id)
        .map(fakeSnapshot),
    );

  const getInfos = async ({
    owner,
    forkedFrom,
    sortField = defaultSortOption.sortField,
    pageNumber = 0,
    sortOrder = defaultSortOrder,
  }) => {
    const comparator =
      sortOrder === 'ascending' ? ascending : descending;
    return ok(
      Object.values(documents.Info)
        .sort((a, b) =>
          comparator(a[sortField], b[sortField]),
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
        .map(fakeSnapshot),
    );
  };

  const incrementForksCount = async (id) => {
    documents.Info[id].forksCount++;
    return ok('success');
  };

  const incrementUpvotesCount = async (id) => {
    documents.Info[id].upvotesCount++;
    return ok('success');
  };

  const decrementUpvotesCount = async (id) => {
    if (documents.Info[id].upvotesCount === 0) {
      return err(invalidDecrementError(id, 'upvotesCount'));
    }
    documents.Info[id].upvotesCount--;
    return ok('success');
  };

  const decrementForksCount = async (id) => {
    if (documents.Info[id].forksCount === 0) {
      return err(invalidDecrementError(id, 'forksCount'));
    }
    documents.Info[id].forksCount--;
    return ok('success');
  };

  const getCommitAncestors = async (
    id,
    toNearestMilestone,
    start,
  ) => {
    let commit = documents.Commit[id];
    if (!commit) {
      return err(resourceNotFoundError(id));
    }
    const commits = [commit];
    while (
      commit.parent &&
      !(toNearestMilestone && commit.milestone) &&
      !(start && commit.id === start)
    ) {
      if (!(commit.parent in documents.Commit)) {
        return err(resourceNotFoundError(commit.parent));
      }
      commit = documents.Commit[commit.parent];
      commits.push(commit);
    }
    return ok(commits.reverse());
  };
  // TODO consider only returning ids here?
  // For permissions, onlu ids are needed.
  // For breadcrumbs, names are needed as well
  const getFolderAncestors = async (id) => {
    let folder = documents.Folder[id];
    if (!folder) {
      return err(resourceNotFoundError(id));
    }
    const folders = [folder];
    while (folder.parent) {
      if (!(folder.parent in documents.Folder)) {
        return err(resourceNotFoundError(commit.parent));
      }
      folder = documents.Folder[folder.parent];
      folders.push(folder);
    }
    return ok(folders.reverse());
  };

  const getUserByUserName = async (userName) => {
    const user = Object.values(documents.User).find(
      (user) => user.userName === userName,
    );
    return user
      ? ok(fakeSnapshot(user))
      : err(resourceNotFoundError(userName));
  };

  const getUserByEmails = async (emails) => {
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
      : err(resourceNotFoundError(emails));
  };

  const getUsersByIds = async (ids) => {
    const users = Object.values(documents.User).filter(
      (user) => ids.includes(user.id),
    );
    return ok(users.map(fakeSnapshot));
  };

  const getPermissions = async (user, resources) => {
    const allPermissions = Object.values(
      documents.Permission,
    );
    const permissions = allPermissions
      .filter((permission) => permission.user === user)
      .filter((permission) =>
        resources.some(
          (resource) => resource === permission.resource,
        ),
      );
    return ok(permissions.map(fakeSnapshot));
  };

  // Populate non-CRUD methods.
  let memoryGateways = {
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
  };

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
