import vizhubLibraries from 'vizhub-libraries';
import { getConfiguredLibraries } from './packageJson';

export const getLibraries = (files) => {
  const configuredLibraries = getConfiguredLibraries(files);
  const userLibrariesNames = configuredLibraries
    ? Object.keys(configuredLibraries)
    : [];

  const userLibraries = userLibrariesNames.reduce(
    (globals, packageName) => {
      // in case if user created settings but not provide global, stub global with vizhub known global name
      const globalName =
        configuredLibraries[packageName].global ||
        vizhubLibraries[packageName];

      if (globalName) {
        globals[packageName] = globalName;
      } else {
        console.warn(
          `There is no global name for ${packageName}.\n Please add it to "vizhub.${packageName}.global" section in package.json.`,
        );
      }

      return globals;
    },
    {},
  );

  return { ...vizhubLibraries, ...userLibraries };
};
