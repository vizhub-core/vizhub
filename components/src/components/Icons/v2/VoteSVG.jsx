import React from 'react';

// const SVG = styled.svg``;

// const Circle = styled.circle`
//   ${SVG}:hover & {
//     fill: ${(props) => props.hoverBackground};
//   }
//   ${SVG}:active & {
//     fill: ${(props) => props.activeBackground};
//   }
// `;
const cx = 10;
const cy = 10;
const r = 9.45;

export const VoteSVG = ({
  down = false,
  height = 20,
  fill = 'currentcolor',
}) => (
  <svg height={height} viewBox="0 0 20 20">
    <g
      fill={fill}
      transform={`translate(10,10) rotate(${
        down ? 0 : 180
      }) translate(-10,-10)`}
    >
      <circle
        cx={cx}
        cy={cy}
        r={r}
        strokeWidth="1.1"
        stroke={fill}
        fill={'none'}
      />
      <g fill={fill}>
        <path d="M10.041 13.974l4.52-4.521a.547.547 0 0 1 .774.774l-4.587 4.587a1 1 0 0 1-1.414 0l-4.587-4.587a.547.547 0 1 1 .774-.774l4.52 4.52z" />
        <path d="M10.63 14.747H9.452V5.335a.588.588 0 1 1 1.176 0v9.412z" />
      </g>
    </g>
  </svg>
);
