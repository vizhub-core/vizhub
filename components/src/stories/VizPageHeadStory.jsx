import { useState } from 'react';
import { VizPageHead } from '../components/VizPageHead';

const args = {};

const Story = () => {
  // const { showEditor, toggleEditor } = useContext(URLStateContext);
  const [showEditor, setShowEditor] = useState(false);

  const toggleShowEditor = () => setShowEditor((showEditor) => !showEditor);

  return (
    <div className="layout-fullscreen">
      <VizPageHead
        {...args}
        showEditor={showEditor}
        toggleShowEditor={toggleShowEditor}
      />
    </div>
  );
};

export default Story;
