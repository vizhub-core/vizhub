import { Button, ButtonGroup } from '../bootstrap';
import './styles.scss';

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
              <h3>Starter</h3>
              <p>
                Free forever. For individuals and small
                teams.
              </p>
              <Button
                variant="primary"
                onClick={onFreeClick}
                className="pricing-page-plan-button"
              >
                Get Started
              </Button>
              <ul>
                <li>Public Vizzes</li>
                <li>Export Code</li>
                <li>Real-time Collaboration</li>
                <li>Unfurling</li>
              </ul>
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
          {/* <div className="pricing-page-plan">
              <h2>Enterprise</h2>
              <p>
                $100 / mo. For large teams and organizations.
              </p>
              <Button
                variant="primary"
                onClick={onEnterpriseClick}
                className="pricing-page-plan-button"
              >
                Contact Us
              </Button>
              <ul>
                <li>Private Vizzes</li>
                <li>Public Vizzes</li>
                <li>Export Code</li>
                <li>Real-time Collaboration</li>
                <li>Unfurling</li>
              </ul>
            </div> */}
        </div>
      </div>
    </div>
  );
};
