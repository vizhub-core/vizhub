import './styles.scss';

export const StargazersPageBody = ({
  // A function that renders the stargazers.
  renderStargazers,

  // The title of the viz that was starred.
  starredVizTitle,

  // The href to the viz that was starred.
  starredVizHref,
}) => {
  return (
    <div className="vh-page vh-explore-page">
      <div className="vh-page-container">
        <div className="vh-page-header">
          <h1 className="mb-0">
            Stargazers of{' '}
            <a href={starredVizHref}>{starredVizTitle}</a>
          </h1>
        </div>
        <div className="stargazers-container">
          {renderStargazers()}
        </div>
      </div>
    </div>
  );
};
