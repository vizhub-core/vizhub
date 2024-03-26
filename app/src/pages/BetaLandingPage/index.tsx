import { useEffect } from 'react';
import { HomePageBody } from 'components';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
// import { EditorDemo } from './EditorDemo';
import './styles.scss';

const vizKit = VizKit();

export type HomePageData = PageData & {
  description: string;
  image: string;
};

// Decoupled navigation from interaction, to support
// testing the UI in isolation, for example in Storybook.
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const HomePage: Page = ({ pageData }) => {
  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      'event.pageview.home',
    );
  }, []);

  const handleEmailSubmit = async (email) => {
    const result =
      await vizKit.rest.privateBetaEmailSubmit(email);
    if (result.outcome === 'success') {
      console.log('Successfully submitted email!');
    } else if (result.outcome === 'failure') {
      console.log('Error when submitting email.');
      console.log(result.error);
    }

    window.location.href = '/beta-confirm';
  };

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={
        pageData.authenticatedUserSnapshot
      }
    >
      <div className="vh-page overflow-auto">
        <SmartHeader />

        <HomePageBody onEmailSubmit={handleEmailSubmit}>
          {/* <div className="demo-blurb-container">
            <div className="demo-blurb">
              <div className="demo-blurb-title">Instant Feedback</div>
              <div className="demo-blurb-description">
                Hold "alt" and drag on the numbers in the code
              </div>
            </div>
          </div>
          <EditorDemo /> */}
        </HomePageBody>
      </div>
    </AuthenticatedUserProvider>
  );
};

HomePage.path = '/beta-landing';
