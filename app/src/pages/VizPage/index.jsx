import { useShareDBDocData } from '../../useShareDBDocData';

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage = ({ pageData }) => {
  const { infoSnapshot, ownerUserSnapshot } = pageData;

  const info = useShareDBDocData(infoSnapshot, 'Info');
  const ownerUser = useShareDBDocData(ownerUserSnapshot, 'User');

  console.log('TODO present this stuff:');
  console.log(JSON.stringify({ info, ownerUser }, null, 2));

  return info.title;
};

VizPage.path = '/:userName/:id';
