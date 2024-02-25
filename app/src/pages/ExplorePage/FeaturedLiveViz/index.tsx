import './styles.scss';

export const FeaturedLiveViz = ({
  userName,
  vizIdOrSlug,
}) => {
  return (
    <div className="featured-live-viz">
      <div className="featured-live-viz-content">
        <h2>Latest Viz</h2>
        <iframe
          src={`https://vizhub.com/${userName}/${vizIdOrSlug}?edit=files`}
          // src={`http://localhost:5173/${userName}/${vizIdOrSlug}?edit=files`}
          width="100%"
          height="780"
          scrolling="no"
          frameBorder="no"
        ></iframe>
      </div>
    </div>
  );
};
