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
          // src={`https://vizhub.com/${userName}/${vizIdOrSlug}?edit`}
          src={`http://localhost:5173/${userName}/${vizIdOrSlug}`}
          width="100%"
          height="800"
          scrolling="no"
          frameBorder="no"
        ></iframe>
      </div>
    </div>
  );
};