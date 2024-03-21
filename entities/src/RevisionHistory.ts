import { VizId, Content } from './Viz';
import { UserId } from './Users';
import { Timestamp } from './common';

// CommitId
//  * A unique ID for a commit.
//  * This is a UUID with dashes removed.
//  * Same format as VizId.
export type CommitId = string;

// Op
//  * A JSON1 OT Operation
//  * This type is complex, and is defined in detail here:
//  * https://github.com/ottypes/json1/blob/master/spec.md#operations
export type Op = any;

// SecondaryParentType
//  * Possible types of secondary parent commits
//  * See Commit.secondaryParent
export enum SecondaryParentType {
  mergeRequest = 'mergeRequest',
  restoredVersion = 'restoredVersion',
}

// Commit
//  * A particular revision of a viz
export interface Commit {
  // id
  // * The unique Id of this commit.
  id: CommitId;

  // parent
  //  * The Id of the parent commit.
  //  * `undefined` only for the singular primordial commit.
  parent?: CommitId;

  // secondaryParent
  //  * The Id of the secondary parent commit.
  //  * `undefined` most of the time
  //  * Only populated under two circumstances:
  //    1. A merge request was merged, in which case
  //       secondaryParent is the latest commit of the
  //       merge request compare viz.
  //    2. A previous version was restored, in which case
  //       secondaryParent is the previous version.
  secondaryParent?: CommitId;

  // secondaryParentType
  //  * The type of secondary parent
  //  * Either "mergeRequest" or "restoredVersion"
  secondaryParentType?: SecondaryParentType;

  // viz
  //  * The viz that this commit belongs to.
  //  * Every commit belongs to exactly one viz.
  viz: VizId;

  // Who is an author on the commit
  authors: Array<UserId>;

  // timestamp
  //  * The time at which this commit was made.
  timestamp: Timestamp;

  // ops
  //  * The OT ops that represent the diff in vizContent
  //    between the previous commit version and this commit version.
  ops: Array<Op>;

  // milestone
  //
  //  * Populated if there is a milestone for the versioned Content
  //    at this commit. Few and far between Commits
  //    will have this field populated. It is an optimization
  //    for reconstructing content at any commit.
  //
  //  * This milestone optimization approach allows us to set a
  //    constant upper bound on the number of commits that need to
  //    be traversed in order to reconstruct the content at any
  //    given commit. This reduces algorithmic complexity of
  //    GetContentAtCommit from O(n) to O(1) where n is the
  //    total number of commits in the database.
  //
  //  * If GetContentAtCommit needs to traverse more than `maxCommits`
  //    Commits in order to reconstruct Content at a particular commit,
  //    then it creates a Milestone and updates the associated commit with the
  //    boolean field `hasMilestone`. Milestones use CommitIds, so the id
  //    of the commit can be used to look up the Milestone.
  //
  //  * TODO consider making this field optional for small Mongo documents,
  //    otherwise _most_ commits will have "milestone: null" wasting disk space.
  milestone?: MilestoneId;
}

// This simplified form of Commit is used to power the
// revision history navigation UI. It is a subset of the
// full Commit type that does _not_ include the ops field.
// This is because the ops field can be quite large and
// is not needed for the UI.
export interface CommitMetadata {
  id: CommitId;
  parent?: CommitId;
  timestamp: Timestamp;
}

// The revision history of a viz is encapsulated in this type.
export interface RevisionHistory {
  commitMetadatas: Array<CommitMetadata>;
}

// MilestoneId
//  * Unique identifier string for a Milestone.
export type MilestoneId = string;

// Milestone
//  * A full copy of Content versioned at a specific commit
export interface Milestone {
  id: MilestoneId;

  // commit
  //  * Which commit this milestone is attached to
  //  * In this particular commit, we can expect
  //  * commit.milestone to be defined
  commit: CommitId;

  // content
  //  * The Content exactly as it was at this commit
  //  * Used as a starting point for "replaying ops"
  //    to reconstruct any version of a viz.
  content: Content;
}
