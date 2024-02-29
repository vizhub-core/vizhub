import { useCallback, useEffect, useState } from 'react';
import { Plan } from 'entities';
import { Footer } from '../Footer';
import { GreenCheckSVG } from '../Icons/sam/GreenCheckSVG';
import {
  Button,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from '../bootstrap';
import { image } from '../image';
import { StarterFeatures } from './StarterFeatures';
import { PremiumFeatures } from './PremiumFeatures';
import './styles.scss';

const premiumPriceMonthly = 9.99;
const premiumPriceAnnually = 99.99;

// The percent saved by paying annually.
const percentSavings = Math.round(
  (1 - premiumPriceAnnually / 12 / premiumPriceMonthly) *
    100,
);

const randomImage = (options) =>
  image(
    options[Math.floor(Math.random() * options.length)],
  );

const headerBackgroundSrc = image('pricing-header-bkg');
// const starterSpiritSrc = image('pricing-spirit-starter');

// image('pricing-spirit-premium-2');
// const professionalSpiritSrc = image(
//   'pricing-spirit-professional',
// );

const starterImages = [
  'pricing-spirit-starter',
  'pricing-spirit-starter-1',
  'pricing-spirit-starter-2',
];
const premiumImages = [
  // 'pricing-spirit-premium',
  'pricing-spirit-premium-2',
  'pricing-spirit-premium-4',
  'pricing-spirit-premium-5',
  'pricing-spirit-premium-6',
  'pricing-spirit-premium-7',
];

const CurrentButton = () => (
  <Button
    variant="success"
    className="pricing-page-plan-button"
  >
    Current
    <GreenCheckSVG />
  </Button>
);

const enableImages = false;

export const PricingPageBody = ({
  onStarterDowngradeClick,
  onPremiumUpgradeClick,
  // onEnterpriseClick,
  isMonthly,
  setIsMonthly,
  currentPlan = 'free',
  enableFreeTrial,
}: {
  onStarterDowngradeClick: () => void;
  onPremiumUpgradeClick: () => void;
  // onEnterpriseClick: () => void;
  isMonthly: boolean;
  setIsMonthly: (isMonthly: boolean) => void;
  currentPlan: Plan;
  enableFreeTrial: boolean;
}) => {
  const handleMonthlyClick = useCallback(() => {
    setIsMonthly(true);
  }, []);

  const handleAnnuallyClick = useCallback(() => {
    setIsMonthly(false);
  }, []);

  const premiumPrice = isMonthly
    ? premiumPriceMonthly
    : premiumPriceAnnually;
  // Make sure there is consistency between the
  // server-side and client-side rendering of the
  // initial pricing page.
  const [starterSpiritSrc, setStarterSpiritSrc] =
    useState(null);

  // On the client only, randomize the image.
  useEffect(() => {
    setStarterSpiritSrc(randomImage(starterImages));
  }, []);

  const [premiumSpiritSrc, setPremiumSpiritSrc] =
    useState(null);

  useEffect(() => {
    setPremiumSpiritSrc(randomImage(premiumImages));
  }, []);

  return (
    <div className="vh-page vh-pricing-page">
      <img
        className="header-background"
        src={headerBackgroundSrc}
        alt="header"
      />
      <div className="pricing-page-body">
        <div className="pricing-page-content">
          <div className="pricing-page-header">
            <h1>VizHub Plans</h1>
            <ButtonGroup aria-label="Billing Cadences">
              <Button
                variant={
                  isMonthly
                    ? 'secondary'
                    : 'outline-secondary'
                }
                onClick={handleMonthlyClick}
              >
                Billed Monthly
              </Button>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="annual-billing-tooltip">
                    Save {percentSavings}%!
                  </Tooltip>
                }
              >
                <Button
                  variant={
                    isMonthly
                      ? 'outline-secondary'
                      : 'secondary'
                  }
                  onClick={handleAnnuallyClick}
                >
                  Billed Annually
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
          </div>
          <div className="pricing-page-plans">
            <div className="pricing-page-plan">
              {enableImages && starterSpiritSrc && (
                <img
                  className="plan-spirit"
                  src={starterSpiritSrc}
                  alt="A student in his dorm room studying dataviz"
                />
              )}

              <div className="pricing-page-plan-body">
                <div className="plan-header">
                  <h3 className="plan-header-left">
                    Starter
                  </h3>
                  <div className="plan-header-right">
                    <h3>Free</h3>
                  </div>
                </div>

                <p>
                  Ideal for beginners, students, and
                  hobbyist.
                </p>
                {currentPlan === 'free' ? (
                  <CurrentButton />
                ) : (
                  <Button
                    variant="primary"
                    className="pricing-page-plan-button"
                    onClick={onStarterDowngradeClick}
                  >
                    Downgrade
                  </Button>
                )}

                <div className="pricing-page-plan-features">
                  <StarterFeatures />
                </div>
              </div>
            </div>
            <div className="pricing-page-plan">
              {enableImages && premiumSpiritSrc && (
                <img
                  className="plan-spirit"
                  src={premiumSpiritSrc}
                  alt="A freelancer working on a client project"
                />
              )}
              <div className="pricing-page-plan-body">
                <div className="plan-header">
                  <h3 className="plan-header-left">
                    Premium
                  </h3>
                  <div className="plan-header-right">
                    <h3>${premiumPrice}</h3>
                    <h3 className="plan-header-right-faint">
                      /{isMonthly ? 'month' : 'year'}
                    </h3>
                  </div>
                </div>
                <p>
                  Ideal for professionals.
                  {enableFreeTrial
                    ? ' Includes 7 day free trial.'
                    : ''}
                </p>
                {currentPlan === 'premium' ? (
                  <CurrentButton />
                ) : (
                  <Button
                    variant="primary"
                    className="pricing-page-plan-button"
                    onClick={onPremiumUpgradeClick}
                  >
                    {enableFreeTrial
                      ? 'Start Free Trial'
                      : 'Upgrade'}
                  </Button>
                )}

                <div className="pricing-page-plan-features">
                  <div className="vh-lede-01 mb-3 vh-color-neutral-02">
                    Everything in{' '}
                    <span style={{ fontWeight: 600 }}>
                      Starter
                    </span>
                    , plus:
                  </div>
                  <PremiumFeatures />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
