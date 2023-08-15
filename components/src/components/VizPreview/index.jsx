import { UpvoteWidget } from '../UpvoteWidget';
import './styles.scss';

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
}) => {
  return (
    <a
      className="vh-viz-preview"
      href={href}
      rel="noreferrer noopener"
    >
      <div
        className="thumbnail"
        style={{
          backgroundImage: `url("${thumbnailImageURL}")`,
        }}
        alt={title}
      ></div>
      <div className="content-container">
        <div className="last-updated-date">
          {lastUpdatedDateFormatted}
        </div>
        <div className="title">{title}</div>
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
      </div>
    </a>
  );
};
