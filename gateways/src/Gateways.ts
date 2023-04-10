import {
  VizId,
  Snapshot,
  Info,
  Content,
  User,
  UserId,
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
} from 'entities';
import { Result, Success } from './Result';

export interface Gateways {
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
  //    https://share.github.io/sharedb/api/doc#ingestsnapshot
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
  getUpvote(id: UpvoteId): Promise<Result<Snapshot<Upvote>>>;
  deleteUpvote(id: UpvoteId): Promise<Result<Success>>;

  saveVizAuthorship(vizAuthorship: VizAuthorship): Promise<Result<Success>>;
  getVizAuthorship(
    id: VizAuthorshipId
  ): Promise<Result<Snapshot<VizAuthorship>>>;
  deleteVizAuthorship(id: VizAuthorshipId): Promise<Result<Success>>;

  saveComment(comment: Comment): Promise<Result<Success>>;
  getComment(id: CommentId): Promise<Result<Snapshot<Comment>>>;
  deleteComment(id: CommentId): Promise<Result<Success>>;

  saveMention(mention: Mention): Promise<Result<Success>>;
  getMention(id: MentionId): Promise<Result<Snapshot<Mention>>>;
  deleteMention(id: MentionId): Promise<Result<Success>>;

  saveFolder(folder: Folder): Promise<Result<Success>>;
  getFolder(id: FolderId): Promise<Result<Snapshot<Folder>>>;
  deleteFolder(id: FolderId): Promise<Result<Success>>;

  savePermission(permission: Permission): Promise<Result<Success>>;
  getPermission(id: PermissionId): Promise<Result<Snapshot<Permission>>>;
  deletePermission(id: PermissionId): Promise<Result<Success>>;

  saveOrg(org: Org): Promise<Result<Success>>;
  getOrg(id: OrgId): Promise<Result<Snapshot<Org>>>;
  deleteOrg(id: OrgId): Promise<Result<Success>>;

  saveOrgMembership(orgMembership: OrgMembership): Promise<Result<Success>>;
  getOrgMembership(
    id: OrgMembershipId
  ): Promise<Result<Snapshot<OrgMembership>>>;
  deleteOrgMembership(id: OrgMembershipId): Promise<Result<Success>>;

  saveTagging(tagging: Tagging): Promise<Result<Success>>;
  getTagging(id: TaggingId): Promise<Result<Snapshot<Tagging>>>;
  deleteTagging(id: TaggingId): Promise<Result<Success>>;

  saveCollection(collection: Collection): Promise<Result<Success>>;
  getCollection(id: CollectionId): Promise<Result<Snapshot<Collection>>>;
  deleteCollection(id: CollectionId): Promise<Result<Success>>;

  saveCollectionMembership(
    collectionMembership: CollectionMembership
  ): Promise<Result<Success>>;
  getCollectionMembership(
    id: CollectionMembershipId
  ): Promise<Result<Snapshot<CollectionMembership>>>;
  deleteCollectionMembership(
    id: CollectionMembershipId
  ): Promise<Result<Success>>;

  saveCommit(commit: Commit): Promise<Result<Success>>;
  getCommit(id: CommitId): Promise<Result<Commit>>;
  deleteCommit(id: CommitId): Promise<Result<Success>>;

  saveMilestone(milestone: Milestone): Promise<Result<Success>>;
  getMilestone(id: MilestoneId): Promise<Result<Milestone>>;
  deleteMilestone(id: MilestoneId): Promise<Result<Success>>;

  saveDeployment(deployment: Deployment): Promise<Result<Success>>;
  getDeployment(id: DeploymentId): Promise<Result<Snapshot<Deployment>>>;
  deleteDeployment(id: DeploymentId): Promise<Result<Success>>;

  saveMergeRequest(mergeRequest: MergeRequest): Promise<Result<Success>>;
  getMergeRequest(id: MergeRequestId): Promise<Result<Snapshot<MergeRequest>>>;
  deleteMergeRequest(id: MergeRequestId): Promise<Result<Success>>;

  saveAnalyticsEvent(analyticsEvent: AnalyticsEvent): Promise<Result<Success>>;
  getAnalyticsEvent(id: AnalyticsEventId): Promise<Result<AnalyticsEvent>>;
  deleteAnalyticsEvent(id: AnalyticsEventId): Promise<Result<Success>>;

  // ***************************************************************
  // ******************** Non-CRUD Operations **********************
  // ***************************************************************
  getForks(id: VizId): Promise<Result<Array<Snapshot<Info>>>>;
  incrementForksCount(id: VizId): Promise<Result<Success>>;
  decrementForksCount(id: VizId): Promise<Result<Success>>;
  incrementUpvotesCount(id: VizId): Promise<Result<Success>>;
  decrementUpvotesCount(id: VizId): Promise<Result<Success>>;

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
    start?: CommitId
  ): Promise<Result<Array<Commit>>>;

  // getUserByEmails
  //
  // Gets the user that matches any of the given emails.
  getUserByEmails(emails: Array<EmailAddress>): Promise<Result<Snapshot<User>>>;

  // getFolderAncestors
  //
  // Gets the parent folders of the given folder.
  getFolderAncestors(id: FolderId): Promise<Result<Array<Folder>>>;

  // getPermissions
  //
  // Looks up the permissions that match the given user
  // and any of the given resources.
  getPermissions(
    user: User,
    resources: Array<ResourceId>
  ): Promise<Result<Array<Snapshot<Permission>>>>;
}
