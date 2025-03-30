import { useEffect, useContext } from 'react';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import PromptPage from './PromptPage';

const vizKit = VizKit();

export type AILandingPageData = PageData & {
  description: string;
  image: string;
};

const Body = () => {
  const authenticatedUser = useContext(
    AuthenticatedUserContext,
  );
  return <PromptPage />;
};

export const AILandingPage: Page = ({ pageData }) => {
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      'event.pageview.ai-landing',
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

AILandingPage.path = '/ai';
