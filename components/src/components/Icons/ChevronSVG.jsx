const cx = 24;
export const ChevronSVG = ({
  height = 16,
  fill = 'currentcolor',
  left = false,
  up = false,
  down = false,
}) => (
  <svg height={height} viewBox={up || down ? '12 10 24 28' : '17 10 14 28'}>
    <path
      transform={`translate(24,24) rotate(${
        left ? -90 : up ? 0 : down ? 180 : 90
      }) translate(-24,-24)`}
      fill={fill}
      d="m34.994 27.565-8.625-8.626-.654-.654a2.43 2.43 0 0 0-3.43 0l-.654.654-8.625 8.626a1.674 1.674 0 1 0 2.369 2.368L24 21.308l1.433 1.433 7.192 7.192c.327.327.755.49 1.184.49s.857-.163 1.185-.49a1.674 1.674 0 0 0 0-2.368z"
    />
  </svg>
);
