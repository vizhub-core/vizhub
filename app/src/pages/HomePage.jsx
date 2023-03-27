import { useNavigate } from 'react-router-dom';
import { HomePageBody } from 'ui/src/components/HomePageBody';
// Decoupled navigation from interaction, to support
// testing the UI in isolation, for example in Storybook.
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const HomePage = ({ pageData }) => {
  const navigate = useNavigate();
  //  console.log('pageData in HomePage:');
  //  console.log(pageData);
  //  return (
  //    <ul>
  //      <li onClick={() => navigate('/about')}>About</li>
  //    </ul>
  //  );
  return <HomePageBody />;
};

HomePage.path = '/';

HomePage.getPageData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    foo: 'bar',
    title: 'VizHub',
    description: 'Viz your data',
  };
};
