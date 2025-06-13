import { CommentNotificationRow } from '../components/CommentNotificationRow';

export const args = {
  commenterUserAvatarURL: 'https://github.com/mdo.png',
  commenterUsername: 'Jones',
  commenterProfileHref: 'commenterProfileHref',
  vizTitle: 'vizTitle',
  vizHref: 'vizHref',
  hasBeenRead: true,
  markAsRead: ()=>{}
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <CommentNotificationRow {...args} />
    </div>
  );
};

export default Story;
