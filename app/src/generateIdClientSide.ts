// Generates a UUID v4 string without dashes,
// without any dependencies on Node packages.
// For use in the browser for generating entity ids.
// See also interactors/generateId for the server-side version.
// Code by ChatGPT, Feb 2024
export const generateIdClientSide = () =>
  'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) =>
    (
      (c === 'x'
        ? Math.random() * 16
        : (Math.random() * 4) | 8) | 0
    ).toString(16),
  );
