import { useCallback, useState } from 'react';
import { GreenCheckSVG } from '../Icons/sam/GreenCheckSVG';
import { Button, ButtonGroup } from '../bootstrap';
import { Feature } from './Feature';
import './styles.scss';

const headerBackgroundSrc =
  'https://gist.github.com/assets/68416/5c51a6f3-2665-4117-82c7-069b089deaca.png';

export const PricingPageBody = ({
  onFreeClick,
  onProClick,
  // onEnterpriseClick,
}) => {
  const [isMonthly, setIsMonthly] = useState(false);

  const handleMonthlyClick = useCallback(() => {
    setIsMonthly(true);
  }, []);

  const handleAnnuallyClick = useCallback(() => {
    setIsMonthly(false);
  }, []);

  const premiumPricePerMonth = isMonthly ? 20 : 12;

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
              <div className="plan-header">
                <h3 className="plan-header-left">
                  Starter
                </h3>
                <div className="plan-header-right">
                  <h3>Free</h3>
                </div>
              </div>

              <p>Free forever. Ideal for students.</p>
              <Button
                variant="success"
                className="pricing-page-plan-button"
              >
                Current
                <GreenCheckSVG />
              </Button>
              <div className="pricing-page-plan-features">
                <Feature
                  title="Public Vizzes"
                  description="View, fork and modify visualizations viewable by everyone."
                  hasBottomBorder={true}
                />
                <Feature
                  title="Export Code"
                  description="Export code for easy integration into existing codebases."
                  hasBottomBorder={true}
                />
                <Feature
                  title="Real-time Collaboration"
                  description="Allow anyone to edit with you in real time."
                  hasBottomBorder={true}
                />
                <Feature
                  title="Unfurling"
                  description="See rich previews when sharing viz links in social media."
                  hasBottomBorder={false}
                />
              </div>
            </div>
            <div className="pricing-page-plan">
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
              </p>
              <Button
                variant="primary"
                className="pricing-page-plan-button"
                onClick={onProClick}
              >
                Upgrade
              </Button>
              <div className="pricing-page-plan-features">
                <Feature
                  title="Private Vizzes"
                  description="Develop visualizations accessible only by you and your collaborators."
                  hasBottomBorder={false}
                  startsExpanded={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
