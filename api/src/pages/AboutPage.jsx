// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const AboutPage = () => {
  return 'About';
};

AboutPage.path = '/about';

AboutPage.getPageData = async () => ({
  title: 'About',
});
