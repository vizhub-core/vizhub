import { Button } from '../bootstrap';
import { image } from '../image';
import './styles.scss';

export const UpgradeCallout = ({
  showImage = true,
  imageSrc = image('upgrade-callout-feature'),
  isVertical = false,
  children = null,
  topMargin = false,
}) => {
  return (
    <div
      className={`upgrade-callout mb-3 ${
        isVertical ? 'upgrade-callout-vertical' : ''
      }${topMargin ? ' mt-3' : ''}`}
    >
      {showImage && (
        <img src={imageSrc} alt="Upgrade Callout Feature" />
      )}

      <div className="upgrade-callout-content">
        <h4>Upgrade to Premium</h4>
        <div className="vh-block-01">{children}</div>
        <div className="upgrade-callout-buttons">
          {/* <Button variant="secondary">
            Remind me Later
          </Button> */}
          <Button variant="primary" href="/pricing">
            Start Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
};
