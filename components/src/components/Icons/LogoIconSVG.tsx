const viewBoxWidth = 237.402;
const viewBoxHeight = 237.402;

export const LogoIconSVG = ({
  height = 22,
  fill = 'currentcolor',
}) => (
  <svg
    height={height}
    width={(viewBoxWidth / viewBoxHeight) * height}
    viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
  >
    <path
      fill={fill}
      d="M0 0v237.4h237.402V0H0zm22 22h193.402v193.4H22V22z"
    />
    <path
      fill={fill}
      d="m34.543 41.814 153.773 153.773h7.262V41.814H164.57v77.693L87.568 41.814Z"
    />
  </svg>
);
