import './styles.scss';
import { Page, PageData } from '../../Page';
import { SvelteAndD3PageBody } from 'components';
import { useContext, useEffect } from 'react';
import { VizKit } from 'api/src/VizKit';
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from '../../../contexts/AuthenticatedUserContext';
import { SmartHeader } from '../../../smartComponents/SmartHeader';

export type SvelteAndD3PageData = PageData;

const vizKit = VizKit();

const Body = () => {
  const authenticatedUser = useContext(
    AuthenticatedUserContext,
  );
  return (
    <SvelteAndD3PageBody
      isUserAuthenticated={authenticatedUser ? true : false}
    />
  );
};

export const SvelteAndD3Page: Page = ({
  pageData,
}: {
  pageData: SvelteAndD3PageData;
}) => {
  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      'event.pageview.community.svelte-and-d3',
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

SvelteAndD3Page.path = '/community/svelte-and-d3';
