import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomePageBody, Header } from 'components';
import { VizKit } from 'api/src/VizKit';
import { EditorDemo } from './EditorDemo';
import './styles.scss';

const vizKit = VizKit({ baseUrl: './api' });

// Decoupled navigation from interaction, to support
// testing the UI in isolation, for example in Storybook.
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const HomePage = ({ pageData }) => {
  const navigate = useNavigate();

  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.sendEvent('pageview.home');
  }, []);

  const handleEmailSubmit = async (email) => {
    navigate('/beta-confirm');

    const result = await vizKit.rest.privateBetaEmailSubmit(email);
    if (result.outcome === 'success') {
      console.log('Successfully submitted email!');
    } else if (result.outcome === 'failure') {
      console.log('Error when submitting email.');
      console.log(result.error);
    }
  };

  const authenticatedUserAvatarURL = pageData.auth0User
    ? pageData.auth0User.picture
    : null;

  const handleLoginClick = useCallback(() => {
    window.location.href = '/login';
  }, []);

  const handleLogoutClick = useCallback(() => {
    window.location.href = '/logout';
  }, []);

  return (
    <div className="vh-page overflow-auto">
      <Header
        onLoginClick={handleLoginClick}
        onLogoutClick={handleLogoutClick}
        authenticatedUserAvatarURL={authenticatedUserAvatarURL}
      ></Header>
      <HomePageBody onEmailSubmit={handleEmailSubmit}>
        <div className="demo-blurb-container">
          <div className="demo-blurb">
            <div className="demo-blurb-title">Instant Feedback</div>
            <div className="demo-blurb-description">
              Hold "alt" and drag on the numbers in the code
            </div>
          </div>
        </div>
        <EditorDemo />
      </HomePageBody>
    </div>
  );
};

HomePage.path = '/';
