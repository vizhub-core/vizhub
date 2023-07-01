import { useState } from 'react';
import { SortControl } from '../components/SortControl';

// A stub of a "smart" component that manages state.
// This will be swapped out with a ShareDB-based state system in the app.
export const SortControlWrapper = ({
  initialSortId,
  sortOptions,
  onChange,
  isVertical,
}) => {
  const [sortId, setSortId] = useState(initialSortId);
  const handleSetSortId = (newSortId) => {
    setSortId(newSortId);
    onChange(newSortId);
  };
  return (
    <SortControl
      sortId={sortId}
      setSortId={handleSetSortId}
      sortOptions={sortOptions}
      isVertical={isVertical}
    />
  );
};

export const args = {
  initialSortId: '43275',
  sortOptions: [
    { id: '43275', label: 'Popular' },
    { id: '84367', label: 'Most Recent' },
    { id: '03527', label: 'Most Forked' },
  ],

  onChange: (sortId) => {
    console.log('onChange');
    console.log(sortId);
  },
};

const Story = () => {
  return (
    <div className="layout-centered">
      <SortControlWrapper {...args} />
    </div>
  );
};

export default Story;
