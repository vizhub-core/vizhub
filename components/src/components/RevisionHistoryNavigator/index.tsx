import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { stratify } from 'd3-hierarchy';
import {
  CommitMetadata,
  Info,
  RevisionHistory,
} from 'entities';
import { Spinner } from '../Spinner';
import './styles.scss';

const revisionThumbnailWidth = 100;

// interface CommitMetadata {
//   id: CommitId;
//   parent?: CommitId;
// }
const Body = ({
  revisionHistory,
  size,
  info,
}: {
  revisionHistory: RevisionHistory | null;
  size: {
    width: number;
    height: number;
  };
  info: Info;
}) => {
  const { width, height } = size;
  const { commitMetadatas } = revisionHistory;

  const root = useMemo(
    () =>
      stratify()
        .id(
          (commitMetadata: CommitMetadata) =>
            commitMetadata.id,
        )
        .parentId((commitMetadata: CommitMetadata) =>
          commitMetadata.id === info.start
            ? null
            : commitMetadata.parent,
        )(commitMetadatas),
    [commitMetadatas],
  );

  return <svg width={width} height={height}></svg>;
};

export const RevisionHistoryNavigator = ({
  revisionHistory,
  info,
}: {
  revisionHistory: RevisionHistory | null;
  info: Info;
}) => {
  // Measure size
  const containerRef = useRef(null);
  const [size, setSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="vh-revision-history" ref={containerRef}>
      {revisionHistory && size ? (
        <Body
          revisionHistory={revisionHistory}
          size={size}
          info={info}
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
};
