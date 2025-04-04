import { User } from 'entities';
import { useCallback } from 'react';

export const useOpenBillingPortal = ({
  vizKit,
  authenticatedUser,
}: {
  vizKit: any;
  authenticatedUser: User | null;
}) =>
  useCallback(async () => {
    if (!authenticatedUser) {
      console.error(
        'Cannot open billing portal for unauthenticated user',
      );
      return;
    }
    // Create a Stripe Billing Portal session.
    const createBillingPortalSessionResult =
      await vizKit.rest.createBillingPortalSession({
        userId: authenticatedUser.id,
      });
    if (
      createBillingPortalSessionResult.outcome === 'failure'
    ) {
      console.error(
        'Error creating billiung portal session',
        createBillingPortalSessionResult.error,
      );
      return;
    }

    // Redirect the user to the Stripe Billing Portal page.
    const { sessionURL } =
      createBillingPortalSessionResult.value;
    window.location.href = sessionURL;
  }, [authenticatedUser, vizKit]);
