// An identifier used to lock a resource for critical sections.
// For vizzes, the entire viz can be locked with
// an id of the form `viz:${vizId}`.
import { EntityName, UserId, VizId } from '.';

// The same pattern holds for other entities.
export type ResourceLockId = string;

// Locks a specific entity.
export const entityLock = (
  entityName: EntityName,
  entityId: string,
): ResourceLockId => `${entityName}:${entityId}`;

// Locks a specific entity for saving only.
export const saveLock = (
  entityName: EntityName,
  entityId: string,
): ResourceLockId =>
  `save-${entityLock(entityName, entityId)}`;

// Lock for Info documents.
export const infoLock = (vizId: VizId): ResourceLockId =>
  entityLock('Info', vizId);

// Lock for User documents.
export const userLock = (userId: UserId): ResourceLockId =>
  entityLock('User', userId);

// Lock for AnalyticsEvent documents.
export const analyticsEventLock: ResourceLockId =
  entityLock('AnalyticsEvent', 'any');

// Lock for ImageMetadata documents.
export const imageMetadataLock = (
  imageId: string,
): ResourceLockId => entityLock('ImageMetadata', imageId);
