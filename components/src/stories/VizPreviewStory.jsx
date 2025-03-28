import { VizPreview } from '../components/VizPreview';

const args = {
  title: 'Primordial Viz',
  thumbnailImageURL:
    'https://vizhub.com/api/visualization/thumbnail/76631818791a48909d79d6562177e4dc.png',
  lastUpdatedDateFormatted: 'December 6, 2021',
  ownerName: 'Joe Schmoe',
  ownerAvatarURL: 'https://github.com/mdo.png',
  href: 'test-href',
  upvotesCount: 25,
};

const Story = () => {
  return (
    <div className="layout-centered">
      <VizPreview {...args} />
    </div>
  );
};

export default Story;
