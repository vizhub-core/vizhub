import { useEffect, useState } from 'react';
import { Spinner } from '../..';
import { UpvoteWidget } from '../UpvoteWidget';
import { ForksWidget } from '../ForksWidget';
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
      className="vh-viz-preview"
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
        <div className="title">{title}</div>
        <div className="last-updated-date">
          {lastUpdatedDateFormatted}
        </div>
      </div>
      <div className="meta-container">
        <div className="owner">
          <img
            className="owner-avatar-image"
            src={ownerAvatarURL}
            alt={ownerName}
          />

          <div className="owner-name">{ownerName}</div>
        </div>
        <UpvoteWidget upvotesCount={upvotesCount} />
        <ForksWidget forksCount={forksCount} />
      </div>
    </a>
  );
};
