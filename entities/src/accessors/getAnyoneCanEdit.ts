import { Info } from '..';

// Handle true, false, and critically `undefined`.
export const getAnyoneCanEdit = (info: Info): boolean =>
  !!info.anyoneCanEdit;
