import { VizId } from './Viz';
import { UserId } from './Users';
import { MergeRequestId } from './MergeRequests';
import { Timestamp, Markdown } from './common';

// CommentId
//  * Unique identifier string for a comment.
export type CommentId = string;

// A comment on a viz.
export interface Comment {
  // Unique id of this Comment
  id: CommentId;

  // Who authored the comment
  author: UserId;

  // The resource the comment is on
  resource: VizId | MergeRequestId;

  // When this comment was created
  created: Timestamp;

  // The body content of this comment
  markdown: Markdown;
}

// MentionId
//  * Unique identifier string for a mention.
export type MentionId = string;

// A mention in a comment.
export interface Mention {
  id: MentionId;

  // The comment the mention occurred in
  comment: CommentId;

  // The user that was mentioned
  mentionedUser: UserId;
}
