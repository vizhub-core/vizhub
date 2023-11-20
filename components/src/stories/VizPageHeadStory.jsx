import { useState } from 'react';
import { VizPageHead } from '../components/VizPageHead';

export const args = {
  onExportClick: () => console.log('onExportClick'),
  onShareClick: () => console.log('onShareClick'),
  onForkClick: () => console.log('onForkClick'),
  onSettingsClick: () => console.log('onSettingsClick'),
  onTrashClick: () => console.log('onTrashClick'),
  showForkButton: true,
  showSettingsButton: true,
  showTrashButton: true,
};

const Story = () => {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="layout-fullscreen">
      <VizPageHead
        {...args}
        showEditor={showEditor}
        setShowEditor={setShowEditor}
      />
    </div>
  );
};

export default Story;
