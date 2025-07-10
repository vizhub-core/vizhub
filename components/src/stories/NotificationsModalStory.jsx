import { useState } from 'react';
import { NotificationsModal } from '../components/NotificationsModal';

// Sample data for the notifications
export const args = {
  notificationsResult: {
    notifications: [
      {
        id: '1',
        type: 'commentOnYourViz',
        resource: 'viz123',
        commentId: 'comment1',
        read: false,
      },
      {
        id: '2',
        type: 'commentOnYourViz',
        resource: 'viz456',
        commentId: 'comment2',
        read: false,
      },
      {
        id: '3',
        type: 'commentOnYourViz',
        resource: 'viz789',
        commentId: 'comment3',
        read: true, // This one is already read
      }
    ],
    comments: {
      'comment1': {
        id: 'comment1',
        author: 'user1',
        markdown: 'Great visualization! I love the color scheme.',
      },
      'comment2': {
        id: 'comment2',
        author: 'user2',
        markdown: 'Have you considered adding a legend to this chart?',
      },
      'comment3': {
        id: 'comment3',
        author: 'user3',
        markdown: 'This is exactly what I was looking for. Thanks for sharing!',
      }
    },
    commentAuthors: {
      'user1': 'JaneDoe',
      'user2': 'JohnSmith',
      'user3': 'AlexWong',
    },
    commentAuthorImages: {
      'user1': 'https://github.com/mdo.png',
      'user2': 'https://avatars.githubusercontent.com/u/1234567?v=4',
      'user3': 'https://avatars.githubusercontent.com/u/7654321?v=4',
    },
    resourceTitles: {
      'viz123': 'Population Growth Visualization',
      'viz456': 'Climate Change Data',
      'viz789': 'COVID-19 Statistics',
    }
  },
  onMarkAsReads: new Map([
    ['1', async () => console.log('Marked notification 1 as read')],
    ['2', async () => console.log('Marked notification 2 as read')],
    ['3', async () => console.log('Marked notification 3 as read')],
  ]),
  getVizHref: (vizId, ownerUserName, commentId) => 
    `/${ownerUserName}/${vizId}?commentId=${commentId}`,
};

const Story = () => {
  const [show, setShow] = useState(true);
  
  return (
    <div className="layout-centered">
      <NotificationsModal
        show={show}
        onClose={() => {
          setShow(false);
          setTimeout(() => setShow(true), 1500); // Reopen after 1.5s for demo purposes
        }}
        {...args}
      />
    </div>
  );
};

export default Story;
