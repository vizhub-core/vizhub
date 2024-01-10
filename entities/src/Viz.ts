import { UserId } from './Users';
import { OrgId } from './Orgs';
import { CommitId } from './RevisionHistory';
import { FolderId } from './Folders';
import { Timestamp, Visibility } from './common';
import { FileId, File, Files, VZCodeContent } from 'vzcode';

export type { FileId, File, Files };

// VizId
//  * Unique identifier string for a Viz.
//  * Common between Info and Content for a given Viz.
//  * This is a UUID v4 string with dashes removed (for ease of URL copying).
export type VizId = string;

// An SPDX License Identifier.
//  * See "Identifier" column in https://spdx.org/licenses/
export type License = string;

// Viz
//  * The central entity of VizHub.
//  * Its representation is divided between "info" and "content".
//  * info.id === content.id
//  * This is done so that listings need to only touch lightweight "info",
//    whereas the potentially bulky "content" is only loaded on the
//    viz page or elsewhere when the viz needs to be executed or files
//    need to be accessed.
export interface Viz {
  info: Info;
  content: Content;
}

// Info
//  * Lightweight metadata about the viz.
//  * Primarily used for listings pages (Home, Profile)
export interface Info {
  id: VizId;

  // The user or organization that owns this viz.
  owner: UserId | OrgId;

  // The title of the viz.
  title: string;

  // forkedFrom
  //  * The id of the viz that this viz was forked from.
  //  * `null` only for the singular primordial viz.
  //  * Could be inferred / backfilled.
  //  * Should be updated to be the nearest ancestor
  //    when the forked from viz is deleted.
  forkedFrom: VizId | null;

  // When this viz was created.
  created: Timestamp;

  // When this viz was last updated.
  updated: Timestamp;

  // The commit corresponding to the initial version
  // of this viz, at the time it was created (forked).
  // Invariant: `startCommit.timestamp === info.created`
  start: CommitId;

  // The most recent commit of this viz.
  // Invariant: `endCommit.timestamp === info.updated`
  end: CommitId;

  // committed
  //  * Whether or not endCommit represents the latest live version of content
  //  * If `true`, content could be restored from commit history
  //  * If `true`, it is safe to freeze this viz (Content doc can be deleted)
  //  * If `false`, content contains uncommitted changes
  //  * If `false`, it is not safe to freeze this viz
  committed: boolean;

  // commitAuthors
  //  * A temporary place to track who is attached to changes
  //  * When committed === false, this field gets populated
  //    with user ids as they make changes
  //  * This field is transferred to a new set of CommitAuthorship
  //    records and cleared out here when the viz is committed
  commitAuthors: Array<UserId>;

  // How many forks this viz has.
  forksCount: number;

  // How many upvotes this viz has.
  upvotesCount: number;

  // The visibility of this viz (public, private, unlisted).
  // `undefined` means the viz is public.
  visibility?: Visibility;

  // True if anyone can edit this viz.
  anyoneCanEdit?: boolean;

  // A Viz may or may not exist within a Folder.
  folder?: FolderId;

  // If this viz is currently in the "trash",
  // this field represents when it was put there.
  // If this viz is not in the "trash",
  // this field is undefined.
  trashed?: Timestamp;

  // A popularity score for this viz.
  // Populated by the scoreHackerHot algorithm.
  popularity?: number;

  // When the popularity score was last updated.
  popularityUpdated?: Timestamp;

  // True if forkedFrom was backfilled (guessed)
  // by the V2 --> V3 migration script,
  // or by an earlier backfilling initiative.
  //
  // Undefined if not (no entry in Mongo document).
  //
  // (Aside: Deletion in V2 did not account for
  //         breakages of forkedFrom, so in the V2
  //         database there are lots of forkedFrom
  //         field values that are invalid because
  //         they point to deleted vizzes. )
  forkedFromIsBackfilled?: boolean;

  // Whether or not this viz is "frozen."
  // If true, content is null.
  // If false or `undefined`, content is defined.
  frozen?: boolean;

  // True for vizzes that were migrated from V2.
  migratedFromV2?: boolean;

  // When this viz was last migrated from V2.
  migratedTimestamp?: Timestamp;
}

// Configuration
// * An object that can be serialized as JSON
export type Configuration = any;

// Content
//  * Heavyweight content of a viz.
//  * Contains the full content of all files in the viz.
export type Content = VZCodeContent & {
  // id
  // * The viz that this content is associated with
  id: VizId;

  // title
  //  * The title of the viz, same as Info.title
  //  * Tracked here so that it can be versioned
  //  * Restoring an old version should restore its old title
  title?: string;

  // height
  // * The customized height of the viz in pixels
  // * Not defined if the user has not customized it
  // * If not defined, the default height is used,
  //   which is specified by defaultVizHeight.
  height?: number;

  // license
  // * The customized license associated with this viz
  // * Not defined if the user has not customized it
  license?: License;

  // configuration
  // * The dynamic configuration of this viz
  // * Persistent state synchronized in real time
  // * This can be manipulated by viz code at runtime
  // * This can be manipulated by the visual editor as well
  configuration?: Configuration;
};

// VizAuthorshipId
//  * Unique identifier string for a VizAuthorship.
export type VizAuthorshipId = string;

// VizAuthorship
//  * Indicates that a user is a secondary author on a Viz
//  * Appears as "authors" in Viz page
//  * Queryable under "Authored by me" in profile personal view
export interface VizAuthorship {
  id: VizAuthorshipId;

  // Who is counted as an author on the viz
  author: UserId;

  // Which viz they are an author on
  viz: VizId;

  // When they were added as an author
  timestamp: Timestamp;

  // Who added them as an author
  addedBy: UserId;
}

// UpvoteId
//  * Unique identifier string for a Upvote.
//  * Of the form `${userId}-${vizId}`;
export type UpvoteId = string;

// Upvote
//  * A representation of when a user upvoted a viz.
//  * In the previous version of the data model,
//    this was an array property of Info.
//    That's a bad idea because it's expensive to query for
//    "vizzes that a specific user has upvoted".
//  * It's a separate Mongo collection here because we need to
//    query for "vizzes that a specific user has upvoted", and also
//    query for "users that upvoted a specific viz",
//    and both ways should be equally efficient.
export interface Upvote {
  id: UpvoteId;

  // Who upvoted the viz
  user: UserId;

  // Which viz they upvoted
  viz: VizId;

  // When they upvoted
  timestamp: Timestamp;
}

export type V3PackageJson = {
  dependencies?: {
    [key: string]: string;
  };
  vizhub?: {
    libraries: {
      [key: string]: {
        path: string;
        global: string;
      };
    };
  };
  license?: License;
};

// The default height of a viz in pixels.
// Homage to bl.ocks.org.
export const defaultVizHeight = 500;

// This is fixed.
export const defaultVizWidth = 960;

// The default license for a viz.
export const defaultLicense = 'MIT';
