import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { FeatureId, User } from 'entities';
import { PricingPageBody } from 'components/src/components/PricingPageBody';
import { VizKit } from 'api/src/VizKit';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import {
  AuthenticatedUserContext,
  AuthenticatedUserProvider,
} from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { useOpenBillingPortal } from '../useOpenBillingPortal';
import './styles.scss';

const vizKit = VizKit();

export type PricingPageData = PageData & {
  description: string;
  image: string;
};

const Body = () => {
  const authenticatedUser: User | null = useContext(
    AuthenticatedUserContext,
  );

  // Get the highlighted feature from the URL query string
  // using react-router's useSearchParams hook.
  // e.g. ?feature=ai-assist
  const [searchParams] = useSearchParams();
  const highlightedFeature = useMemo(
    () =>
      searchParams.get('feature') as FeatureId | undefined,
    [searchParams],
  );

  // Default to monthly billing.
  const [isMonthly, setIsMonthly] = useState(true);

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

  // TODO make this happen!
  const handleProfessionalUpgradeClick = useCallback(() => {
    console.log('Professional upgrade clicked');
  }, []);

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
      onProfessionalUpgradeClick={
        handleProfessionalUpgradeClick
      }
      isMonthly={isMonthly}
      setIsMonthly={setIsMonthly}
      currentPlan={authenticatedUser?.plan}
      highlightedFeature={highlightedFeature}
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
