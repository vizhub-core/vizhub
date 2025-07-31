import React from 'react';
import './styles.scss';

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  billing?: string;
  tokens: string;
  isPopular?: boolean;
  isCurrent?: boolean;
  buttonText: string;
  buttonAction?: () => void;
  features: string[];
}

export const PricingCards = () => {
  const plans: PricingPlan[] = [
    {
      name: 'Free',
      price: '$0',
      tokens: '1M / month',
      isCurrent: true,
      buttonText: 'Your current plan',
      features: [
        'Public and private projects',
        '1M tokens per month',
        '150K tokens daily limit',
        'File upload limited to 10MB'
      ]
    },
    {
      name: 'Pro',
      price: '$20',
      period: 'per month',
      billing: 'billed monthly',
      tokens: '10M / month',
      isPopular: true,
      buttonText: 'Upgrade',
      features: [
        'Public and private projects',
        'Start at 10M tokens per month',
        'Increased file upload limit to 100MB',
        'No daily token limit',
        'Unused tokens roll over to next month'
      ]
    },
    {
      name: 'Teams',
      price: '$30',
      period: 'per month and member',
      billing: 'billed monthly',
      tokens: '10M / month',
      buttonText: 'Create new team',
      features: [
        'Everything in Pro, plus:',
        'Centralized billing',
        'Team-level access management',
        'Granular admin controls & user provisioning',
        'Private NPM registries support',
        'Design System knowledge with per-package prompts'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      buttonText: 'Ask for a quote',
      tokens: 'Custom',
      features: [
        'Everything in Pro, plus:',
        'Advanced security (SSO, audit logs, compliance support)',
        'Granular admin controls & user provisioning',
        'Dedicated account manager & 24/7 priority support',
        'Custom workflows, integrations & SLAs',
        'Scalable for large teams and high-volume usage',
        'Flexible billing & procurement options',
        'Data governance & retention policies',
        'Hands-on onboarding & enterprise training'
      ]
    }
  ];

  return (
    <div className="pricing-cards">
      {plans.map((plan) => (
        <div 
          key={plan.name} 
          className={`pricing-card ${plan.isPopular ? 'popular' : ''}`}
        >
          {plan.isPopular && (
            <div className="popular-badge">Popular</div>
          )}
          
          <div className="card-header">
            <h3 className="plan-name">{plan.name}</h3>
            <div className="price-section">
              <span className="price">{plan.price}</span>
              {plan.period && (
                <span className="period">{plan.period}</span>
              )}
            </div>
            {plan.billing && (
              <div className="billing">{plan.billing}</div>
            )}
            {plan.isCurrent && (
              <div className="current-plan">Your current plan</div>
            )}
          </div>

          <div className="tokens-section">
            <div className="tokens-label">Monthly tokens</div>
            <div className="tokens-amount">{plan.tokens}</div>
          </div>

          <button 
            className={`plan-button ${plan.isCurrent ? 'current' : ''}`}
            onClick={plan.buttonAction}
            disabled={plan.isCurrent}
          >
            {plan.buttonText}
          </button>

          <div className="features-section">
            <div className="features-header">You get:</div>
            <ul className="features-list">
              {plan.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
