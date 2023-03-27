import React from 'react';
import PropTypes from 'prop-types';
import { Header } from '../Header';
import '../index.scss';
import './pricing-page.scss';

const plans = {
  free: {
    name: 'Free',
    pricing: { price: 0, unit: 'forever' },
    bullets: [
      'Public vizzes',
      'Public folders',
      'Public collections',
      'Public organizations',
      //'Pinned vizzes',
      //'Upvote vizzes',
      //"See vizzes you've upvoted",
      'Search public content',
      'Comments with mentions',
      'Interactive code editor',
      'Continuous hot reloading',
      'ES modules and JSX support',
      'Export to standard JavaScript',
      'Import from CSV and JSON',
      'Import from other vizzes',
      //'Automatic code formatting',
      'Multiplayer editing',
      'Pull requests',
      'Revision history',
      'Social media sharing',
      'Branded embedding',
      'Order physical canvas prints',
      //'Migrate content from bl.ocks.org',
      'VizHub Forum access',
    ],
    callToAction: {
      text: 'Sign up for free',
      isOutline: true,
    },
  },
  pro: {
    name: 'Pro',
    pricing: { price: 15, unit: 'per user per month' },
    previousPlanBullet: 'Everything in Free',
    bullets: [
      'Private & unlisted vizzes',
      'Private & unlisted folders',
      'Private & unlisted collections',
      'Private organizations',
      'Search private content',
      'No-code viz configuration editor',
      'Programmatically edit files',
      'Advanced access control',
      //'Organization analytics',
      'Password protected sharing',
      //'Encrypted vizzes',
      'In-platform meetings',
      //'Record and live-stream meetings',
      'GitHub integration',
      'White-label embedding',
      'VizHub Pages (microsite hosting)',
      'Custom domains',
      'High resolution image export',
      //'Automatic data updating API',
    ],
    callToAction: {
      text: 'Get started',
      isOutline: false,
    },
  },
  enterprise: {
    name: 'Enterprise',
    pricing: { price: 45, unit: 'per user per month' },
    previousPlanBullet: 'Everything in Pro',
    bullets: [
      'Self hosting',
      'Single sign-on',
      'HIPAAcompliance',
      'FedRAMP compliance',
      'Dedicated support',
    ],
    callToAction: {
      text: 'Contact us',
      isOutline: true,
    },
  },
};

// TODO move to icons
const CheckSVG = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
  </svg>
);

// const ArrowLeftSVG = () => (
//   <svg
//     width="16"
//     height="16"
//     fill="currentColor"
//     viewBox="0 0 16 16"
//   >
//     <path d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
//   </svg>
// );

// TODO move to icons
const ArrowLeftShortSVG = () => (
  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z" />
  </svg>
);

// TODO split out
const PlanCard = ({
  plan: { name, previousPlanBullet, bullets, pricing, callToAction },
  onClick,
}) => (
  <div className="col">
    <div className="card mb-4 rounded-3">
      <div className="card-header py-3">
        <h4 className="my-0 fw-normal">{name}</h4>
      </div>
      <div className="card-body">
        <h1 className="card-title pricing-card-title">${pricing.price}</h1>
        {pricing.unit ? (
          <small className="text-muted">{pricing.unit}</small>
        ) : null}
        <ul className="list-unstyled mt-3 mb-4 mx-2 text-start">
          {previousPlanBullet ? (
            <li>
              <span className="mx-2">
                <ArrowLeftShortSVG />
              </span>
              {previousPlanBullet}
            </li>
          ) : null}
          {bullets.map((bullet) => (
            <li>
              <span className="mx-2">
                <CheckSVG />
              </span>
              {bullet}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className={`w-100 btn btn-lg ${
            callToAction.isOutline ? 'btn-outline-primary' : 'btn-primary'
          }`}
          onClick={onClick}
        >
          {callToAction.text}
        </button>
      </div>
    </div>
  </div>
);

export const PricingPage = ({
  onFreeClick,
  onProClick,
  onEnterpriseClick,

  // Header props
  user,
  onLogin,
  onLogout,
  onCreateViz,
  onProfile,
  onForum,
  onVizHub,
}) => {
  return (
    <div className="vh-page vh-pricing-page">
      <Header
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        onCreateViz={onCreateViz}
        onProfile={onProfile}
        onForum={onForum}
        onVizHub={onVizHub}
      />
      <div className="container py-4">
        <div className="row row-cols-1 row-cols-lg-3 mb-3 text-center">
          <PlanCard plan={plans.free} onClick={onFreeClick} />
          <PlanCard plan={plans.pro} onClick={onProClick} />
          <PlanCard plan={plans.enterprise} onClick={onEnterpriseClick} />
        </div>
      </div>
    </div>
  );
};

PricingPage.propTypes = {
  onFreeClick: PropTypes.func.isRequired,
  onProClick: PropTypes.func.isRequired,
  onEnterpriseClick: PropTypes.func.isRequired,
  ...Header.propTypes,
};
