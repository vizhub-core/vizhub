import { useState } from 'react';
import { ProfilePageBody } from '../components/ProfilePageBody';
import { args as profilePageBodyArgs } from './ProfilePageBodyStory';
import { args as sortControlArgs } from './SortControlStoryHorizontal';

const args = {
  ...profilePageBodyArgs,
  isViewingOwnProfile: true,
};

const Story = () => {
  const [sortId, setSortId] = useState(
    sortControlArgs.initialSortId,
  );

  return (
    <div className="layout-fullscreen">
      <ProfilePageBody
        {...args}
        sortId={sortId}
        setSortId={setSortId}
        sortOptions={sortControlArgs.sortOptions}
      />
    </div>
  );
};

export default Story;
