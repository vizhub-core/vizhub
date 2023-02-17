import { UserId } from './Users';
import { Timestamp } from './common';

// OrgId
//  * Unique identifier string for an organization.
export type OrgId = string;

// OrgName
//  * Similar to UserName but for orgs
//  * Used in URLs like `https://vizhub.com/${orgName}`
export type OrgName = string;

// Org
//  * An organization
export interface Org {
  // The unique id of this organization
  id: OrgId;

  // The "username" of this organization
  orgName: OrgName;

  // The human readable display name for this org
  displayName: string;
}

// OrgMembershipId
//  * Unique identifier string for an org membership.
export type OrgMembershipId = string;

// OrgMembership
//  * Represents a user being part of an org
export interface OrgMembership {
  id: OrgMembershipId;

  // The user who is a member of the org
  user: UserId;

  // The org they are a member of
  org: OrgId;

  // When they were added to the org
  timestamp: Timestamp;

  // By whom they were added
  addedBy?: UserId;
}
