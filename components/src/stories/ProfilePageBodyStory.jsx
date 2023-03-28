import { ProfilePageBody } from '../components/ProfilePageBody';
import { renderVizPreviews } from './renderVizPreviews';

const args = {
  userName: 'schmoe',
  displayName: 'Joe Schmoe',
  renderVizPreviews,
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <ProfilePageBody {...args} />
    </div>
  );
};

export default Story;
