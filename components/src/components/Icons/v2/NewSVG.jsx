import React from 'react';

export const NewSVG = ({ height = 11, fill = 'currentcolor' }) => (
  <svg height={height} viewBox="0 0 11 11">
    <path
      fill={fill}
      d="M5.5 0a1 1 0 0 1 1 1v3.5H10a1 1 0 0 1 0 2H6.5V10a1 1 0 0 1-2 0V6.5H1a1 1 0 1 1 0-2h3.5V1a1 1 0 0 1 1-1z"
    />
  </svg>
);
