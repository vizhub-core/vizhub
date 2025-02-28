import {
  VizId,
  Snapshot,
  Info,
  Content,
  User,
  UserId,
  UserName,
  Upvote,
  UpvoteId,
  VizAuthorship,
  VizAuthorshipId,
  Comment,
  CommentId,
  Mention,
  MentionId,
  Folder,
  FolderId,
  Permission,
  PermissionId,
  Org,
  OrgId,
  OrgMembership,
  OrgMembershipId,
  Tagging,
  TaggingId,
  Collection,
  CollectionId,
  CollectionMembership,
  CollectionMembershipId,
  Commit,
  CommitId,
  Milestone,
  MilestoneId,
  Deployment,
  DeploymentId,
  MergeRequest,
  MergeRequestId,
  EmailAddress,
  AnalyticsEvent,
  AnalyticsEventId,
  ResourceId,
  SortField,
  SortOrder,
  // Embedding,
  // EmbeddingId,
  MigrationStatus,
  VizEmbedding,
  ImageMetadata,
  StoredImage,
  ImageId,
  BetaProgramSignup,
  Visibility,
  ResourceLockId,
  RevisionHistory,
  APIKey,
  AIEditMetadata,
  CommitMetadata,
} from 'entities';
import { Result, Success } from './Result';
import { MigrationStatusId } from 'entities/src/Migration';
import {
  CommitImageKey,
  ImageHash,
} from 'entities/src/Images';
import { APIKeyHash, APIKeyId } from 'entities/src/APIKeys';

// The maximum number of Info documents to return in a single page from `getInfos()`
// export const pageSize = 5;

// Make it a multiple of 4 so that on the profile page,
// which defaults to 4 vizzes per row, we don't have
// a partially filled row at the end.
export const pageSize = 4 * 20;
// export const pageSize = 5;

export interface Gateways {
  type: 'DatabaseGateways' | 'MemoryGateways';
  // ***************************************************************
  // ******************** CRUD Operations **************************
  // ***************************************************************
  // save_
  //  * Updates an existing document, or
  //  * Inserts a new document if none exists with given id
  //
  // get_
  //  * Gets the latest snapshot of the ShareDB document
  //  * Compatible with ShareDB's Doc.ingestSnapshot() method
  //         https://share.github.io/sharedb/api/doc#ingestsnapshot
  //
  // delete_
  //  * Permanently deletes the document
  //  * For a viz (Info & Content), only happens when
  //    deleting from trash or emptying trash

  saveInfo(info: Info): Promise<Result<Success>>;
  getInfo(id: VizId): Promise<Result<Snapshot<Info>>>;
  deleteInfo(id: VizId): Promise<Result<Success>>;

  saveContent(content: Content): Promise<Result<Success>>;
  getContent(id: VizId): Promise<Result<Snapshot<Content>>>;
  deleteContent(id: VizId): Promise<Result<Success>>;

  saveUser(user: User): Promise<Result<Success>>;
  getUser(id: UserId): Promise<Result<Snapshot<User>>>;
  deleteUser(id: UserId): Promise<Result<Success>>;

  saveUpvote(upvote: Upvote): Promise<Result<Success>>;
  getUpvote(
    id: UpvoteId,
  ): Promise<Result<Snapshot<Upvote>>>;
  deleteUpvote(id: UpvoteId): Promise<Result<Success>>;

  saveVizAuthorship(
    vizAuthorship: VizAuthorship,
  ): Promise<Result<Success>>;
  getVizAuthorship(
    id: VizAuthorshipId,
  ): Promise<Result<Snapshot<VizAuthorship>>>;
  deleteVizAuthorship(
    id: VizAuthorshipId,
  ): Promise<Result<Success>>;

  saveComment(comment: Comment): Promise<Result<Success>>;
  getComment(
    id: CommentId,
  ): Promise<Result<Snapshot<Comment>>>;
  deleteComment(id: CommentId): Promise<Result<Success>>;

  saveMention(mention: Mention): Promise<Result<Success>>;
  getMention(
    id: MentionId,
  ): Promise<Result<Snapshot<Mention>>>;
  deleteMention(id: MentionId): Promise<Result<Success>>;

  saveFolder(folder: Folder): Promise<Result<Success>>;
  getFolder(
    id: FolderId,
  ): Promise<Result<Snapshot<Folder>>>;
  deleteFolder(id: FolderId): Promise<Result<Success>>;

  savePermission(
    permission: Permission,
  ): Promise<Result<Success>>;
  getPermission(
    id: PermissionId,
  ): Promise<Result<Snapshot<Permission>>>;
  deletePermission(
    id: PermissionId,
  ): Promise<Result<Success>>;

