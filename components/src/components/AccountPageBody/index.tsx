import { FREE, PREMIUM } from 'entities';
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
        <div className="d-flex flex-column mt-2">
          <h1>Account</h1>
          {!isUserAuthenticated ? (
            <div>
              <p>You are not logged in.</p>
              <Button as="a" href={loginHref}>
                Login
              </Button>
            </div>
          ) : null}
          {currentPlan === FREE ? (
            <div>
              <p>You are currently on the free plan.</p>
              <Button as="a" href={pricingHref}>
                See pricing
              </Button>
            </div>
          ) : null}
          {currentPlan === PREMIUM ? (
            <div>
              <p>You are currently on the premium plan.</p>
              <Button onClick={onUnsubscribeClick}>
                Unsubscribe
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
