// MemoryGateways is an implementation of the gateways
// using a simple in-memory setup.
// The main use of this is for fast-running tests,
// and to have a simple environment for a sample
// implementation of gateways, as a precursor to the
// database gateways implementation found in the
// `database` package.
import { resourceNotFoundError } from './errors';
import { ok, err } from './Result';

// A stub similar to ShareDB snapshots.
const fakeSnapshot = (data) => ({
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
];

// These entities are stored directly in Mongo,
// not going through ShareDB, so they don't need to
// be wrapped in a fake Snapshot.
export const noSnapshot = {
  Commit: true,
  Milestone: true,
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
            documents[entityName][id]
          )
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
        .map(fakeSnapshot)
    );

  const getCommitAncestors = async (id, toNearestMilestone, start) => {
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

  const getUserByEmails = async (emails) => {
    const user = Object.values(documents.User).find(
      (user) =>
        emails.includes(user.primaryEmail) ||
        (user.secondaryEmails &&
          user.secondaryEmails.find((email) => emails.includes(email)))
    );
    return user ? ok(fakeSnapshot(user)) : err(resourceNotFoundError(emails));
  };

  // Populate non-CRUD methods.
  let memoryGateways = { getForks, getCommitAncestors, getUserByEmails };

  // Populate CRUD methods.
  for (const entityName of crudEntityNames) {
    documents[entityName] = {};
    memoryGateways = { ...memoryGateways, ...crud(entityName) };
  }

  return memoryGateways;
};
