import { useCallback, useContext, useEffect } from 'react';
import { PricingPageBody } from 'components/src/components/PricingPageBody';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { User } from 'entities';
import './styles.scss';

const vizKit = VizKit({ baseUrl: './api' });

export type PricingPageData = PageData & {
  description: string;
  image: string;
};

const Body = () => {
  const authenticatedUser: User | null = useContext(
    AuthenticatedUserContext,
  );

  const handleProClick = useCallback(async () => {
    // If the user is not logged in,

    // make them log in first.
    if (!authenticatedUser) {
      console.log(
        'TODO handle unauthenticated user - redirect to login?',
      );

      //   <Button
      //   as="a"
      //   href={`/login?redirect=${currentPageURL}`}
      //   className="vh-header-button"
      // >
      //   Log in
      // </Button>;
      const url = '/login?redirect=pricing';

      window.location.href = url;

      return;
    } else {
      // https://stripe.com/docs/checkout/quickstart
      //   <form action="/create-checkout-session" method="POST">
      //   <button type="submit" id="checkout-button">Checkout</button>
      // </form>
      //
      // res.redirect(303, session.url);
    }
    // Invoke vizKit.rest.createCheckoutSession to create a Stripe Checkout Session.
    const createCheckoutSessionResult =
      await vizKit.rest.createCheckoutSession(
        authenticatedUser.id,
      );

    if (createCheckoutSessionResult.result === 'error') {
      console.error(
        'TODO handle error',
        createCheckoutSessionResult.error,
      );
      return;
    }

    const { sessionURL } =
      createCheckoutSessionResult.value;
    // Redirect the user to the Stripe Checkout page.
    window.location.href = sessionURL;

    vizKit.rest.recordAnalyticsEvents(
      'event.click.pricing.pro',
    );
    // // Pretend that the user goes through a checkout process...

    // TODO bring back toast
    // // Set the cookie to show upgrade success toast on the account page.
    // setCookie('showUpgradeSuccessToast', 'true', 1);
    // // Invoke the fake WebHook to simulate a successful payment.
    // await vizKit.rest.fakeCheckoutSuccess(
    //   authenticatedUser.id,
    // );
    // Navigate to the account page.
    // const url = '/account';
    // window.location.href = url;
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
