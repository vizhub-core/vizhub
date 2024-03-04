import { Timestamp, UserId, VizId } from '.';

// APIKeyId
//  * Unique identifier string for an API key.
export type APIKeyId = string;

// APIKeyPermission
//  * Enum for different types of API key permissions.
//  * 'ReadAllPrivateVizzes': Permission to read all private vizzes in a user's account.
//  * 'WriteAllPrivateVizzes': Permission to write to all private vizzes in a user's account.
//  * 'ReadSpecificViz': Permission to read a specific viz.
//  * 'WriteSpecificViz': Permission to write to a specific viz.
export enum APIKeyPermission {
  ReadAllPrivateVizzes = 'read_all_private_vizzes',
  WriteAllPrivateVizzes = 'write_all_private_vizzes',
  ReadSpecificViz = 'read_specific_viz',
  WriteSpecificViz = 'write_specific_viz',
}

// APIKey
//  * Represents an API key and its associated metadata.
//  * Includes information such as the key's owner, creation date, status, and permissions.
export interface APIKey {
  // A unique identifier for the API key.
  id: APIKeyId;

  // The user or organization that owns this API key.
  owner: UserId;

  // When this API key was created.
  created: Timestamp;

  // When this API key was last used.
  // Undefined if the key has not been used yet.
  lastUsed?: Timestamp;

  // A human-readable name or description for this API key.
  // Optional field for better organization and management of API keys.
  description?: string;

  // The status of this API key (e.g., active, revoked).
  // Allows for control over the API key's usability.
  status: 'active' | 'revoked';

  // A singular API key permissions associated with this API key.
  // Defines what actions the API key is authorized to perform.
  permission: APIKeyPermission;

  // Optional viz ID for permissions that apply to a specific viz.
  // Undefined for permissions that apply to all vizzes.
  vizId?: VizId;

  // The number of times this API key has been used.
  // Useful for tracking and limiting usage.
  usageCount: number;
}
