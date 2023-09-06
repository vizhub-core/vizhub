import { useState } from 'react';
import { RenameFileModal } from '../components/RenameFileModal';

export const args = {
  initialFileName: 'indes.js',
  onRename: (newName) => {
    console.log('onRename');
    console.log(newName);
  },
};

const Story = () => {
  const [show, setShow] = useState(true);
  return (
    <div className="layout-centered">
      <RenameFileModal
        show={show}
        {...args}
        onClose={() => {
          setShow(false);
        }}
      />
    </div>
  );
};

export default Story;
