import { useEffect } from 'react';
import { ResourcesPageBody } from 'components';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';

const vizKit = VizKit();

export type ResourcesPageData = PageData & {
  description: string;
  image: string;
};

export const ResourcesPage: Page = ({ pageData }) => {
  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      'event.pageview.resources',
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
        <ResourcesPageBody />
      </div>
    </AuthenticatedUserProvider>
  );
};

ResourcesPage.path = '/resources';
