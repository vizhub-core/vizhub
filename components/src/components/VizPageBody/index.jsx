import { VizPageHead } from '../VizPageHead';
import { VizPageViewer } from '../VizPageViewer';
import './styles.scss';

export const VizPageBody = ({
  renderVizRunner,
  showEditor,
  setShowEditor,
  onExportClick,
  onShareClick,
  onForkClick,
  renderMarkdownHTML,
}) => {
  return (
    <div className="vh-viz-page-body">
      <VizPageHead
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        onExportClick={onExportClick}
        onShareClick={onShareClick}
        onForkClick={onForkClick}
      />
      <VizPageViewer
        renderVizRunner={renderVizRunner}
        renderMarkdownHTML={renderMarkdownHTML}
      />
    </div>
  );
};
