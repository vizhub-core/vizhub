import { VizPreview } from '../components/VizPreview';

export const renderVizPreviews = () =>
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((d, i) => (
    <VizPreview
      key={i}
      title="Viz Title"
      thumbnailImageURL="https://vizhub.com/api/visualization/thumbnail/76631818791a48909d79d6562177e4dc.png"
      lastUpdatedDateFormatted="December 6, 2021"
      ownerName="Joe Schmo"
      ownerAvatarURL="https://github.com/mdo.png"
      href={`test/${i}`}
    />
  ));
