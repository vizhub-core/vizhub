import { Spinner } from '../Spinner';
import { CommitMetadata, RevisionHistory } from 'entities';
import './styles.scss';

const revisionThumbnailWidth = 100;

export const RevisionHistoryNavigator = ({
  revisionHistory,
}: {
  revisionHistory: RevisionHistory | null;
}) => {
  return (
    <div className="vh-revision-history">
      {revisionHistory ? (
        revisionHistory.commitMetadatas.map(
          (commitMetadata: CommitMetadata) => (
            <img
              src={`/api/viz-thumbnail/${commitMetadata.id}-${revisionThumbnailWidth}.png`}
            />
          ),
        )
      ) : (
        <Spinner />
      )}
    </div>
  );
};
