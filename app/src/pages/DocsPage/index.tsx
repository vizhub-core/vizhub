import { useEffect, useContext } from 'react';
import { Documentation } from 'components';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';

const vizKit = VizKit();

export type DocsPageData = PageData & {
  description: string;
  image: string;
};

const Body = () => {
  const authenticatedUser = useContext(
    AuthenticatedUserContext,
  );
  return <Documentation />;
};

export const DocsPage: Page = ({ pageData }) => {
  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      'event.pageview.docs',
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

DocsPage.path = '/docs';
