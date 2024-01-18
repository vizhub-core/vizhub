import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PricingPageBody } from 'components/src/components/PricingPageBody';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { User } from 'entities';
import { useOpenBillingPortal } from '../useOpenBillingPortal';
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

  // Default to monthly billing.
  const [isMonthly, setIsMonthly] = useState(true);

  // Only enable one free trial per user.
  const enableFreeTrial = authenticatedUser
    ? !authenticatedUser.stripeCustomerId
    : true;

  // When the user clicks "Upgrade" in the Premium card.
  const handlePremiumUpgradeClick =
    useCallback(async () => {
      // Record analytics of the click.
      vizKit.rest.recordAnalyticsEvents(
        'event.click.pricing.premium.upgrade',
      );

      // If the user is not logged in,

      // make them log in first.
      if (!authenticatedUser) {
        console.log(
          'TODO handle unauthenticated user - redirect to login?',
        );

        // TODO get this redirect working
        const url = '/login?redirect=pricing';

        window.location.href = url;

        return;
      }

      // Create a Stripe Checkout session.
      const createCheckoutSessionResult =
        await vizKit.rest.createCheckoutSession({
          userId: authenticatedUser.id,
          isMonthly,
          discountCode:
            typeof window !== 'undefined' &&
            // Extract from the URL query string.
            // e.g. ?discountCode=abc123
            new URLSearchParams(window.location.search).get(
              'discountCode',
            ),
        });
      if (
        createCheckoutSessionResult.outcome === 'failure'
      ) {
        console.error(
          'Error creating checkout session',
          createCheckoutSessionResult.error,
        );
        return;
      }

      // Redirect the user to the Stripe Checkout page.
      const { sessionURL } =
        createCheckoutSessionResult.value;
      window.location.href = sessionURL;

      // TODO bring back toast
      // // Set the cookie to show upgrade success toast on the account page.
      // setCookie('showUpgradeSuccessToast', 'true', 1);
    }, [authenticatedUser, isMonthly]);

  const openBillingPortal = useOpenBillingPortal({
    vizKit,
    authenticatedUser,
  });

  // When the user clicks "Downgrade" in the Starter card.
  const handleStarterDowngradeClick =
    useCallback(async () => {
      // Record analytics of the click.
      vizKit.rest.recordAnalyticsEvents(
        'event.click.pricing.starter.downgrade',
      );
      openBillingPortal();
    }, [openBillingPortal]);

  return (
    <PricingPageBody
      onPremiumUpgradeClick={handlePremiumUpgradeClick}
      onStarterDowngradeClick={handleStarterDowngradeClick}
      isMonthly={isMonthly}
      setIsMonthly={setIsMonthly}
      currentPlan={authenticatedUser?.plan}
      enableFreeTrial={enableFreeTrial}
    />
  );
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
