import { useState } from 'react';
import { VizPageBody } from '../components/VizPageBody';
import { renderMarkdownHTML } from './renderMarkdownHTML';

const args = {
  onExportClick: () => console.log('onExportClick'),
  onShareClick: () => console.log('onShareClick'),
  onForkClick: () => console.log('onForkClick'),
  renderVizRunner: () => null,
  renderMarkdownHTML,
};

const Story = () => {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="layout-fullscreen">
      <VizPageBody
        {...args}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
      />
    </div>
  );
};

export default Story;
