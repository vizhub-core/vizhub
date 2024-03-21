import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { select } from 'd3-selection';
import { utcFormat } from 'd3-time-format';
import {
  stratify,
  tree,
  HierarchyNode,
  HierarchyLink,
} from 'd3-hierarchy';
import { zoom, zoomIdentity } from 'd3-zoom';
import {
  CommitId,
  CommitMetadata,
  Content,
  Info,
  RevisionHistory,
  Timestamp,
  defaultVizWidth,
  timestampToDate,
} from 'entities';
import { Spinner } from '../Spinner';
import './styles.scss';

// The width of the thumbnail
const revisionThumbnailWidth = defaultVizWidth / 4;

// The width of the gap between the nodes
const gap = 20;

// Formats a timestamp to the format "1/1/20 4:45 PM".
const format = utcFormat('%-m/%-d/%y %-I:%M %p');
const formatCommitTimestamp = (timestamp: Timestamp) =>
  format(timestampToDate(timestamp));

// TODO make this a dynamic import
// so that the d3 modules are not included
// in the main bundle.
const Body = ({
  revisionHistory,
  size,
  info,
  content,
  getVizPageHrefForCommit,
}: {
  revisionHistory: RevisionHistory | null;
  size: {
    width: number;
    height: number;
  };
  info: Info;
  content: Content;
  getVizPageHrefForCommit: (commitId: CommitId) => string;
}) => {
  const { width, height } = size;
  const { commitMetadatas } = revisionHistory;

  // Compute the formatted dates only once
  const formattedDatesByCommitId = useMemo(() => {
    return commitMetadatas.reduce(
      (acc, commitMetadata) => {
        acc[commitMetadata.id] = formatCommitTimestamp(
          commitMetadata.timestamp,
        );
        return acc;
      },
      {} as Record<CommitId, string>,
    );
  }, [commitMetadatas]);

  // Compute the tree
  const root = useMemo(
    () =>
      stratify<CommitMetadata>()
        .id(
          (commitMetadata: CommitMetadata) =>
            commitMetadata.id,
        )
        // Treat the start commit as the root,
        // even thouth in the larger data model
        // it does have a parent.
        .parentId((commitMetadata: CommitMetadata) =>
          commitMetadata.id === info.start
            ? null
            : commitMetadata.parent,
        )(commitMetadatas),
    [commitMetadatas],
  );

  // Compute the width of the tree
  const treeWidth = useMemo(() => {
    const depth: number = root
      .descendants()
      .reduce(
        (
          maxDepth: number,
          node: HierarchyNode<CommitMetadata>,
        ) => Math.max(maxDepth, node.depth),
        0,
      );
    return depth * (revisionThumbnailWidth / 2 + gap);
  }, [root]);

  // This is a side effect that mutates the nodes in the tree
  // to include the x and y coordinates of the nodes.
  useMemo(() => {
    tree().size([height, treeWidth])(root);
  }, [root, treeWidth, height]);

  // Compute the height of the thumbnail
  // Assume that the aspect ratio of the thumbnail is the same
  // as the aspect ratio of the CURRENT content (may not be true).
  const revisionThumbnailHeight = useMemo(() => {
    return (
      (content.height / defaultVizWidth) *
      revisionThumbnailWidth
    );
  }, [content.height]);

  // Isolate the node that corresponds to the latest commit `info.end`.
  const endNode = useMemo(
    () =>
      root.descendants().find((node) => {
        return node.data.id === info.end;
      }),
    [root, info.end],
  );

  // Zoom to the end node
  // such that the end node is on the right side of the viewport
  // and centered vertically.
  const initialTransform = useMemo(() => {
    if (endNode) {
      return zoomIdentity
        .translate(
          width -
            revisionThumbnailWidth / 4 -
            gap -
            endNode.y,
          height / 2 - endNode.x,
        )
        .scale(1);
    } else {
      return zoomIdentity;
    }
  }, [endNode, width, height]);

  // Use d3-zoom
  const [transform, setTransform] = useState(
    initialTransform,
  );
  // console.log(JSON.stringify(transform, null, 2));
  // Outputs:
  // {
  //   "k": 1,
  //   "x": 0,
  //   "y": 0
  // }
  const svgRef = useRef(null);
  useEffect(() => {
    if (svgRef.current) {
      const zoomBehavior = zoom().on('zoom', (event) => {
        setTransform(event.transform);
      });
      select(svgRef.current)
        // Set up the interaction
        .call(zoomBehavior)
        // Initialize the initial transform
        .call(zoomBehavior.transform, initialTransform);
    }
  }, []);

  return (
    <svg width={width} height={height} ref={svgRef}>
      <g transform={transform.toString()}>
        {root
          .links()
          .map((link: HierarchyLink<CommitMetadata>) => (
            <line
              key={link.source.id + link.target.id}
              x1={link.source.y}
              y1={link.source.x}
              x2={link.target.y}
              y2={link.target.x}
              stroke="black"
            />
          ))}
        {root
          .descendants()
          .map((node: HierarchyNode<CommitMetadata>) => {
            // Calculate the transformed position of the node
            const transformedX = transform.applyX(node.y);
            const transformedY = transform.applyY(node.x);

            // Check if the image falls within the viewport
            const isVisible =
              transformedX + revisionThumbnailWidth / 4 >
                0 &&
              transformedX - revisionThumbnailWidth / 4 <
                width &&
              transformedY + revisionThumbnailHeight / 4 >
                0 &&
              transformedY - revisionThumbnailHeight / 4 <
                height;

            return (
              <g
                key={node.id}
                transform={`translate(${node.y}, ${node.x})`}
              >
                <circle r={5} fill="black" />
                {isVisible && (
                  <a
                    href={getVizPageHrefForCommit(
                      node.data.id,
                    )}
                    target="_blank"
                  >
                    <image
                      transform={`translate(${-revisionThumbnailWidth / 4}, ${-revisionThumbnailHeight / 4})`}
                      href={`/api/viz-thumbnail/${node.id}-${revisionThumbnailWidth}.png`}
                      // Display the thumbnail at half size
                      // so that it looks good on high DPI screens.
                      width={revisionThumbnailWidth / 2}
                    />
                  </a>
                )}
                {
                  // Show the timestamp as a human-readable date.
                  // if the node corresponds to the current version.
                  <text
                    transform={`translate(0, ${revisionThumbnailHeight / 4 + 18})`}
                    textAnchor="middle"
                    fontSize="12"
                    className="time-label"
                  >
                    {formattedDatesByCommitId[node.data.id]}
                  </text>
                }
                {
                  // Show text that says "Current version"
                  // if the node corresponds to the current version.
                  node.data.id === info.end && (
                    <text
                      transform={`translate(0, ${-revisionThumbnailHeight / 4 - 6})`}
                      textAnchor="middle"
                      fontSize="14"
                      fill="black"
                    >
                      Current version
                    </text>
                  )
                }
              </g>
            );
          })}
      </g>
    </svg>
  );
};

export const RevisionHistoryNavigator = ({
  revisionHistory,
  info,
  content,
  getVizPageHrefForCommit,
}: {
  revisionHistory: RevisionHistory | null;
  info: Info;
  content: Content;
  getVizPageHrefForCommit: (commitId: CommitId) => string;
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
          content={content}
          getVizPageHrefForCommit={getVizPageHrefForCommit}
        />
      ) : (
        <Spinner />
      )}
    </div>
  );
};
