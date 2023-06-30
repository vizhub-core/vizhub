import { useState } from 'react';
import { ExplorePageBody } from '../components/ExplorePageBody';
import { renderVizPreviews } from './renderVizPreviews';
import { args as sortControlArgs } from './SortControlStory';

const args = {
  renderVizPreviews,
};

const Story = () => {
  const [sortId, setSortId] = useState(sortControlArgs.initialSortId);
  return (
    <div className="layout-fullscreen">
      <ExplorePageBody
        {...args}
        sortId={sortId}
        setSortId={setSortId}
        sortOptions={sortControlArgs.sortOptions}
      />
    </div>
  );
};

export default Story;
