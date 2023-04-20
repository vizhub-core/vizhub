import React from 'react';

export const SplitSVG = ({ height = 16, fill = 'currentcolor' }) => (
  <svg height={height} viewBox="0 0 20 16">
    <g fill={fill}>
      <path d="M0 0h19.875v16H0V0zm1.325 1.333v13.334H18.55V1.333H1.325z" />
      <path d="M9.938 0h9.937v16H9.937V0zm1.324 1.333v13.334h7.288V1.333h-7.288z" />
    </g>
  </svg>
);