  saveOrg(org: Org): Promise<Result<Success>>;
  getOrg(id: OrgId): Promise<Result<Snapshot<Org>>>;
  deleteOrg(id: OrgId): Promise<Result<Success>>;

  saveOrgMembership(
    orgMembership: OrgMembership,
  ): Promise<Result<Success>>;
  getOrgMembership(
    id: OrgMembershipId,
  ): Promise<Result<Snapshot<OrgMembership>>>;
  deleteOrgMembership(
    id: OrgMembershipId,
  ): Promise<Result<Success>>;

  saveTagging(tagging: Tagging): Promise<Result<Success>>;
  getTagging(
    id: TaggingId,
  ): Promise<Result<Snapshot<Tagging>>>;
  deleteTagging(id: TaggingId): Promise<Result<Success>>;

  saveCollection(
    collection: Collection,
  ): Promise<Result<Success>>;
  getCollection(
    id: CollectionId,
  ): Promise<Result<Snapshot<Collection>>>;
  deleteCollection(
    id: CollectionId,
  ): Promise<Result<Success>>;

  saveCollectionMembership(
    collectionMembership: CollectionMembership,
  ): Promise<Result<Success>>;
  getCollectionMembership(
    id: CollectionMembershipId,
  ): Promise<Result<Snapshot<CollectionMembership>>>;
  deleteCollectionMembership(
    id: CollectionMembershipId,
  ): Promise<Result<Success>>;

  saveCommit(commit: Commit): Promise<Result<Success>>;
  getCommit(id: CommitId): Promise<Result<Commit>>;
  deleteCommit(id: CommitId): Promise<Result<Success>>;

  saveMilestone(
    milestone: Milestone,
  ): Promise<Result<Success>>;
  getMilestone(id: MilestoneId): Promise<Result<Milestone>>;
  deleteMilestone(
    id: MilestoneId,
  ): Promise<Result<Success>>;

  saveDeployment(
    deployment: Deployment,
  ): Promise<Result<Success>>;
  getDeployment(
    id: DeploymentId,
  ): Promise<Result<Snapshot<Deployment>>>;
  deleteDeployment(
    id: DeploymentId,
  ): Promise<Result<Success>>;

  saveMergeRequest(
    mergeRequest: MergeRequest,
  ): Promise<Result<Success>>;
  getMergeRequest(
    id: MergeRequestId,
  ): Promise<Result<Snapshot<MergeRequest>>>;
  deleteMergeRequest(
    id: MergeRequestId,
  ): Promise<Result<Success>>;

  saveAnalyticsEvent(
    analyticsEvent: AnalyticsEvent,
  ): Promise<Result<Success>>;
  getAnalyticsEvent(
    id: AnalyticsEventId,
  ): Promise<Result<AnalyticsEvent>>;
  deleteAnalyticsEvent(
    id: AnalyticsEventId,
  ): Promise<Result<Success>>;

  saveMigrationStatus(
    migrationStatus: MigrationStatus,
  ): Promise<Result<Success>>;
  getMigrationStatus(
    id: MigrationStatusId,
  ): Promise<Result<Snapshot<MigrationStatus>>>;
  deleteMigrationStatus(
    id: MigrationStatusId,
  ): Promise<Result<Success>>;

  saveImageMetadata(
    imageMetadata: ImageMetadata,
  ): Promise<Result<Success>>;
  getImageMetadata(
    id: ImageId,
  ): Promise<Result<Snapshot<ImageMetadata>>>;
  deleteImageMetadata(
    id: ImageId,
  ): Promise<Result<Success>>;

  saveStoredImage(
    storedImage: StoredImage,
  ): Promise<Result<Success>>;
  getStoredImage(
    id: ImageHash,
  ): Promise<Result<StoredImage>>;
  deleteStoredImage(
    id: ImageHash,
  ): Promise<Result<Success>>;

  saveBetaProgramSignup(
    betaProgramSignup: BetaProgramSignup,
  ): Promise<Result<Success>>;
  getBetaProgramSignup(
    id: string,
  ): Promise<Result<BetaProgramSignup>>;
  deleteBetaProgramSignup(
    id: string,
  ): Promise<Result<Success>>;

  saveUser(user: User): Promise<Result<Success>>;
  getUser(id: UserId): Promise<Result<Snapshot<User>>>;
  deleteUser(id: UserId): Promise<Result<Success>>;

  saveAIEditMetadata(
    aiEditMetadata: AIEditMetadata,
  ): Promise<Result<Success>>;

  saveAPIKey(apiKey: APIKey): Promise<Result<Success>>;
  getAPIKey(id: APIKeyId): Promise<Result<APIKey>>;
  deleteAPIKey(id: APIKeyId): Promise<Result<Success>>;

