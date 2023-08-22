// const zoomX = 11;
// const zoomY = 6;
// const viewBox = `${zoomX} ${zoomY} ${48 - zoomX * 2}  ${
//   48 - zoomY * 2
// }`;
// console.log(viewBox);
const viewBox = '11 6 26 36';
export const VisibilityPrivateSVG = ({
  height = 18,
  fill = 'currentcolor',
}) => (
  <svg height={height} viewBox={viewBox}>
    <path
      fill={fill}
      d="M24 33.422c.938 0 1.7-.762 1.7-1.7v-2.688a1.701 1.701 0 0 0-3.4 0v2.688c0 .938.762 1.7 1.7 1.7z"
    />
    <path
      fill={fill}
      d="M33.508 19.417H32.04v-5.21c0-4.434-3.606-8.04-8.04-8.04s-8.04 3.606-8.04 8.04v5.21h-1.468a2.703 2.703 0 0 0-2.7 2.7v17.016c0 1.489 1.211 2.7 2.7 2.7h19.016c1.489 0 2.7-1.211 2.7-2.7V22.117c0-1.489-1.211-2.7-2.7-2.7zm-14.148-5.21c0-2.559 2.081-4.64 4.64-4.64s4.64 2.081 4.64 4.64v5.21h-9.28v-5.21zm13.448 24.226H15.192V22.817h17.615v15.616z"
    />
  </svg>
);
