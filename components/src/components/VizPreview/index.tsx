import { useEffect, useState } from 'react';
import { Spinner } from '../../';
import { UpvoteWidget } from '../UpvoteWidget';
import { ForksWidget } from '../ForksWidget';
import { PrivateSVG } from '../Icons/sam/PrivateSVG';
import './styles.scss';

// If we're in thr browser
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
if (typeof window !== 'undefined') {
  // Reusable canvas for drawing images.
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');
}

// Shows a preview of a viz.
// See also
// archive/vizhub-v3-false-start/src/App/VizPreview.js
export const VizPreview = ({
  title,
  thumbnailImageURL,
  lastUpdatedDateFormatted,
  ownerName,
  ownerAvatarURL,
  href,
  upvotesCount,
  forksCount,
  visibility,
  isHot,
}) => {
  // Data URL for the thumbnail image, or null if not yet loaded.
  const [backgroundImage, setBackgroundImage] = useState<
    string | null
  >(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    setIsImageLoaded(false);
    const image = new Image();
    image.src = thumbnailImageURL;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      const dataURL = canvas.toDataURL();
      setBackgroundImage(`url("${dataURL}")`);
      setIsImageLoaded(true);
    };
  }, [thumbnailImageURL]);

  return (
    <a
      className={`vh-viz-preview${isHot ? ' hot-viz-preview' : ''}`}
      href={href}
      rel="noreferrer noopener"
    >
      <div
        className="thumbnail"
        style={{ backgroundImage }}
      >
        {isImageLoaded ? null : (
          <div className="thumbnail-spinner">
            <Spinner />
          </div>
        )}
      </div>

      <div className="content-container">
        <h4 className="title">{title}</h4>
      </div>
      <div className="analytics-container">
        <ForksWidget
          forksCount={forksCount}
          notClickable={true}
        />
        <UpvoteWidget
          upvotesCount={upvotesCount}
          isUpvoted={false}
          notClickable={true}
        />
      </div>

      <div className="meta-container">
        <div className="owner">
          <img
            className="owner-avatar-image"
            src={ownerAvatarURL}
            alt={ownerName}
          />
          <div className="owner-meta">
            <div className="owner-name">{ownerName}</div>
            <div className="last-updated-date">
              {lastUpdatedDateFormatted}
            </div>
          </div>
        </div>
      </div>
      {visibility === 'private' && (
        <div className="private-notice">
          PRIVATE
          <PrivateSVG />
        </div>
      )}
    </a>
  );
};
