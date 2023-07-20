import React from 'react';

export const CloseSVG = ({ height = 20, fill = 'currentcolor' }) => (
  <svg height={height} viewBox={'0 0 20 20'}>
    <g fill={fill}>
      <rect
        width="24"
        height="2"
        x="-2"
        y="9"
        rx="1"
        transform="rotate(45 10 10)"
      />
      <rect
        width="24"
        height="2"
        x="-2"
        y="9"
        rx="1"
        transform="rotate(135 10 10)"
      />
    </g>
  </svg>
);
