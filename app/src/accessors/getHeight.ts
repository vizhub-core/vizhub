import { Content, defaultVizHeight } from 'entities';

// Gets the license of the given viz content.
export const getHeight = (height: number | undefined): number =>
  typeof height === 'number' ? height : defaultVizHeight;
