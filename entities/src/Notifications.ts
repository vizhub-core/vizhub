import { VizId } from '@vizhub/viz-types';
import {
  CommentId,
  MergeRequestId,
  Timestamp,
  User,
  UserId,
  Comment,
} from '.';

// NotificationId
//  * Unique identifier string for a notification.
export type VizNotificationId = string;

// NotificationType
//  * Enum for different types of notifications.
//  * 'CommentOnYourViz': Notification for when someone comments on your viz.
//  * 'CommentOnWatchedViz': Notification for when someone comments on a viz
//     that you commented on previously (you are "watching" the conversation).
//  * 'Mention': Notification for when someone @-mentions you in a comment.
export enum VizNotificationType {
  CommentOnYourViz = 'commentOnYourViz',
  // CommentOnWatchedViz = 'commentOnWatchedViz',
  Mention = 'mention',
  CommentOnYourMergeRequest = 'commentOnYourMergeRequest',
}

// Notification
//  * Represents a notification sent to a user regarding their Viz or a conversation they are watching.
//  * Notifications can be of various types, such as new comments on their Viz, new comments in a watched conversation, or mentions in comments.
//  * This interface provides a structured way to track and manage these notifications.
export interface VizNotification {
  // A unique identifier for the notification.
  id: VizNotificationId;

  // The type of notification, as defined in the NotificationType enum.
  type: VizNotificationType;

  // The user who is the recipient of the notification.
  user: UserId;

  // The Viz associated with the notification.
  resource: VizId | MergeRequestId;

  // The timestamp when the notification was created.
  created: Timestamp;

  // Indicates whether the notification has been read by the user.
  read: boolean;

  // The id of the comment that caused the notification to be created
  commentId?: CommentId;
}

export type VizNotificationRequestResult = {
  notifications: Array<VizNotification>;
  comments: { [key: CommentId]: Comment };
  commentAuthors: { [key: UserId]: string };
  commentAuthorImages: { [key: UserId]: string };
  resourceTitles: { [key: VizId]: string };
  resourceOwnerUsernames: { [key: UserId]: string };
  resourceOwners: { [key: VizId]: UserId };
};
