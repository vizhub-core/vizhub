import { useState } from 'react';
import { ProfilePageBody } from '../components/ProfilePageBody';
import { renderVizPreviews } from './renderVizPreviews';
import { args as sortControlArgs } from './SortControlStoryHorizontal';

const args = {
  userName: 'schmoe',
  displayName: 'Joe Schmoe',
  bio: 'Mauris tristique purus risus cursus. Ornare feugiat ut congue aliquet dolor ut. Nisl porta enim orci molestie ligula nulla et eu fringilla. Vitae id quisque elit eget a nec morbi tortor sit.',
  renderVizPreviews,
  onMoreClick: () => {
    console.log('More clicked');
  },
  picture:
    'https://avatars.githubusercontent.com/u/98681?v=4',
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
