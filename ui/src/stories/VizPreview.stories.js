import { VizPreview } from '../components/VizPreview';

export default {
  title: 'VizHub/VizPreview',
  component: VizPreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export const Normal = {
  args: {
    title: 'Primordial Viz',
    thumbnailImageURL:
      'https://vizhub.com/api/visualization/thumbnail/76631818791a48909d79d6562177e4dc.png',
    lastUpdatedDateFormatted: 'December 6, 2021',
    ownerName: 'Joe Schmoe',
    ownerAvatarURL: 'https://github.com/mdo.png',
  },
};
