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
        description="View, fork and modify visualizations viewable by everyone."
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      />
      <Feature
        title="Export Code"
        description="Export code for easy integration into existing codebases."
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      />
      <Feature
        title="Unfurling"
        description="See rich previews when sharing viz links in social media."
        hasBottomBorder={false}
        startsExpanded={startsExpanded}
      />
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
}: {
  onStarterDowngradeClick: () => void;
  onPremiumUpgradeClick: () => void;
  // onEnterpriseClick: () => void;
  isMonthly: boolean;
  setIsMonthly: (isMonthly: boolean) => void;
  currentPlan: Plan;
}) => {
  const handleMonthlyClick = useCallback(() => {
    setIsMonthly(true);
  }, []);

  const handleAnnuallyClick = useCallback(() => {
    setIsMonthly(false);
  }, []);

  const premiumPricePerMonth = isMonthly ? 20 : 12;

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
        'pricing-spirit-premium',
        'pricing-spirit-premium-2',
        'pricing-spirit-premium-4',
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

                <p>Free forever. Ideal for students.</p>
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
                      /mo
                    </h3>
                  </div>
                </div>
                <p>
                  Ideal for freelancers and professionals.
                  30-day free trial.
                </p>
                {currentPlan === 'premium' ? (
                  <CurrentButton />
                ) : (
                  <Button
                    variant="primary"
                    className="pricing-page-plan-button"
                    onClick={onPremiumUpgradeClick}
                  >
                    Upgrade
                  </Button>
                )}

                <div className="pricing-page-plan-features">
                  <Feature
                    title="Private Vizzes"
                    description="Develop visualizations accessible only by you"
                    hasBottomBorder={true}
                    startsExpanded={true}
                  />
                  <Feature
                    title="AI-Assisted Coding"
                    description="Request coding assistance from artificial intelligence"
                    hasBottomBorder={true}
                    startsExpanded={true}
                  />
                  <Feature
                    title="Real-time Collaboration"
                    description="Allow anyone to edit your public vizzes with you in real time."
                    hasBottomBorder={true}
                    startsExpanded={true}
                  />
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
