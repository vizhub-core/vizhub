import { ExclamationTriangle } from '../Icons/sam/ExclamationTriangle';
import { PlanBrandPremiumSVG } from '../Icons/sam/PlanBrandPremiumSVG';
import { XSVG } from '../Icons/sam/XSVG';
import { Button } from '../bootstrap';
import './styles.scss';

export const VizPageUpgradeBanner = ({ onClose }) => {
  return (
    <div className="vh-viz-page-upgrade-banner">
      <div className="side vh-base-01 vh-color-neutral-03">
        <ExclamationTriangle />
        Your visualizations are currently visible to
        everyone in the VizHub Community
      </div>
      <div className="side vh-base-01 vh-color-neutral-03">
        <PlanBrandPremiumSVG />
        Upgrade now to create Private Vizzes
        <Button
          as="a"
          variant="secondary"
          href="/pricing"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: -4, marginLeft: 16 }}
        >
          Try it for free
        </Button>
        <i className="icon-button" onClick={onClose}>
          <XSVG />
        </i>
      </div>
    </div>
  );
};
