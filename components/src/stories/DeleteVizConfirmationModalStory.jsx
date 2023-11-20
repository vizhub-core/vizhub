import { useState } from 'react';
import { DeleteVizConfirmationModal } from '../components/DeleteVizConfirmationModal';

export const args = {
  onConfirm: () => {
    console.log('onConfirm');
  },
};

const Story = () => {
  const [show, setShow] = useState(true);
  return (
    <div className="layout-centered">
      <DeleteVizConfirmationModal
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
