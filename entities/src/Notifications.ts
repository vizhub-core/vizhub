import { Timestamp, UserId, VizId } from '.';

// NotificationId
//  * Unique identifier string for a notification.
export type NotificationId = string;

// NotificationType
//  * Enum for different types of notifications.
//  * 'CommentOnYourViz': Notification for when someone comments on your viz.
//  * 'CommentOnWatchedViz': Notification for when someone comments on a viz that you commented on previously (you are "watching" the conversation).
//  * 'Mention': Notification for when someone @-mentions you in a comment.
export enum NotificationType {
  CommentOnYourViz = 'commentOnYourViz',
  CommentOnWatchedViz = 'commentOnWatchedViz',
  Mention = 'mention',
}

// Notification
//  * Represents a notification sent to a user regarding their Viz or a conversation they are watching.
//  * Notifications can be of various types, such as new comments on their Viz, new comments in a watched conversation, or mentions in comments.
//  * This interface provides a structured way to track and manage these notifications.
export interface Notification {
  // A unique identifier for the notification.
  id: NotificationId;

  // The type of notification, as defined in the NotificationType enum.
  type: NotificationType;

  // The user who is the recipient of the notification.
  user: UserId;

  // The Viz associated with the notification.
  viz: VizId;

  // The timestamp when the notification was created.
  created: Timestamp;

  // Indicates whether the notification has been read by the user.
  read: boolean;
}
