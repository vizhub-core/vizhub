import { Button } from '../bootstrap';
import { image } from '../image';
import './styles.scss';

export const UpgradeCallout = () => {
  return (
    <div className="upgrade-callout mb-3">
      <img src={image('upgrade-callout-feature')} />

      <div className="upgrade-callout-content">
        <h4>Upgrade to Premium</h4>
        <div className="vh-block-01">
          To create private visualizations, upgrade to the
          Premium plan. You'll also get access to other
          premium features including AI-assisted coding and
          real-time collaboration. If you have existing
          private visualizations, they will be read-only
          until you upgrade again.
        </div>
        <div className="upgrade-callout-buttons">
          <Button variant="secondary">
            Remind me Later
          </Button>
          <Button variant="primary" href="/pricing">
            Start Free Trial
          </Button>
        </div>{' '}
      </div>
    </div>
  );
};
