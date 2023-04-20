// TODO migrate all of these to new icons.
import { LogoSVG } from '../components/Icons/LogoSVG';
import { ForkSVG } from '../components/Icons/v2/ForkSVG';
import { CloseSVG } from '../components/Icons/v2/CloseSVG';
import { PullSVG } from '../components/Icons/v2/PullSVG';
import { SettingsSVG } from '../components/Icons/v2/SettingsSVG';
import { ShareSVG } from '../components/Icons/v2/ShareSVG';
import { ArrowSVG } from '../components/Icons/v2/ArrowSVG';
import { VoteSVG } from '../components/Icons/v2/VoteSVG';
import { SpinnerSVG } from '../components/Icons/v2/SpinnerSVG';
import { FullSVG } from '../components/Icons/v2/FullSVG';
import { FullExitSVG } from '../components/Icons/v2/FullExitSVG';
import { MiniSVG } from '../components/Icons/v2/MiniSVG';
import { SplitSVG } from '../components/Icons/v2/SplitSVG';
import { VimSVG } from '../components/Icons/v2/VimSVG';

const icons = [
  LogoSVG,
  ForkSVG,
  CloseSVG,
  PullSVG,
  SettingsSVG,
  ShareSVG,
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

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {icons.map((IconSVG) => (
          <div style={{ border: '1px solid gray', margin: '10px' }}>
            <IconSVG />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Story;
