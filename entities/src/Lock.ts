// An identifier used to lock a resource for critical sections.
// For vizzes, the entire viz can be locked with
// an id of the form `viz:${vizId}`.
import { CommitId, VizId } from '.';

// The same pattern holds for other entities.
export type ResourceLockId = string;

export const vizLock = (vizId: VizId): ResourceLockId =>
  `viz:${vizId}`;
