export const ShareSVG = ({
  height = 16,
  fill = 'currentcolor',
}) => (
  <svg height={height} viewBox={'6 10 36 28'}>
    <path
      fill="none"
      stroke={fill}
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeMiterlimit="10"
      d="M26.75 19.125s-16.548 1.451-18.625 15"
    />
    <path
      fill="none"
      stroke={fill}
      strokeWidth="3.4"
      strokeLinecap="round"
      strokeMiterlimit="10"
      d="M26.75 29.063s-11.083-1.896-18.625 5.063M26.75 19.125v-5.208M26.75 34.125 39.75 24M26.75 13.917 39.75 24M26.75 29.063v5.062"
    />
  </svg>
);
