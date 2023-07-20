import React from 'react';

// From https://bl.ocks.org/curran/685fa8300650c4324d571c6b0ecc55de
export const SpinnerSVG = ({ height = 40, fill = 'currentcolor' }) => (
  <svg height={height} viewBox="0 0 100 100">
    <g transform="translate(50, 50)" fill={fill}>
      <g transform="rotate(3843.520000000717)">
        <circle cx="0" cy="40" r="10"></circle>
        <circle cx="24" cy="32" r="9"></circle>
        <circle cx="38" cy="12" r="9"></circle>
        <circle cx="38" cy="-12" r="8"></circle>
        <circle cx="24" cy="-32" r="7"></circle>
        <circle cx="0" cy="-40" r="7"></circle>
        <circle cx="-24" cy="-32" r="6"></circle>
        <circle cx="-38" cy="-12" r="5"></circle>
        <circle cx="-38" cy="12" r="5"></circle>
        <circle cx="-24" cy="32" r="4"></circle>
      </g>
    </g>
  </svg>
);