  saveAPIKeyHash(
    apiKeyHash: APIKeyHash,
  ): Promise<Result<Success>>;
  getAPIKeyHash(id: APIKeyId): Promise<Result<APIKeyHash>>;
  deleteAPIKeyHash(id: APIKeyId): Promise<Result<Success>>;

  // TODO implement these backed by `pgvector` in Supabase
  // saveEmbedding(
  //   embedding: Embedding,
  // ): Promise<Result<Success>>;
  // getEmbedding(
  //   id: EmbeddingId,
  // ): Promise<Result<Snapshot<Embedding>>>;
  // deleteEmbedding(
  //   id: EmbeddingId,
  // ): Promise<Result<Success>>;

  // ***************************************************************
  // ******************** Non-CRUD Operations **********************
  // ***************************************************************
  getForks(
    id: VizId,
  ): Promise<Result<Array<Snapshot<Info>>>>;
  incrementForksCount(id: VizId): Promise<Result<Success>>;
  decrementForksCount(id: VizId): Promise<Result<Success>>;
  incrementUpvotesCount(
    id: VizId,
  ): Promise<Result<Success>>;
  decrementUpvotesCount(
    id: VizId,
  ): Promise<Result<Success>>;

  // getCommitAncestors
  //
  // Gets all commits from the primordial commit up to the given commit.
  // The returned array is in sorted order with to parent/child lineage.
  // The returned array always represents a non-branching chain of commits.
  // Applying all ops in the returned array can reconstruct the content.
  //
  // If `toNearestMilestone` is true, gets all commits from the nearest
  // commit ancestor with a milestone (instead of going all the way back
  // to the primordial commit). The first commit in the returned array
  // will either have a corresponding milestone or will be the primordial commit.
  // Usage: to reconstruct the viz content efficiently at any commit.
  //
  // If `start` is specified, the commit ancestors only go back to this
  // specific `start` commit. Neither the parent of `start` nor any of its
  // ancestors are included in the result if `start` is specified.
  getCommitAncestors(
    id: CommitId,
    toNearestMilestone?: boolean,
    start?: CommitId,
  ): Promise<Result<Array<Commit>>>;

  // getUserByEmails
  //
  // Gets the user that matches any of the given emails.
  getUserByEmails(
    emails: Array<EmailAddress>,
  ): Promise<Result<Snapshot<User>>>;

  // getUserByUserName
  //
  // Gets the user that matches the given userName.
  getUserByUserName(
    userName: UserName,
  ): Promise<Result<Snapshot<User>>>;

  // getFolderAncestors
  //
  // Gets the parent folders of the given folder.
  getFolderAncestors(
    id: FolderId,
  ): Promise<Result<Array<Folder>>>;

  // getPermissions
  //
  // Looks up the permissions that match the given user
  // and any of the given resources.
  getPermissions(
    // user can be null, in which case we look up permissions
    // across all users.
    user: UserId | null,
    resources: Array<ResourceId> | null,
  ): Promise<Result<Array<Snapshot<Permission>>>>;

  // getUpvotes
  //
  // Gets the upvotes that match the given user
  // and any of the given resources.
  getUpvotes(
    // user can be null, in which case we look up upvotes
    // across all users.
    user: UserId | null,
    resources: Array<ResourceId> | null,
  ): Promise<Result<Array<Snapshot<Upvote>>>>;

  // getInfos
  //
  // Gets all infos that match the given parameters, sorted by
  // the given sort order, and limited to the given page size and offset.
  getInfos({
    owner,
    forkedFrom,
    vizIds,
    sortField,
    pageNumber,
    sortOrder,
    includeTrashed,
    disablePagination,
    query,
    pageSize,
  }: {
    // owner
    //
    // Owner to filter by
    // Optional, useful for profile page
    // Works in conjunction with `forkedFrom`
    // If `owner` is specified, `vizIds` is ignored
    // Assumption, either owner or forkedFrom is specified, not both
    // TODO consider use case of specifying both - "Show my forks of this viz"
    //
    // Forks page menu options:
    // 1. Show all forks of this viz
    // 2. Show my forks of this viz
    owner?: UserId;

    // forkedFrom
    //
    // forkedFrom to filter by
    // Optional, useful for forks page
    // Works in conjunction with `owner`
    // If `forkedFrom` is specified, `vizIds` is ignored
    // Assumption, either owner or forkedFrom is specified, not both
    forkedFrom?: VizId;

    // vizIds
    //
    // VizIds to include in the results
    // Can be more than one page worth of IDs
    // `pageNumber` and `pageSize` are used to determine which IDs to fetch data for
    // Optional, useful for search results page
    // If this is specified, `owner` and `forkedFrom` are ignored.
    // Use cases: when we need to get infos from the primary database (e.g. MongoDB + ShareDB)
    // but based on similarity search using a different database technology (e.g. Redis or `pgvector`)
    // TODO add tests for this case
    vizIds?: Array<VizId>;

    // sortField
    //
    // The field to sort the results by.
    // Only respected if `owner` and/or `forkedFrom` is specified.
    // Inored if `vizIds` is specified, because the ordering is
    // determined by the order of the vizIds in the `vizIds` array.
    sortField?: SortField;

    // The page number to return, considering `pageSize` results per page.
    pageNumber?: number;

    // The order to sort the results by (ascending or descending).
    sortOrder?: SortOrder;

    // True if we want to only include trashed vizzes
    // in the results (for trash page).
    includeTrashed?: boolean;

    // Visibilities to include in the results.
    visibilities?: Array<Visibility> | null;

    // True if we want to disable pagination and return all results.
    disablePagination?: boolean;

    // This is the search query entered by the user
    // in the search box.
    query?: string;

    // An optional override for the page size.
    pageSize?: number;
  }): Promise<Result<Array<Snapshot<Info>>>>;

