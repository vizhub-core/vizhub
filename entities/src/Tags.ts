import { UserId } from './Users';
import { VizId } from './Viz';
import { Timestamp } from './common';

// TaggingId
//  * Unique identifier string for a Tagging.
export type TaggingId = string;

// Tagging
//  * An association of a tag to a viz
export interface Tagging {
  id: TaggingId;

  // The tag itself
  tag: string;

  // The viz that the tag is associated to
  viz: VizId;

  // When this tag was added
  timestamp: Timestamp;

  // By whom this tag was added
  addedBy: UserId;
}
