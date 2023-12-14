import React from 'react';
import './styles.scss';

function Plans() {
  return (
    <div className="plans">
      <h1>VizHub Plans</h1>

      <div className="plan-cards">
        <div className="card starter">
          <h2>Starter</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur
            adipiscing elit.
          </p>
          <button className="current">Current</button>
          <ul>
            <li>Public Vizzes</li>
            <li>Export Code</li>
            <li>Real-time Collaboration</li>
            <li>Unfurling</li>
          </ul>
        </div>

        <div className="card premium">
          <h2>Premium</h2>
          <p>
            Maecenas consequat sagittis orci quis eleifend.
          </p>
          <div className="price">
            <span>$10</span>
            <span>/ mo</span>
          </div>
          <button className="upgrade">Upgrade</button>
          <ul>
            <li>Private Vizzes</li>
            <li>Public Vizzes</li>
            <li>Export Code</li>
            <li>Real-time Collaboration</li>
            <li>Unfurling</li>
          </ul>
        </div>
      </div>

      <div className="toggle-buttons">
        <button>Monthly Plan</button>
        <button>Annual Plan</button>
      </div>
    </div>
  );
}

export const PricingPageBody = ({
  onFreeClick,
  onProClick,
  // onEnterpriseClick,
}) => {
  return (
    <div className="vh-page vh-pricing-page">
      <Plans />
    </div>
  );
};
