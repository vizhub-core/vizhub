import { useState } from 'react';
import { VizPageBody } from '../components/VizPageBody';
import { args as viewerArgs } from './VizPageViewerStory';
import { args as headArgs } from './VizPageHeadStory';

const args = {
  ...viewerArgs,
  ...headArgs,
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
