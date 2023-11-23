import { defaultVizHeight } from 'entities';

// Gets the height of the given viz content.
// If the height is not defined, returns the default height.
export const getHeight = (
  height: number | undefined,
): number =>
  typeof height === 'number' ? height : defaultVizHeight;
