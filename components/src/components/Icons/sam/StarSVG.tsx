export const StarSVGSymbol = () => (
  <svg width="24" height="24" style={{ display: 'none' }}>
    <symbol id="star-icon" viewBox="0 0 24 24">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        fill="var(--star-fill-color, none)"
        d="M11.48 3.499a.563.563 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.562.562 0 0 0-.181.557l1.284 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.983 20.54a.562.562 0 0 1-.84-.61l1.284-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </symbol>
  </svg>
);

export const StarSVG = () => (
  <svg width="24" height="24">
    <use xlinkHref="#star-icon" className="star-icon-use" />
  </svg>
);
