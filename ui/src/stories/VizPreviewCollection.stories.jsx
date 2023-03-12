import { VizPreviewCollection } from '../components/VizPreviewCollection';
import { VizPreview } from '../components/VizPreview';

export default {
  title: 'VizHub/VizPreviewCollection',
  component: VizPreviewCollection,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  // tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: 'fullscreen',
  },
};

export const Normal = {
  args: {
    children: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((d, i) => (
      <VizPreview
        key={i}
        title="Viz Title"
        thumbnailImageURL="https://vizhub.com/api/visualization/thumbnail/76631818791a48909d79d6562177e4dc.png"
        lastUpdatedDateFormatted="December 6, 2021"
        ownerName="Joe Schmo"
        ownerAvatarURL="https://github.com/mdo.png"
      />
    )),
  },
};
