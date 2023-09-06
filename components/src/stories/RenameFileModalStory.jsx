import { useState } from 'react';
import { RenameFileModal } from '../components/RenameFileModal';

export const args = {
  initialFileName: 'indes.js',
  onRename: (newName) => {
    console.log('onRename');
    console.log(newName);
  },
  // initialVisibility: 'public',
  // initialOwner,
  // possibleOwners,
  // onFork: (forkData) => {
  //   console.log('onFork');
  //   console.log(forkData);
  // },
  // currentPlan: 'pro',
  // pricingHref: 'pricingHref',
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
