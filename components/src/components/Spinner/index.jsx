// From https://github.com/vizhub-core/vizhub/commit/6ca078935b9771dc6e05a6065bcfd522a4724dcf
import React from 'react';
import './styles.css';

// const minRadius = 4;
// const maxRadius = 10;
// const numDots = 10;
// const wheelRadius = 40;
// const round = (number) => Math.floor(number * 100) / 100;
// const dots = [];
// for (let i = 0; i < numDots; i++) {
//   const angle = (i / numDots) * Math.PI * 2;
//   dots.push({
//     x: round(Math.cos(angle) * wheelRadius),
//     y: round(Math.sin(angle) * wheelRadius),
//     r: round(minRadius + (i / (numDots - 1)) * (maxRadius - minRadius)),
//   });
// }
// console.log(JSON.stringify(dots));

// Hardcoded to avoid the computation.
const dots = [
  { x: 40, y: 0, r: 4 },
  { x: 32.36, y: 23.51, r: 4.66 },
  { x: 12.36, y: 38.04, r: 5.33 },
  { x: -12.37, y: 38.04, r: 6 },
  { x: -32.37, y: 23.51, r: 6.66 },
  { x: -40, y: 0, r: 7.33 },
  { x: -32.37, y: -23.52, r: 8 },
  { x: -12.37, y: -38.05, r: 8.66 },
  { x: 12.36, y: -38.05, r: 9.33 },
  { x: 32.36, y: -23.52, r: 10 },
];

// From https://bl.ocks.org/curran/685fa8300650c4324d571c6b0ecc55de
// And vizhub-v2/packages/neoFrontend/src/LoadingScreen/index.js
export const Spinner = ({
  height = 40,
  fill = 'currentcolor',
  fadeIn = true,
}) => (
  <div className={`vh-spinner${fadeIn ? ' fade-in' : ''}`}>
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
