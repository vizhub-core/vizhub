import { UserId } from './Users';
import { OrgId } from './Orgs';
import { Visibility } from './common';

// FolderId
//  * Unique identifier string for a Folder.
export type FolderId = string;

// Folder
//  * A container with waterfall permissions
export interface Folder {
  // The unique id of the folder
  id: FolderId;

  // The name of this folder
  name: string;

  // The parent folder, if not a top-level folder
  parent?: FolderId;

  // The owner of this folder
  owner: UserId | OrgId;

  // Who can see this folder
  visibility: Visibility;
}
