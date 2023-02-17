import { VizId } from './Viz';
import { UserId } from './Users';
import { FolderId } from './Folders';
import { Timestamp } from './common';

// Role
//  * Access levels for users
export type Role = 'admin' | 'editor' | 'viewer';

// PermissionId
//  * Unique identifier string for a Permission.
export type PermissionId = string;

// Permission
//  * A role granted to a user for a resource
export interface Permission {
  id: PermissionId;

  // The user that was granted the permission
  user: UserId;

  // The resource the permission is on
  resource: VizId | FolderId;

  // The role of this permission
  role: Role;

  // When this role was granted
  timestamp: Timestamp;

  // Who granted this role
  grantedBy: UserId;
}
