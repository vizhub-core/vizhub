import { Button } from '../bootstrap';
import { image } from '../image';
import './styles.scss';

export const UpgradeCallout = ({
  showImage = true,
  imageSrc = image('upgrade-callout-feature'),
  isVideo = false,
  isVertical = false,
  isInline = false,
  children = null,
  topMargin = false,
  bottomMargin = false,
  includeHeader = true,
}) => {
  return (
    <div
      className={`upgrade-callout ${
        isVertical ? 'upgrade-callout-vertical' : ''
      }${topMargin ? ' mt-3' : ''}${bottomMargin ? ' mb-3' : ''}${
        isInline ? ' upgrade-callout-inline' : ''
      }`}
    >
      {showImage && isVideo ? (
        <video autoPlay loop muted playsInline>
          <source src={imageSrc} type="video/mp4" />
        </video>
      ) : (
        <img src={imageSrc} alt="Upgrade Callout Feature" />
      )}

      <div className="upgrade-callout-content">
        {includeHeader && <h4>Upgrade to Premium</h4>}
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
