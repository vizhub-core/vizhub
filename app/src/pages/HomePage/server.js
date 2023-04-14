import { HomePage } from './index';

HomePage.getPageData = () => {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    title: 'VizHub 3 Beta',
    description: 'Viz your data',
    image:
      'https://vizhub.com/api/visualization/preview/77a2f42571494263931b8c4d38b7d63c.png',
  };
};

export { HomePage };
