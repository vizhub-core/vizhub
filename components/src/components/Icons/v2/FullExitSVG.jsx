import React from 'react';

export const FullExitSVG = ({ height = 16, fill = 'currentcolor' }) => (
  <svg height={height} viewBox="0 0 20 16">
    <path
      fill={fill}
      d="M5.3 0v5.334H0v1.334h6.625V0H5.301zm7.95 0v6.668h6.625V5.334h-5.3V0H13.25zM0 9.332v1.334h5.3V16h1.325V9.332H0zm13.25 0V16h1.324v-5.334h5.301V9.332H13.25z"
    />
  </svg>
);
