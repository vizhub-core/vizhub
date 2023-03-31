import { useNavigate } from 'react-router-dom';
import { HomePageBody } from 'components/src/components/HomePageBody';
import { VizKit } from 'api/src/VizKit';
// Decoupled navigation from interaction, to support
// testing the UI in isolation, for example in Storybook.
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const HomePage = ({ pageData }) => {
  const navigate = useNavigate();

  const handleEmailSubmit = (email) => {
    navigate('/beta-confirm');

    const vizKit = VizKit({ baseUrl: './api' });
    vizKit.rest.test().then((result) => {
      console.log(result);
    });
    console.log('TODO handle email submit for ' + email);
  };
  //  console.log('pageData in HomePage:');
  //  console.log(pageData);
  //  return (
  //    <ul>
  //      <li onClick={() => navigate('/about')}>About</li>
  //    </ul>
  //  );
  return <HomePageBody onEmailSubmit={handleEmailSubmit} />;
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
