import React from 'react';
import './styles.scss';

export const FREE = 'free';
export const BASIC = 'basic';
export const PRO = 'pro';

const features = [
  {
    title: 'Vizzes with HTML, CSS & JavaScript',
    plans: { [FREE]: true, [BASIC]: true, [PRO]: true },
  },
  {
    title: 'ES6 Modules',
    plans: { [FREE]: true, [BASIC]: true, [PRO]: true },
  },
  {
    title: 'Export',
    plans: { [FREE]: true, [BASIC]: true, [PRO]: true },
  },
  {
    title: 'Package.json',
    plans: { [FREE]: true, [BASIC]: true, [PRO]: true },
  },
  {
    title: 'React with JSX',
    plans: { [FREE]: true, [BASIC]: true, [PRO]: true },
  },
  {
    title: 'Real-Time Broadcast',
    plans: { [FREE]: true, [BASIC]: true, [PRO]: true },
  },
  {
    title: 'Embedding',
    plans: { [FREE]: true, [BASIC]: true, [PRO]: true },
  },
  {
    title: 'Snippet Embedding',
    plans: { [FREE]: true, [BASIC]: true, [PRO]: true },
  },
  {
    title: 'Real-Time Collaboration 2 editors',
    plans: { [FREE]: true, [BASIC]: true, [PRO]: true },
  },
  {
    title: 'Private Vizzes',
    plans: { [FREE]: false, [BASIC]: true, [PRO]: true },
  },
  {
    title: 'Unlimited Collaborators',
    plans: { [FREE]: false, [BASIC]: false, [PRO]: true },
  },
  {
    title: 'Whitelabel Embedding',
    plans: { [FREE]: false, [BASIC]: false, [PRO]: true },
  },
];

const showProPlan = true;

const plans = [
  { id: FREE, label: 'Free' },
  {
    id: BASIC,
    label: 'Basic',
    subtext: ['$4 / month'],
  },
  showProPlan && {
    id: PRO,
    label: 'Pro',
    subtext: ['$12 / month'],
  },
].filter(Boolean);

// TODO move to icons
const CheckSVG = () => (
  <svg
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
  >
    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
  </svg>
);

const PlanIncludedSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40">
    <rect
      width="40"
      height="40"
      rx="20"
      fill="#70FF00"
      fillOpacity="0.2"
    />
    <path
      d="M20.0023 30C17.3502 30 14.8066 28.9464 12.9313 27.0711C11.0559 25.1957 10.0023 22.6522 10.0023 20C10.0023 17.3478 11.0559 14.8043 12.9313 12.9289C14.8066 11.0536 17.3502 10 20.0023 10C22.6545 10 25.198 11.0536 27.0734 12.9289C28.9488 14.8043 30.0023 17.3478 30.0023 20C30.0023 22.6522 28.9488 25.1957 27.0734 27.0711C25.198 28.9464 22.6545 30 20.0023 30ZM20.0023 28C22.1241 28 24.1589 27.1571 25.6592 25.6569C27.1595 24.1566 28.0023 22.1217 28.0023 20C28.0023 17.8783 27.1595 15.8434 25.6592 14.3431C24.1589 12.8429 22.1241 12 20.0023 12C17.8806 12 15.8458 12.8429 14.3455 14.3431C12.8452 15.8434 12.0023 17.8783 12.0023 20C12.0023 22.1217 12.8452 24.1566 14.3455 25.6569C15.8458 27.1571 17.8806 28 20.0023 28ZM17.7023 19.3L19.0023 20.59L22.3023 17.29C22.4948 17.1274 22.7415 17.0435 22.9931 17.055C23.2448 17.0664 23.4829 17.1725 23.6597 17.3519C23.8366 17.5312 23.9392 17.7708 23.9471 18.0226C23.955 18.2744 23.8676 18.5199 23.7023 18.71L19.7023 22.71C19.5154 22.8932 19.2641 22.9959 19.0023 22.9959C18.7406 22.9959 18.4892 22.8932 18.3023 22.71L16.3023 20.71C16.137 20.5199 16.0496 20.2744 16.0575 20.0226C16.0654 19.7708 16.168 19.5312 16.3449 19.3519C16.5218 19.1725 16.7598 19.0664 17.0115 19.055C17.2632 19.0435 17.5099 19.1274 17.7023 19.29V19.3Z"
      fill="#73D129"
    />
  </svg>
);

const PlanExcludedSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40">
    <rect
      width="40"
      height="40"
      rx="20"
      fill="#FF006B"
      fillOpacity="0.24"
    />
    <path
      d="M24.2205 22.8105C24.3843 23.0018 24.4699 23.2478 24.4602 23.4995C24.4504 23.7512 24.3461 23.9899 24.168 24.168C23.9899 24.3461 23.7512 24.4504 23.4995 24.4602C23.2478 24.4699 23.0018 24.3843 22.8105 24.2205L19.9805 21.3905L17.1505 24.2205C16.9592 24.3843 16.7131 24.4699 16.4614 24.4602C16.2097 24.4504 15.971 24.3461 15.7929 24.168C15.6148 23.9899 15.5105 23.7512 15.5007 23.4995C15.491 23.2478 15.5766 23.0018 15.7405 22.8105L18.5705 19.9805L15.7405 17.1505C15.5766 16.9592 15.491 16.7131 15.5007 16.4614C15.5105 16.2097 15.6148 15.971 15.7929 15.7929C15.971 15.6148 16.2097 15.5105 16.4614 15.5007C16.7131 15.491 16.9592 15.5766 17.1505 15.7405L19.9805 18.5705L22.8105 15.7405C23.0018 15.5766 23.2478 15.491 23.4995 15.5007C23.7512 15.5105 23.9899 15.6148 24.168 15.7929C24.3461 15.971 24.4504 16.2097 24.4602 16.4614C24.4699 16.7131 24.3843 16.9592 24.2205 17.1505L21.3905 19.9805L24.2205 22.8105Z"
      fill="#FF006B"
    />
  </svg>
);

export const PricingPageBody = ({
  onFreeClick,
  onProClick,
  // onEnterpriseClick,
}) => {
  return (
    <div className="vh-page vh-pricing-page">
      <div className="table">
        <div className="row">
          <div className="left" />
          <div className="right">
            {plans.map((plan) => (
              <div className="plan-wrapper" key={plan.id}>
                <div className="plan-label">
                  {plan.label}
                </div>
                {plan.subtext
                  ? plan.subtext.map((text) => (
                      <div
                        className="plan-subtext"
                        key={text}
                      >
                        {text}
                      </div>
                    ))
                  : null}
                {plan.id !== FREE ? (
                  <Button
                    onClick={handleUpgradeClick(
                      me && me.id,
                    )}
                    isDisabled={!me}
                    title={
                      !me
                        ? 'Please sign in to upgrade.'
                        : ''
                    }
                  >
                    Upgrade
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        {features.map((feature, i) => (
          <Fragment key={feature.title}>
            <div className="row">
              <div className="left">
                <div className="feature-title">
                  {feature.title}
                </div>
                {feature.description && (
                  <div className="feature-description">
                    {feature.description}
                  </div>
                )}
              </div>
              <div className="right">
                {plans.map((plan) => (
                  <Fragment key={plan.id}>
                    {feature.plans[plan.id] ? (
                      <PlanIncludedSVG />
                    ) : (
                      <PlanExcludedSVG />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>
            {i < features.length - 1 ? (
              <HorizontalRule />
            ) : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
