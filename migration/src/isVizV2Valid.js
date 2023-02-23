import { isolateGoodFiles } from './isolateGoodFiles';

// Checks that a given id points to a valid v2 viz.
export const isVizV2Valid = async ({ id, contentCollection }) => {
  const content = await contentCollection.findOne({ _id: id });
  const goodFiles = isolateGoodFiles(content);
  return !!goodFiles;
};