  // getInfoBySlug
  //
  // Gets the info that matches the given slug.
  getInfoByUserAndSlug({
    userId,
    slug,
  }: {
    userId: UserId;
    slug: string;
  }): Promise<Result<Snapshot<Info>>>;

  // getStaleInfoIds
  //
  // Gets the ids of a batch of infos whose popularity scores
  // are stale and need to be recomputed, or have never been computed.
  // batchSize defaults to 500
  getStaleInfoIds(
    batchSize?: number,
  ): Promise<Result<Array<VizId>>>;

  // getUsersByIds
  //
  // Gets all users that match the given ids.
  getUsersByIds(
    ids: Array<UserId>,
  ): Promise<Result<Array<Snapshot<User>>>>;

  // getUserIdByStripeCustomerId
  //
  // Gets the user id that matches the given stripeCustomerId.
  getUserIdByStripeCustomerId(
    stripeCustomerId: string,
  ): Promise<Result<UserId>>;

  // ***************************************************************
  // ******************** Embeddings & Supabase ********************
  // ***************************************************************

  // saveVizEmbedding
  //
  // Saves the embedding for the given viz.
  // This is backed by Postgres and `pgvector` in Supabase.
  // Also implemented in MemoryGateways for testing.
  saveVizEmbedding(
    vizEmbedding: VizEmbedding,
  ): Promise<Result<Success>>;

  // getVizEmbedding
  //
  // Gets the embedding for the given viz.
  getVizEmbedding(
    vizId: VizId,
  ): Promise<Result<VizEmbedding>>;

  // deleteVizEmbedding
  //
  // Deletes the embedding for the given viz.
  // This is backed by Postgres and `pgvector` in Supabase.
  // Also implemented in MemoryGateways for testing.
  deleteVizEmbedding(
    vizId: VizId,
  ): Promise<Result<Success>>;

  // knnVizEmbeddingSearch
  //
  // Gets the nearest neighbors of the given embedding.
  // This is backed by Postgres and `pgvector` in Supabase.
  // Also implemented in MemoryGateways for testing.
  knnVizEmbeddingSearch(
    embedding: Array<number>,
    k: number,
  ): Promise<Result<Array<VizId>>>;

  lock<T>(
    lockIds: Array<ResourceLockId>,
    // an async function that runs with the locks:
    fn: () => Promise<T>,
    // Optional lock duration in ms.
    // Defaults to 10 seconds.
    lockDuration?: number,
  ): Promise<T>;

  // Gets a list of users to power the typeahead search.
  // The query is a string that the user has typed so far,
  // which could be a partial username or full name.
  getUsersForTypeahead(
    query: string,
  ): Promise<Result<Array<User>>>;

  // Gets the comments for the given resource.
  getCommentsForResource(
    resource: VizId | MergeRequestId,
  ): Promise<Result<Array<Snapshot<Comment>>>>;

  // Gets the revision history for a viz.
  getRevisionHistoryCommitMetadata(
    vizId: VizId,
  ): Promise<Result<Array<CommitMetadata>>>;

  // Gets the API keys for the given user.
  getAPIKeys(
    userId: UserId,
  ): Promise<Result<Array<APIKey>>>;

  // Gets the API keys ID for the given hash.
  getAPIKeyIdFromHash(
    hash: string,
  ): Promise<Result<APIKeyId>>;

  // Gets the image keys for the given commit IDs.
  // If a given commit ID does not have an image key,
  // it will not be included in the result.
  getCommitImageKeys(
    commitIds: Array<CommitId>,
  ): Promise<Result<Array<CommitImageKey>>>;

  // Saves multiple commit image keys.
  saveCommitImageKeys(
    commitImageKeys: Array<CommitImageKey>,
  ): Promise<Result<Success>>;
}
