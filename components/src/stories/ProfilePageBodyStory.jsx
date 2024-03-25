import { useState } from 'react';
import { ProfilePageBody } from '../components/ProfilePageBody';
import { renderVizPreviews } from './renderVizPreviews';
import { args as sortControlArgs } from './SortControlStoryHorizontal';

export const args = {
  userName: 'schmoe',
  displayName: 'Joe Schmoe',
  bio: 'Mauris tristique purus risus cursus. Ornare feugiat ut congue aliquet dolor ut. Nisl porta enim orci molestie ligula nulla et eu fringilla. Vitae id quisque elit eget a nec morbi tortor sit.',
  renderVizPreviews,
  onMoreClick: () => {
    console.log('More clicked');
  },
  picture:
    'https://avatars.githubusercontent.com/u/98681?v=4',
  currentPlan: 'free',
  handleCreateAPIKeyClick: () => {
    console.log('Clicked create API Key');
  },
};

export const useProfilePageState = (
  options = {
    initialSectionId: 'public',
  },
) => {
  const [sortId, setSortId] = useState(
    sortControlArgs.initialSortId,
  );

  const [sectionId, setSectionId] = useState(
    options.initialSectionId,
  );

  return {
    sortId,
    setSortId,
    sectionId,
    setSectionId,
    sortOptions: sortControlArgs.sortOptions,
  };
};

const Story = () => {
  const stateArgs = useProfilePageState();

  return (
    <div className="layout-fullscreen">
      <ProfilePageBody {...args} {...stateArgs} />
    </div>
  );
};

export default Story;
