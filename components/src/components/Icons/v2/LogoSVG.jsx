import React from 'react';

const viewBoxWidth = 800;
const viewBoxHeight = 237.402;

export const LogoSVG = ({ height, fill = 'currentcolor' }) => (
  <svg
    height={height}
    width={(viewBoxWidth / viewBoxHeight) * height}
    viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
  >
    <g fill={fill}>
      <path d="M0 0v237.4h449v-22H22V22h756v193.4H503.6V52H469v51.5h-50l27.2 27.2h22.8v106.7H800V0H0zm53.6 52L187 185.4h6.3V52H166.4v67.4L99.6 52h-46zm160.3 0v29.3h32.3V52h-32.3zm427.2 0v133.4h32V172h.4c5.9 9 16.8 13 27.3 13 27 0 45.6-22.1 45.6-48.2 0-25.9-18.5-48-45.2-48a37.1 37.1 0 0 0-28 11.7V52h-32zm-427 42.7v90.4h32V94.7h-32zm53 0v26.6h42.5l-42.4 63.8H363v-26.6h-42.3L363 94.7h-95.8zm257.5 0v51.5c0 29.7 21 38.9 48.1 38.9s48-9.2 48-39V94.8h-32V140c0 11.4-2.8 19.5-16 19.5s-16-8-16-19.5V94.7h-32zm168.1 21.9c13 0 20.6 9.3 20.6 20.4 0 11.4-7.5 20.3-20.6 20.3-13 0-20.6-8.9-20.6-20.3 0-11 7.6-20.4 20.6-20.4z" />
      <path d="M384.1 52h34.7v133.5h-34.7z" />
    </g>
  </svg>
);
