// This is optimized so that the symbol is only defined once in the SVG sprite
// and then reused in the ForkSVG component. This significantly reduces the
// size of the server-rendered HTML in all pages where multiple viz previews
// are displayed. The SVG sprite is defined in the ForkSVGSymbol component
// and then the ForkSVG component uses the symbol.
export const ForkSVGSymbol = () => (
  <svg width="24" height="24" style={{ display: 'none' }}>
    <symbol id="fork-icon" viewBox="0 0 24 24">
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="6.5" cy="5.5" r="2.5" />
        <circle cx="17.5" cy="5.5" r="2.5" />
        <circle cx="12" cy="19.5" r="2.5" />
        <path d="M12 17C12 10.5714 17.5 14.4286 17.5 8" />
        <path d="M12 17C12 10.5714 6.5 14.4286 6.5 8" />
      </g>
    </symbol>
  </svg>
);

// For this to work, ForkSVGSymbol must be rendered once somewhere on the page.
export const ForkSVG = () => (
  <svg width="24" height="24">
    <use xlinkHref="#fork-icon" />
  </svg>
);
