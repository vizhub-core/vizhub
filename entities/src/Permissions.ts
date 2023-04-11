import { VizId } from './Viz';
import { UserId } from './Users';
import { FolderId } from './Folders';
import { Timestamp } from './common';

// Role
//  * Access levels for users
export type Role = 'admin' | 'editor' | 'viewer';
export const ADMIN: Role = 'admin';
export const EDITOR: Role = 'editor';
export const VIEWER: Role = 'viewer';

// Action
//  * Specific actions a user may or may not be allowed to perform.
export type Action = 'read'|'write'|'delete';
export const READ: Action = 'read';
export const WRITE: Action = 'write';
export const DELETE: Action = 'delete';

// Permissions matrix implemented in interactors:
//          READ    WRITE    DELETE
// VIEWER    X
// EDITOR    X        X
// ADMIN     X        X        X

// PermissionId
//  * Unique identifier string for a Permission.
export type PermissionId = string;

// A viz or a folder are considered "resources".
export type ResourceId = VizId | FolderId;

// Permission
//  * A role granted to a user for a resource
export interface Permission {
  id: PermissionId;

  // The user that was granted the permission
  user: UserId;

  // The resource the permission is on
  resource: ResourceId;

  // The role of this permission
  role: Role;

  // When this role was granted
  timestamp: Timestamp;

  // Who granted this role
  grantedBy: UserId;
}
