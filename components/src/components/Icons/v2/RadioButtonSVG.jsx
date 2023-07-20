import React from 'react';

export const RadioButtonSVG = ({ height = 20, isActive }) => (
  <svg height={height} viewBox={'0 0 20 20'}>
    <rect
      x="0.5"
      y="0.5"
      width="19"
      height="19"
      rx="3.5"
      stroke="#969696"
      fill="none"
    />
    {isActive ? (
      <rect x="4" y="4" width="12" height="12" rx="2" fill="#3866E9" />
    ) : null}
  </svg>
);
