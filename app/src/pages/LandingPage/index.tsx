import { useEffect, useContext } from 'react';
import { LandingPageBodyI18n } from 'components';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';

const vizKit = VizKit();

export type LandingPageData = PageData & {
  description: string;
  image: string;
};

const Body = () => {
  const authenticatedUser = useContext(
    AuthenticatedUserContext,
  );
  return (
    <LandingPageBodyI18n
      isUserAuthenticated={authenticatedUser ? true : false}
    />
  );
};

// Decoupled navigation from interaction, to support
// testing the UI in isolation, for example in Storybook.
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const LandingPage: Page = ({ pageData }) => {
  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      'event.pageview.landing',
    );
  }, []);

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={
        pageData.authenticatedUserSnapshot
      }
    >
      <div className="vh-page overflow-auto">
        <SmartHeader />
        <Body />
      </div>
    </AuthenticatedUserProvider>
  );
};

LandingPage.path = '/features';
// LandingPage.path = '/';
