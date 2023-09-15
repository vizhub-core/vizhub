import { useCallback, useContext, useEffect } from 'react';
import { PricingPageBody } from 'components/src/components/PricingPageBody';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
// import { setCookie } from '../cookies';
import { UserId } from 'entities';
import Stripe from 'stripe';
import './styles.scss';
import { User } from 'entities';

const vizKit = VizKit({ baseUrl: './api' });
const redirectToCheckout = async (userId: UserId) => {
  const sessionId =
    await vizKit.rest.createCheckoutSession(userId);
  if (sessionId) {
    const stripe = new Stripe('YOUR_PUBLISHABLE_KEY', {
      apiVersion: '2023-08-16',
    }); // Make sure to replace 'YOUR_PUBLISHABLE_KEY' with your Stripe publishable key
    stripe.redirectToCheckout({ sessionId });
  } else {
    console.error(
      'Failed to get a valid session ID for checkout.',
    );
  }
};

export type PricingPageData = PageData & {
  description: string;
  image: string;
};

const Body = () => {
  const authenticatedUser: User | null = useContext(
    AuthenticatedUserContext,
  );

  const handleProClick = useCallback(async () => {
    vizKit.rest.recordAnalyticsEvents(
      'event.click.pricing.pro',
    );
    // Pretend that the user goes through a checkout process...

    if (!authenticatedUser) {
      console.log(
        'TODO handle unauthenticated user - redirect to login?',
      );
      return;
    }

    // TODO bring back toast
    // // Set the cookie to show upgrade success toast on the account page.
    // setCookie('showUpgradeSuccessToast', 'true', 1);

    // // Invoke the fake WebHook to simulate a successful payment.
    // await vizKit.rest.fakeCheckoutSuccess(
    //   authenticatedUser.id,
    // );

    // Navigate to the account page.
    const url = '/account';
    window.location.href = url;
  }, [authenticatedUser]);

  return <PricingPageBody onProClick={handleProClick} />;
};

// Decoupled navigation from interaction, to support
// testing the UI in isolation, for example in Storybook.
// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const PricingPage: Page = ({
  pageData,
}: {
  pageData: PricingPageData;
}) => {
  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      'event.pageview.pricing',
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

PricingPage.path = '/pricing';
