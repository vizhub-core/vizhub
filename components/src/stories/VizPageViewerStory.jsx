import { VizPageViewer } from '../components/VizPageViewer';
import { renderMarkdownHTML } from './renderMarkdownHTML';

export const renderVizRunner = (iframeScale) => {
  return (
    <iframe
      srcDoc={'Hello World'}
      width={960}
      height={500}
      style={{
        transformOrigin: '0 0',
        transform: `scale(${iframeScale})`,
      }}
    />
  );
};

export const args = {
  vizTitle: 'Viz Title',
  vizHeight: 500,
  defaultVizWidth: 960,
  renderVizRunner,
  renderMarkdownHTML,
  authorDisplayName: 'Author Name',
  authorAvatarURL:
    'https://avatars.githubusercontent.com/u/1234567?v=4',
  createdDateFormatted: 'January 20, 1985',
  updatedDateFormatted: 'February 20, 1985',
  forkedFromVizTitle: 'Original Viz Title',
  forkedFromVizHref: '/user/vizId',
  forksCount: 25,
  forksPageHref: '/user/vizId/forks',
  ownerUserHref: '/user',
  upvotesCount: 25,
  license: 'MIT',
  enableEditingTitle: true,
  commentsFormatted: Array(5)
    .fill({
      authorDisplayName: 'Author Name',
      authorAvatarURL:
        'https://avatars.githubusercontent.com/u/1234567?v=4',
      createdDateFormatted: 'January 20, 1985',
      editedDateFormatted: 'February 20, 1985',
      commentText: 'Comment text',
    })
    .map((comment, index) => ({
      id: '' + index,
      ...comment,
    })),
  handleCommentSubmit: (markdown) => {
    console.log('markdown ', markdown);
  },
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <VizPageViewer {...args} />
    </div>
  );
};

export default Story;
