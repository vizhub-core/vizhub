import { Button } from '../bootstrap';
import { RectangleStackSVG } from '../Icons/sam/RectangleStackSVG';
import './styles.scss';

export const VizPageVersionBanner = ({
  commitTimestampFormatted,
}) => {
  return (
    <div className="vh-viz-page-version-banner">
      <div className="side vh-base-01 vh-color-neutral-02 public-vizzes-note">
        <RectangleStackSVG />
        <span className="d-none d-lg-inline">
          You are viewing a previous version of this viz,
          from {commitTimestampFormatted}
        </span>
      </div>
      <div className="side vh-base-01 vh-color-neutral-02">
        {/* <span className="d-none d-lg-inline">
          Upgrade to create private vizzes
        </span> */}
        <span className="d-inline d-lg-none"></span>
        <Button variant="primary" disabled>
          Restore to this version (coming soon!)
        </Button>
      </div>
    </div>
  );
};
