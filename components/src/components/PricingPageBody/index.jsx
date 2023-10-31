import React, {
  Fragment,
  useContext,
  useEffect,
} from 'react';

import { sendEvent } from '../../sendEvent';
import { NavBar } from '../../NavBar';
import { Button } from '../../Button';
import {
  PlanIncludedSVG,
  PlanExcludedSVG,
} from '../../svg';
import { AuthContext } from '../../authentication';
import { Wrapper, Content } from '../styles';
import { HorizontalRule } from '../../styles';
import { features, plans, FREE } from './featuresAndPlans';
import { handleUpgradeClick } from './stripe';

// The class names below correspond to the SCSS styles

export const PricingPage = () => {
  const { me } = useContext(AuthContext);

  const viewer = (me && me.id) || 'anonymous';

  useEffect(() => {
    sendEvent(`event.pageview.pricing.viewer:${viewer}`);
  }, [viewer]);

  return (
    <>
      <NavBar />
      <Wrapper>
        <Content>
          <div className="table">
            <div className="row">
              <div className="left" />
              <div className="right">
                {plans.map((plan) => (
                  <div
                    className="plan-wrapper"
                    key={plan.id}
                  >
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
        </Content>
      </Wrapper>
    </>
  );
};
