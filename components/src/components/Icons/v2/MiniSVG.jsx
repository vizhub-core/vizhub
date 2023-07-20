import React from 'react';

export const MiniSVG = ({ height = 16, fill = 'currentcolor' }) => (
  <svg height={height} viewBox="0 0 20 16">
    <path
      fill={fill}
      d="M18.55 9.333v-8H1.325v13.334h8.613V9.333h8.612zM0 0h19.875v16H0V0zm11.262 10.667v4h7.288v-4h-7.288z"
    />
  </svg>
);
