import { useCallback, useMemo } from 'react';
import { Plan } from 'entities';
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

const StarterFeatures = ({ startsExpanded = true }) => {
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
        Join our Discord and Forum to connect with our
        community.
      </Feature>
      <Feature
        title="Free Courses"
        hasBottomBorder={false}
        startsExpanded={startsExpanded}
      >
        Learn to code and visualize data with our free
        online courses.
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

  const starterSpiritSrc = useMemo(
    () =>
      randomImage([
        'pricing-spirit-starter',
        'pricing-spirit-starter-1',
        'pricing-spirit-starter-2',
      ]),
    [],
  );

  const premiumSpiritSrc = useMemo(
    () =>
      randomImage([
        // 'pricing-spirit-premium',
        'pricing-spirit-premium-2',
        'pricing-spirit-premium-4',
        'pricing-spirit-premium-5',
        'pricing-spirit-premium-6',
        'pricing-spirit-premium-7',
      ]),
    [],
  );
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
              <img
                className="plan-spirit"
                src={starterSpiritSrc}
                alt="A student in his dorm room studying dataviz"
              />
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
                  Free forever. Ideal for students and
                  hobbyists.
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
              <img
                className="plan-spirit"
                src={premiumSpiritSrc}
                alt="A digital nomad freelancer working on a client project"
              />
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
                  Ideal for freelancers and professionals.
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
                  <Feature
                    title="Private Vizzes"
                    hasBottomBorder={true}
                    startsExpanded={true}
                  >
                    Develop visualizations accessible only
                    by you and your collaborators.
                  </Feature>
                  <Feature
                    title="Unlimited Collaborators"
                    hasBottomBorder={true}
                    startsExpanded={true}
                  >
                    Invite colleagues to collaborate in
                    real-time on your vizzes.
                  </Feature>
                  <Feature
                    title="AI-Assisted Coding"
                    hasBottomBorder={true}
                    heavyBottomBorder={true}
                    startsExpanded={true}
                  >
                    Request in-editor coding assistance from
                    artificial intelligence (GPT-4).
                  </Feature>
                  <StarterFeatures startsExpanded={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
