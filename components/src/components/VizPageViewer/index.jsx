import { useRef } from 'react';
import './styles.scss';

export const VizPageViewer = ({
  vizTitle,
  vizHeight,
  renderVizRunner,
  renderMarkdownHTML,
}) => {
  // This SVG elemeng is used only for its dynamic resizing behavior.
  // It's invisible, nothing is rendered into it.
  const svgRef = useRef();

  return (
    <div className="vh-viz-page-viewer">
      <div className="viewer-content">
        <div className="viz-frame">
          <svg ref={svgRef} viewBox={`0 0 960 ${vizHeight}`} />
          {renderVizRunner(svgRef)}
        </div>
        <h4 className="title">{vizTitle}</h4>
        <div class="vh-markdown-body">{renderMarkdownHTML()}</div>
      </div>
    </div>
  );
};
