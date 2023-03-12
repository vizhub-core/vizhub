import PropTypes from 'prop-types';

// Shows a preview of a viz.
// See also
// archive/vizhub-v3-false-start/src/App/VizPreview.js
export const VizPreview = ({
  title,
  thumbnailImageURL,
  lastUpdatedDateFormatted,
  ownerName,
  ownerAvatarURL,
  onClick,
}) => {
  // Verified useMemo optimizations 3/19/22.
  // To verify, uncomment the following line and make sure re-renders
  // don't happen for each and every VizPreview when query results change.
  // console.log('rendering VizPreview');

  return (
    <div className="viz-preview" onClick={onClick}>
      <div
        className="thumbnail"
        style={{
          backgroundImage: `url("${thumbnailImageURL}")`,
        }}
        alt={title}
      ></div>
      <div className="content-container">
        <div className="last-updated-date">{lastUpdatedDateFormatted}</div>
        <div className="title">{title}</div>
      </div>
      <div className="meta-container">
        {ownerName ? (
          <>
            <img
              className="owner-avatar-image"
              src={ownerAvatarURL}
              alt={ownerName}
            />
            <div className="owner-name">{ownerName}</div>
          </>
        ) : null}
      </div>
    </div>
  );
};

VizPreview.propTypes = {
  onClick: PropTypes.func.isRequired,
};
