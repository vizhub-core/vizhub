import React from 'react';

export const ArrowSVG = ({
  height = 18,
  fill = 'currentcolor',
  left = false,
  up = false,
  down = false,
}) => {
  const isVertical = up || down;
  const w = isVertical ? 20 : 11;
  const h = isVertical ? 11 : 20;
  return (
    <svg
      height={isVertical ? (height * 11) / 20 : height}
      viewBox={`0 0 ${w} ${h}`}
    >
      <g
        fill={fill}
        transform={`translate(${isVertical ? '10,5.5' : '5.5,10'}) rotate(${
          left ? 0 : up ? 90 : down ? -90 : 180
        }) translate(-5.5,-10)`}
      >
        <rect
          width="13"
          height="2"
          x="-1"
          y="12.778"
          rx="1"
          transform="rotate(45 5.5 13.778)"
        />
        <rect
          width="13"
          height="2"
          x="-1"
          y="5"
          rx="1"
          transform="rotate(135 5.5 6)"
        />
      </g>
    </svg>
  );
};
