import { PrivateSVG } from '../Icons/sam/PrivateSVG';
import { UnlistedSVG } from '../Icons/sam/UnlistedSVG';
import './styles.scss';

// The visibility label for a viz.
// Used in the VizPreview and VizPageViewer components.
export const VisibilityLabel = ({ visibility }) => (
  <>
    {visibility === 'private' && (
      <div className="visibility-label private">
        PRIVATE
        <PrivateSVG />
      </div>
    )}
    {visibility === 'unlisted' && (
      <div className="visibility-label unlisted">
        UNLISTED
        <UnlistedSVG />
      </div>
    )}
  </>
);
