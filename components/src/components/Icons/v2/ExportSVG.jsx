import React from 'react';

export const ExportSVG = ({ height = 13, fill = 'currentcolor' }) => (
  <svg height={height} viewBox="0 0 11 13">
    <path
      fill={fill}
      d="M1 10.92h9a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-.08a1 1 0 0 1 1-1zM5.5 0a1 1 0 0 1 .58.18l.04.04c.07.05.13.11.18.18l3.36 3.5a1 1 0 0 1 0 1.38l-.04.05a.98.98 0 0 1-1.39.02l-.02-.02L6.5 3.55v3.77a1 1 0 1 1-2 0V3.55L2.8 5.33a.98.98 0 0 1-1.42 0l-.04-.05a1 1 0 0 1 0-1.38L4.7.4c.05-.07.11-.13.18-.18L4.9.18C5.08.07 5.28 0 5.5 0z"
    />
  </svg>
);
