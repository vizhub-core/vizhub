import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingPageBody } from 'components/src/components/PricingPageBody';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
// import { EditorDemo } from './EditorDemo';
import './styles.scss';

const vizKit = VizKit({ baseUrl: './api' });

export type PricingPageData = PageData & {
  description: string;
  image: string;
};

// Decoupled navigation from interaction, to support
// testing the UI in isolation, for example in Storybook.
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const PricingPage: Page = ({ pageData }) => {
  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents('event.pageview.pricing');
  }, []);

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={pageData.authenticatedUserSnapshot}
    >
      <div className="vh-page overflow-auto">
        <SmartHeader />
        <PricingPageBody />
      </div>
    </AuthenticatedUserProvider>
  );
};

PricingPage.path = '/pricing';
