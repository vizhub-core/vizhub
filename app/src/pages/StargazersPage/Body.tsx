import { StargazersPageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';

export const Body = ({
  renderStargazers,
  starredVizTitle,
  starredVizHref,
}: {
  renderStargazers: () => JSX.Element;
  starredVizTitle: string;
  starredVizHref: string;
}) => {
  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <StargazersPageBody
        renderStargazers={renderStargazers}
        starredVizTitle={starredVizTitle}
        starredVizHref={starredVizHref}
      />
    </div>
  );
};
