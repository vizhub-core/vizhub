import React from 'react';

export const FullSVG = ({ height = 16, fill = 'currentcolor' }) => (
  <svg height={height} viewBox="0 0 20 16">
    <path
      fill={fill}
      d="M6.625 0v1.333h-5.3v5.334H0V0h6.625zm6.625 0h6.625v6.667H18.55V1.333h-5.3V0zm6.625 9.333V16H13.25v-1.333h5.3V9.333h1.325zM6.625 16H0V9.333h1.325v5.334h5.3V16z"
    />
  </svg>
);
