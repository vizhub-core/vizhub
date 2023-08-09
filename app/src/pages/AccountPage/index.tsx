import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountPageBody } from 'components/src/components/AccountPageBody';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { setCookie } from '../cookies';
// import { EditorDemo } from './EditorDemo';
import './styles.scss';

const vizKit = VizKit({ baseUrl: './api' });

export type AccountPageData = PageData & {
  description: string;
  image: string;
};

// Decoupled navigation from interaction, to support
// testing the UI in isolation, for example in Storybook.
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const AccountPage: Page = ({ pageData }) => {
  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents('event.pageview.Account');
  }, []);

  const handleProClick = useCallback(() => {
    vizKit.rest.recordAnalyticsEvents('event.click.Account.pro');
    // Pretend that the user goes through a checkout process...

    // Set the cookie to show upgrade success toast on the account page.
    setCookie('showUpgradeSuccessToast', 'true', 1);

    // Navigate to the account page.
    const url = '/account';
    window.location.href = url;
  }, []);

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={pageData.authenticatedUserSnapshot}
    >
      <div className="vh-page overflow-auto">
        <SmartHeader />
        <AccountPageBody onProClick={handleProClick} />
      </div>
    </AuthenticatedUserProvider>
  );
};

AccountPage.path = '/Account';
