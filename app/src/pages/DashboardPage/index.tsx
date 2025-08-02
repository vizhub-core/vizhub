import { useEffect } from 'react';
import { DashboardPageBody } from 'components';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';

const vizKit = VizKit();

export type DashboardPageData = PageData & {
  description: string;
  image: string;
};

export const DashboardPage: Page = ({ pageData }) => {
  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      'event.pageview.dashboard',
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
        <DashboardPageBody />
      </div>
    </AuthenticatedUserProvider>
  );
};

DashboardPage.path = '/dashboard';
