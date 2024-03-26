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
  ReadAllVizzes = 'read_all_vizzes',
  WriteAllVizzes = 'write_all_vizzes',
  ReadSpecificViz = 'read_specific_viz',
  WriteSpecificViz = 'write_specific_viz',
}

// APIKey
//  * Represents an API key and its associated metadata.
//  * Includes information such as the key's owner, creation date, status, and permissions.
export interface APIKey {
  // A unique identifier for the API key.
  // Note: This is not the actual API key itself.
  // It's just an id that links the `APIKey` (metadata)
  // to the actual hashed API key value `APIKeyHash`.
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

// APIKeyHash
//  * Represents the hashed value of an API key.
//  * Used for secure storage and comparison of API key values.
export interface APIKeyHash {
  // A unique identifier for the API key.
  // Note: This is not the actual API key itself.
  // It's just an id that links the `APIKey` (metadata)
  // to the actual hashed API key value `APIKeyHash`.
  id: APIKeyId;

  // The hashed value of the API key.
  // Used for secure storage and comparison of API key values.
  // Computed using a secure one-way hashing algorithm.
  // Example implementation:
  //   import crypto from 'crypto';
  //   export const computeHash = (apiKey: string): string => {
  //     return crypto.createHash('sha256').update(apiKey).digest('hex');
  //   };
  hash: string;
}
