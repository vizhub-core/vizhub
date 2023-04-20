import React from 'react';

export const MicroSVG = ({ height = 16, fill = 'currentcolor' }) => (
  <svg height={height} viewBox="0 0 20 16">
    <path
      fill={fill}
      d="M18.55 6.667v8H1.325V1.333h8.613v5.334zM0 16h19.875V0H0zM11.262 5.333v-4h7.288v4z"
    />
  </svg>
);
