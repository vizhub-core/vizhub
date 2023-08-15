import { useState } from 'react';
import { OwnerControl } from '../components/OwnerControl';

// A stub of a "smart" component that manages state.
// This will be swapped out with a ShareDB-based state system in the app.
const OwnerControlWrapper = ({
  initialOwner,
  possibleOwners,
  onChange,
}) => {
  const [owner, setOwner] = useState(initialOwner);
  const handleSetOwner = (newOwner) => {
    setOwner(newOwner);
    onChange(newOwner);
  };
  return (
    <OwnerControl
      owner={owner}
      setOwner={handleSetOwner}
      possibleOwners={possibleOwners}
    />
  );
};

export const args = {
  initialOwner: '43275',
  possibleOwners: [
    { id: '43275', label: 'fred' },
    { id: '84367', label: 'fred-corp' },
    { id: '03527', label: 'company-org' },
  ],

  onChange: (ownerId) => {
    console.log('onChange');
    console.log(ownerId);
  },
};

const Story = () => {
  return (
    <div className="layout-centered">
      <OwnerControlWrapper {...args} />
    </div>
  );
};

export default Story;
