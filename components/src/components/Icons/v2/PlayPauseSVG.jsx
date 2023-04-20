import React from 'react';
import { arc } from 'd3-shape';

// TODO unify these into one place. Shared by upvote icon.
const r = 9.45;
const strokeWidth = 1.1;

const runTimerProgressArc = arc()
  .innerRadius(r - (strokeWidth * 3) / 2)
  .outerRadius(r)
  .startAngle(0);

const Pause = () => (
  <>
    <rect x="-3" y="-4" width="2" height="8" />
    <rect x="1" y="-4" width="2" height="8" />
  </>
);

const Play = () => (
  <g transform="translate(-11,-11)">
    <path d="M16 11L8.5 15.3301L8.5 6.66987L16 11Z" />
  </g>
);
const blue = '#3866e9';

// Add a bit extra (.01) so it displays as a full circle.
// Otherwise there is a tiny but visible gap.
const twoPI = Math.PI * 2.01;

export const PlayPauseSVG = ({
  height = 20,
  runTimerProgress,
  isAutoRunEnabled,
  needsManualRun,
  showButton,
}) => (
  <svg height={height} viewBox="0 0 20 20">
    <g transform="translate(10,10)" fill="currentcolor">
      {showButton ? (
        <>
          <path
            fill={blue}
            d={runTimerProgressArc({
              endAngle: needsManualRun ? twoPI : runTimerProgress * twoPI || 0,
            })}
          />
          <circle
            r={r}
            strokeWidth={strokeWidth}
            stroke="currentcolor"
            fill="none"
          />
          <g fill={needsManualRun ? blue : 'currentcolor'}>
            {isAutoRunEnabled ? <Pause /> : <Play />}
          </g>
        </>
      ) : null}
    </g>
  </svg>
);
