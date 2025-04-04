import { VizId } from '@vizhub/viz-types';
import { UserId } from './Users';
import { Timestamp, Markdown } from './common';

// MergeRequestId
//  * Unique identifier string for a merge request.
export type MergeRequestId = string;

// MergeRequest
// * Like a Pull Request
export interface MergeRequest {
  // The unique id of this merge request
  id: MergeRequestId;

  // source
  //  * Akin to the "source branch" in GitLab Merge Requests
  //  * Akin to the "compare branch" in GitHub Pull Requests
  //  * This viz contains the proposed changes
  //  * This merge request was created from this viz
  source: VizId;

  // target
  //  * Akin to the "target branch" in GitLab Merge Requests
  //  * Akin to the "base branch" in GitHub Pull Requests
  //  * This is the viz that the merge request will be merged into
  //  * When merged, a new commit will be added to this viz
  target: VizId;

  // description
  // * A description of this merge request
  description: Markdown;

  // author
  // * Who made this merge request
  author: UserId;

  // created
  // * When this merge request was created
  created: Timestamp;
}
