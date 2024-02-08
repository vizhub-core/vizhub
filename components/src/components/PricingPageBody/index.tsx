import { useCallback, useEffect, useState } from 'react';
import {
  Plan,
  freeTierSizeLimitMB,
  premiumTierSizeLimitMB,
} from 'entities';
import { Footer } from '../Footer';
import { GreenCheckSVG } from '../Icons/sam/GreenCheckSVG';
import { Button, ButtonGroup } from '../bootstrap';
import { Feature } from './Feature';
import { image } from '../image';
import './styles.scss';

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

const StarterFeatures = ({ startsExpanded = false }) => {
  return (
    <>
      <Feature
        title="Public Vizzes"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        View, fork and modify visualizations viewable by
        everyone.
      </Feature>
      <Feature
        title="Hot Reloading & Interactive Widgets"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        Develop with instant feedback, tweak numbers and
        colors with ease.
      </Feature>
      <Feature
        title="Export Code"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        Export Vanilla JavaScript for integration into
        existing codebases.
      </Feature>
      <Feature
        title="Community Access"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        Join our{' '}
        <a href="https://discord.gg/wbtJ7SCtYr">Discord</a>{' '}
        and <a href="">Forum</a> to connect with our
        community.
      </Feature>
      <Feature
        title="Free Courses"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        Learn to code and visualize data with our{' '}
        <a href="https://vizhub.com/forum/t/index-of-courses/289">
          free online courses
        </a>
        .
      </Feature>
      <Feature
        title="Limited Data Size"
        hasBottomBorder={false}
        startsExpanded={startsExpanded}
      >
        Data uploads are limited to {freeTierSizeLimitMB}
        MB.
      </Feature>
    </>
  );
};

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

  const premiumPricePerMonth = isMonthly ? 9.99 : 99.99;

  // Make sure there is consistency between the
  // server-side and client-side rendering of the
  // initial pricing page.
  const [starterSpiritSrc, setStarterSpiritSrc] = useState(
    image(starterImages[0]),
  );

  // On the client only, randomize the image.
  useEffect(() => {
    setStarterSpiritSrc(randomImage(starterImages));
  }, []);

  const [premiumSpiritSrc, setPremiumSpiritSrc] = useState(
    image(premiumImages[0]),
  );

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
            </ButtonGroup>
          </div>
          <div className="pricing-page-plans">
            <div className="pricing-page-plan">
              {enableImages && (
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

                <p>Ideal for beginners.</p>
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
              {enableImages && (
                <img
                  className="plan-spirit"
                  src={premiumSpiritSrc}
                  alt="A digital nomad freelancer working on a client project"
                />
              )}
              <div className="pricing-page-plan-body">
                <div className="plan-header">
                  <h3 className="plan-header-left">
                    Premium
                  </h3>
                  <div className="plan-header-right">
                    <h3>${premiumPricePerMonth}</h3>
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
                  <Feature
                    title="AI-Assisted Coding"
                    hasBottomBorder={true}
                    learnMoreHref="https://vizhub.com/forum/t/ai-assisted-coding/952"
                    startsExpanded={true}
                  >
                    Request coding assistance from
                    artificial intelligence, which types
                    directly into your editor! Powered by
                    GPT-4.
                  </Feature>
                  <Feature
                    title="Private Vizzes"
                    hasBottomBorder={true}
                  >
                    Develop visualizations accessible only
                    by you and your collaborators.
                  </Feature>
                  <Feature
                    title="Unlimited Real-Time Collaborators"
                    hasBottomBorder={true}
                  >
                    Invite colleagues to collaborate in
                    real-time on your vizzes.
                  </Feature>
                  <Feature title="Upload Larger Datasets">
                    Data uploads are limited to{' '}
                    {premiumTierSizeLimitMB}
                    MB.
                  </Feature>
                  {/* <StarterFeatures startsExpanded={false} /> */}
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
