export const getPackageJson = (
  packageJsonText: string | null,
) => {
  if (packageJsonText) {
    try {
      return JSON.parse(packageJsonText);
    } catch (error) {
      // Ignore error and return null
      // in the case of invalid JSON.
    }
  }
  return null;
};
