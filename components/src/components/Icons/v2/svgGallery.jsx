import React from 'react';
import { LogoSVG } from './LogoSVG';
import { ForkSVG } from './ForkSVG';
import { CloseSVG } from './CloseSVG';
import { PullSVG } from './PullSVG';
import { SettingsSVG } from './SettingsSVG';
import { ShareSVG } from './ShareSVG';
import { ArrowSVG } from './ArrowSVG';
import { VoteSVG } from './VoteSVG';
import { SpinnerSVG } from './SpinnerSVG';
import { FullSVG } from './FullSVG';
import { FullExitSVG } from './FullExitSVG';
import { MiniSVG } from './MiniSVG';
import { SplitSVG } from './SplitSVG';
import { VimSVG } from './VimSVG';

export const SVGGallery = () => (
  <>
    <LogoSVG height={40} />
    <ForkSVG />
    <ArrowSVG />
    <ArrowSVG left={true} />
    <CloseSVG />
    <PullSVG />
    <SettingsSVG />
    <ShareSVG />
    <VoteSVG />
    <VoteSVG down={true} />
    <FullSVG />
    <FullExitSVG />
    <MiniSVG />
    <SplitSVG />
    <SpinnerSVG />
    <VimSVG />
  </>
);
