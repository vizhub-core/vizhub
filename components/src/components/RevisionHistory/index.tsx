import { Spinner } from '../Spinner';
import { Commit } from 'entities';
import './styles.scss';

export const RevisionHistory = ({
  revisionHistoryCommits,
}: {
  revisionHistoryCommits: Array<Commit>;
}) => {
  return (
    <div className="vh-revision-history">
      <Spinner />
    </div>
  );
};
