import { PackageJson } from 'runtime';

export const defaultLicense = 'MIT';

// Gets the license of the given viz content.
export const getLicense = (
  packageJson: PackageJson | null,
): string | null => packageJson?.license || defaultLicense;
