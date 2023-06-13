import { LogoSVG } from '../components/Icons/LogoSVG';
import { ForkSVG } from '../components/Icons/ForkSVG';
import { ShareSVG } from '../components/Icons/ShareSVG';
import { ChevronSVG } from '../components/Icons/ChevronSVG';
import { DownloadSVG } from '../components/Icons/DownloadSVG';
import { StarSVG } from '../components/Icons/StarSVG';

import { ForkSVG as v2ForkSVG } from '../components/Icons/v2/ForkSVG';
// TODO migrate all of these to new icons.
import { CloseSVG } from '../components/Icons/v2/CloseSVG';
import { PullSVG } from '../components/Icons/v2/PullSVG';
import { SettingsSVG } from '../components/Icons/v2/SettingsSVG';
import { ShareSVG as v2ShareSVG } from '../components/Icons/v2/ShareSVG';
import { ArrowSVG } from '../components/Icons/v2/ArrowSVG';
import { VoteSVG } from '../components/Icons/v2/VoteSVG';
import { SpinnerSVG } from '../components/Icons/v2/SpinnerSVG';
import { FullSVG } from '../components/Icons/v2/FullSVG';
import { FullExitSVG } from '../components/Icons/v2/FullExitSVG';
import { MiniSVG } from '../components/Icons/v2/MiniSVG';
import { SplitSVG } from '../components/Icons/v2/SplitSVG';
import { VimSVG } from '../components/Icons/v2/VimSVG';

const v2icons = [
  v2ForkSVG,
  v2ShareSVG,
  CloseSVG,
  PullSVG,
  SettingsSVG,
  ArrowSVG,
  () => <ArrowSVG left={true} />,
  VoteSVG,
  () => <VoteSVG down={true} />,
  SpinnerSVG,
  FullSVG,
  FullExitSVG,
  MiniSVG,
  SplitSVG,
  VimSVG,
];

const v3icons = [
  LogoSVG,
  ForkSVG,
  ShareSVG,
  ChevronSVG,
  ({ height }) => <ChevronSVG height={height} left />,
  ({ height }) => <ChevronSVG height={height} up />,
  ({ height }) => <ChevronSVG height={height} down />,
  DownloadSVG,
  StarSVG,
];

const displayIcons = (icons) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
    {icons.map((IconSVG, i) => (
      <div
        key={i}
        style={{ border: '1px solid gray', display: 'flex', margin: '10px' }}
      >
        <IconSVG height="100" />
      </div>
    ))}
  </div>
);

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <h1>V2</h1>
      {displayIcons(v2icons)}
      <h1>V3</h1>
      {displayIcons(v3icons)}
    </div>
  );
};

export default Story;
