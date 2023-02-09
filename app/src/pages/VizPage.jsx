// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage = () => {
  return 'About';
};

VizPage.getPageData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { foo: 'bar' };
};
