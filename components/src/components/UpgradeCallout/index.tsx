import { FeatureId } from 'entities';
import { Button } from '../bootstrap';
import { image } from '../image';
import './styles.scss';

export const UpgradeCallout = ({
  featureId,
  showImage = true,
  imageSrc = image('upgrade-callout-feature'),
  isVideo = false,
  isVertical = false,
  isInline = false,
  children = null,
  topMargin = false,
  bottomMargin = false,
  includeHeader = true,
}: {
  featureId: FeatureId;
  showImage?: boolean;
  imageSrc?: string;
  isVideo?: boolean;
  isVertical?: boolean;
  isInline?: boolean;
  children?: React.ReactNode;
  topMargin?: boolean;
  bottomMargin?: boolean;
  includeHeader?: boolean;
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
          <Button
            variant="primary"
            href={`/pricing?feature=${featureId}`}
            target="_blank"
            rel="noreferrer"
          >
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
};
