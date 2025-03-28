import { useEffect, useState } from 'react';
import { Spinner, VisibilityLabel } from '../../';
import { UpvoteWidget } from '../UpvoteWidget';
import { ForksWidget } from '../ForksWidget';
import './styles.scss';

function generatingImageSVGDataURL(width, height) {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
      <rect width='100%' height='100%' fill='white'/>
      <text
        x='50%' y='50%'
        dominant-baseline='middle'
        text-anchor='middle'
        font-size='10'
        fill='gray'
        font-family='sans-serif'
        opacity='0.7'>
        generating image...
      </text>
    </svg>
  `.trim();
  const encoded = encodeURIComponent(svg);
  return `data:image/svg+xml,${encoded}`;
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
  return (
    <a
      className={`vh-viz-preview${isHot ? ' hot-viz-preview' : ''}`}
      href={href}
      rel="noreferrer noopener"
    >
      <div className="thumbnail">
        <img
          className="thumbnail-image"
          src={thumbnailImageURL}
          alt={title}
        />
        <VisibilityLabel visibility={visibility} />
      </div>

      <div className="content-container">
        <h4 className="title">{title}</h4>
      </div>
      {(forksCount > 0 || upvotesCount > 0) && (
        <div className="analytics-container">
          {forksCount > 0 && (
            <ForksWidget
              forksCount={forksCount}
              notClickable={true}
            />
          )}
          {upvotesCount > 0 && (
            <UpvoteWidget
              upvotesCount={upvotesCount}
              isUpvoted={false}
              notClickable={true}
            />
          )}
        </div>
      )}

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
    </a>
  );
};
