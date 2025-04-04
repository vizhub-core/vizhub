import { ImageKey } from 'screenshotgenie';
import { CommitId } from './RevisionHistory';

// The width in pixels of the thumbnail image
export const thumbnailWidth = 300;

// Stores the mapping from commit id
// to Screenshot Genie image key
export interface CommitImageKey {
  commitId: CommitId;
  imageKey: ImageKey;
}
