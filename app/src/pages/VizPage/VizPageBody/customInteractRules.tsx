// Custom rules for the VZCode editor tailored for VizHub.
// This makes it so you can click on imported vizzes to open them in a new tab.
// e.g. in `import { observeResize } from '@curran/responsive-axes';`
// you can click on '@curran/responsive-axes' to open the viz in a new tab.
export const customInteractRules = [
  {
    regexp: /@[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/g,
    cursor: 'pointer',
    onClick: (text: string) => {
      // Assuming the base URL for vizzes is 'https://vizhub.com/'
      const baseUrl = 'https://vizhub.com/';
      // Remove '@'
      const vizUrl = baseUrl + text.substring(1);
      window.open(vizUrl);
    },
  },
];
