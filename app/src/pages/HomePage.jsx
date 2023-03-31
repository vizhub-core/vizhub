import { useNavigate } from 'react-router-dom';
import { HomePageBody } from 'components/src/components/HomePageBody';
import { VizKit } from 'api/src/VizKit';

const vizKit = VizKit({ baseUrl: './api' });

// Decoupled navigation from interaction, to support
// testing the UI in isolation, for example in Storybook.
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const HomePage = ({ pageData }) => {
  const navigate = useNavigate();

  const handleEmailSubmit = async (email) => {
    navigate('/beta-confirm');
    console.log('Submitting email ' + email);

    const result = await vizKit.rest.privateBetaEmailSubmit(email);
    if (result.outcome === 'success') {
      console.log('Successfully submitted email!');
    } else if (result.outcome === 'failure') {
      console.log('Error when submitting email.');
      console.log(result.error);
    }
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
