import { CloseSVG } from 'vzcode';
import { ExclamationTriangle } from '../Icons/sam/ExclamationTriangle';
import { PlanBrandPremiumSVG } from '../Icons/sam/PlanBrandPremiumSVG';
import { Button } from '../bootstrap';
import './styles.scss';

export const VizPageUpgradeBanner = ({ onClose }) => {
  return (
    <div className="vh-viz-page-upgrade-banner">
      <div className="side vh-base-01 vh-color-neutral-03 public-vizzes-note">
        <ExclamationTriangle />
        <span className="d-none d-lg-inline">
          Your visualizations are currently visible to
          everyone
        </span>
        <span className="d-inline d-lg-none">
          Your vizzes are public
        </span>
      </div>
      <div className="side vh-base-01 vh-color-neutral-03">
        <PlanBrandPremiumSVG />
        <span className="d-none d-lg-inline">
          Upgrade to create private vizzes
        </span>
        <span className="d-inline d-lg-none">
          Upgrade for privacy
        </span>
        <Button
          as="a"
          variant="secondary"
          href="/pricing?utm_source=viz_page_upgrade_banner&utm_medium=web&utm_campaign=upgrade_banner"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: -4, marginLeft: 16 }}
        >
          Try it for free
        </Button>
        <i
          className="icon-button icon-button-light"
          onClick={onClose}
          style={{ color: '#D42A68' }}
        >
          <CloseSVG />
        </i>
      </div>
    </div>
  );
};
