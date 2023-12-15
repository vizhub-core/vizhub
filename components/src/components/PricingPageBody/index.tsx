import { useCallback, useState } from 'react';
import { GreenCheckSVG } from '../Icons/sam/GreenCheckSVG';
import { Button, ButtonGroup } from '../bootstrap';
import './styles.scss';
import { ChevronDownSVG } from '../Icons/sam/ChevronDownSVG';
import { ChevronUpSVG } from '../Icons/sam/ChevronUpSVG';

const headerBackgroundSrc =
  'https://gist.github.com/assets/68416/5c51a6f3-2665-4117-82c7-069b089deaca.png';

// function Plans() {
//   return (
//     <div className="plans-container">
//       <h1 className="plans-title">VizHub Plans</h1>
//       <div className="plans">
//         <div className="plan">
//           <div className="plan-header">
//             <h2 className="plan-title">Starter</h2>
//             <p className="plan-description">
//               Lorem ipsum dolor sit amet, consectetur
//               adipiscing elit.
//             </p>
//             <button className="btn current">Current</button>
//           </div>
//           <ul className="plan-features">
//             <li>Public Vizzes</li>
//             <li>Export Code</li>
//             <li>Real-time Collaboration</li>
//             <li>Unfurling</li>
//           </ul>
//         </div>
//         <div className="plan">
//           <div className="plan-header">
//             <h2 className="plan-title">Premium</h2>
//             <p className="plan-description">
//               Maecenas consequat sagittis orci quis
//               eleifend.
//             </p>
//             <div className="plan-price">$10 / mo</div>
//             <button className="btn upgrade">Upgrade</button>
//           </div>
//           <ul className="plan-features">
//             <li>Private Vizzes</li>
//             <li>Public Vizzes</li>
//             <li>Export Code</li>
//             <li>Real-time Collaboration</li>
//             <li>Unfurling</li>
//           </ul>
//         </div>
//       </div>
//       <div className="plan-switch">
//         <button className="btn switch">Monthly Plan</button>
//         <button className="btn switch">Annual Plan</button>
//       </div>
//     </div>
//   );
// }
const Feature = ({
  title,
  description,
  hasBottomBorder,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleIsOpen = useCallback(() => {
    setIsOpen((isOpen) => !isOpen);
  }, []);
  return (
    <div
      className={`feature${
        hasBottomBorder ? ' has-bottom-border' : ''
      }`}
      onClick={toggleIsOpen}
    >
      <div className="feature-header">
        <div className="feature-title">
          <GreenCheckSVG />
          {title}
        </div>
        <div className="feature-toggle">
          {isOpen ? <ChevronUpSVG /> : <ChevronDownSVG />}
        </div>
      </div>
      {isOpen && (
        <div className="feature-description">
          {description}
        </div>
      )}
    </div>
  );
};
export const PricingPageBody = ({
  onFreeClick,
  onProClick,
  // onEnterpriseClick,
}) => {
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
              <Button variant="secondary">
                Billed Monthly
              </Button>
              <Button variant="outline-secondary">
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
                <h3 className="plan-header-right">Free</h3>
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
                  description="Export industry-standard code files for easy integration into existing codebases."
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
              <h3>Premium</h3>
              <p>
                $10 / mo. For individuals and small teams.
              </p>
              <Button
                variant="primary"
                onClick={onProClick}
                className="pricing-page-plan-button"
              >
                Upgrade
              </Button>
              <ul>
                <li>Private Vizzes</li>
                <li>Public Vizzes</li>
                <li>Export Code</li>
                <li>Real-time Collaboration</li>
                <li>Unfurling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
