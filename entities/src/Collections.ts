import { FolderId } from './Folders';
import { UserId } from './Users';
import { OrgId } from './Orgs';
import { CommitId } from './RevisionHistory';
import { Markdown } from './common';
import { VizId } from '@vizhub/viz-types';

// CollectionId
//  * Unique identifier string for a collection.
export type CollectionId = string;

// Collection
export interface Collection {
  id: CollectionId;
  owner: UserId | OrgId;
  folder: FolderId;
  name: string;
  description: Markdown;
}

// CollectionMembershipId
//  * Unique identifier string for a CollectionMembershipId.
export type CollectionMembershipId = string;

// CollectionMembership
export interface CollectionMembership {
  id: CollectionMembershipId;
  viz: VizId;
  order: number;
  commit?: CommitId;
}
