import { useState } from 'react';
import { VisibilityControl } from '../components/VisibilityControl';

// A stub of a "smart" component that manages state.
// This will be swapped out with a ShareDB-based state system in the app.
const VisibilityControlWrapper = ({ initialVisibility, onChange }) => {
  const [visibility, setVisibility] = useState(initialVisibility);
  const handleSetVisibility = (newVisibility) => {
    setVisibility(newVisibility);
    onChange(newVisibility);
  };
  return (
    <VisibilityControl
      visibility={visibility}
      setVisibility={handleSetVisibility}
    />
  );
};

export default {
  title: 'VizHub/VisibilityControl',
  component: VisibilityControlWrapper,
  parameters: {
    layout: 'centered',
  },
  argTypes: { onChange: { action: 'change' } },
};

export const Public = { args: { initialVisibility: 'public' } };
export const Unlisted = { args: { initialVisibility: 'unlisted' } };
export const Private = { args: { initialVisibility: 'private' } };
