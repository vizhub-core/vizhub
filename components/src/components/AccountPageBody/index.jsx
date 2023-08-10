import React from 'react';
import { Button } from '../bootstrap';
import './styles.scss';

export const AccountPageBody = ({
  isUserAuthenticated,
  pricingHref,
  loginHref,
  onUnsubscribeClick,
  currentPlan,
}) => {
  return (
    <div className="vh-page vh-account-page">
      <div className="px-4 py-3">
        <div className="d-flex flex-column">
          <h1>Your Account</h1>
          {!isUserAuthenticated ? (
            <div>
              <p>You are not logged in.</p>
              <Button as="a" href={loginHref}>
                Login
              </Button>
            </div>
          ) : null}
          {currentPlan === 'free' ? (
            <div>
              <p>You are currently on the free plan.</p>
              <Button as="a" href={pricingHref}>
                See pricing
              </Button>
            </div>
          ) : null}
          {currentPlan === 'pro' ? (
            <div>
              <p>You are currently on the pro plan.</p>
              <p>
                During the current private beta testing period, it looks like
                you're a paying customer, but we're not actually collecting any
                payments. Once the beta program ends, your account will revert
                back to the free plan, and your private vizzes will become
                read-only until you upgrade to an actual paid account.
              </p>
              <Button onClick={onUnsubscribeClick}>Unsubscribe</Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
