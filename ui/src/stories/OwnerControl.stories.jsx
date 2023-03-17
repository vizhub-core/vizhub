import { useState } from 'react';
import { OwnerControl } from '../components/OwnerControl';

// A stub of a "smart" component that manages state.
// This will be swapped out with a ShareDB-based state system in the app.
const OwnerControlWrapper = ({ initialOwner, possibleOwners, onChange }) => {
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

export default {
  title: 'VizHub/OwnerControl',
  component: OwnerControlWrapper,
  parameters: {
    layout: 'centered',
  },
  argTypes: { onChange: { action: 'change' } },
};

export const Normal = {
  args: {
    initialOwner: '43275',
    possibleOwners: [
      { id: '43275', label: 'fred' },
      { id: '84367', label: 'fred-corp' },
      { id: '03527', label: 'company-org' },
    ],
  },
};
