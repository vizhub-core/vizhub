// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage = () => {
  return 'Viz';
};

VizPage.path = '/:userName/:vizId';

VizPage.getPageData = async () => ({
  // TODO replace this with the Viz title
  title: 'TODO get viz title',
  description: 'TODO get viz README rendered to plain text',
});
