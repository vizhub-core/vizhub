import { V3PackageJson } from 'runtime';
import { defaultLicense } from 'entities';

// Gets the license of the given viz content.
export const getLicense = (
  packageJson: V3PackageJson | null,
): string | null => packageJson?.license || defaultLicense;
