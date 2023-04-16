// From https://github.com/vizhub-core/vizhub/commit/6ca078935b9771dc6e05a6065bcfd522a4724dcf
import React from 'react';
import './spinner.css';

// The time in ms before kicking off the spinner.
// If the request finishes before this time,
// the loading screen will never appear.
export const blankScreenDelay = 1000;

// Speed of rotation in degrees per animation frame.
const speed = 2;
const minRadius = 4;
const maxRadius = 10;
const numDots = 10;
const wheelRadius = 40;

// Yes, this runs on page load. And that's OK.
const dots = [];
for (let i = 0; i < numDots; i++) {
  const angle = (i / numDots) * Math.PI * 2;
  dots.push({
    x: Math.cos(angle) * wheelRadius,
    y: Math.sin(angle) * wheelRadius,
    r: minRadius + (i / (numDots - 1)) * (maxRadius - minRadius),
  });
}

// From https://bl.ocks.org/curran/685fa8300650c4324d571c6b0ecc55de
// And vizhub-v2/packages/neoFrontend/src/LoadingScreen/index.js
export const Spinner = ({ height = 40, fill = 'currentcolor' }) => (
  <div className="vh-spinner">
    <svg height={height} viewBox="0 0 100 100" style={{ opacity: 1 }}>
      <g transform="translate(50, 50)" fill={fill}>
        <g className="vh-spinner-dots">
          {dots.map(({ x, y, r }, i) => (
            <circle key={i} cx={x} cy={y} r={r}></circle>
          ))}
        </g>
      </g>
    </svg>
  </div>
);
