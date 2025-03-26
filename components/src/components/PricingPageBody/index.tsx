import { useCallback, useMemo, useState } from 'react';
import { FeatureId, Plan, PREMIUM, PRO } from 'entities';
import {
  Button,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
} from '../bootstrap';
import { Footer } from '../Footer';
import { GreenCheckSVG } from '../Icons/sam/GreenCheckSVG';
import { image } from '../image';
import { Testimonial } from '../Testimonial';
import { StarterFeatures } from './StarterFeatures';
import { PremiumFeatures } from './PremiumFeatures';
import { ProFeatures } from './ProFeatures';
import { HighlightedFeatureProvider } from './HighlightedFeatureContext';
import { ConsultationFeatures } from './ConsultationFeatures';
import { OrgFeatures } from './OrgFeatures';
import { AcademicFeatures } from './AcademicFeatures';
import './styles.scss';

const premiumPriceMonthly = 1.99;
const premiumPriceAnnually = 19.99;
const proPriceMonthly = 19.99;
const proPriceAnnually = 199.99;
const orgPrice = 24;

// Feature flags
const enableImages = false;
const enableConsulting = false;
const enableOrgPlan = false;

const enableProfessionalPlan = true;

const enableAcademicPlan = true;

// The percent saved by paying annually.
const percentSavings = Math.floor(
  (1 - premiumPriceAnnually / 12 / premiumPriceMonthly) *
    100,
);

const proPercentSavings = Math.floor(
  (1 - proPriceAnnually / 12 / proPriceMonthly) * 100,
);

// const randomImage = (options) =>
//   image(
//     options[Math.floor(Math.random() * options.length)],
//   );

const headerBackgroundSrc = image('pricing-header-bkg');
// const starterSpiritSrc = image('pricing-spirit-starter');

// image('pricing-spirit-premium-2');
// const professionalSpiritSrc = image(
//   'pricing-spirit-professional',
// );

// const starterImages = [
//   'pricing-spirit-starter',
//   'pricing-spirit-starter-1',
//   'pricing-spirit-starter-2',
// ];
// const premiumImages = [
//   // 'pricing-spirit-premium',
//   'pricing-spirit-premium-2',
//   'pricing-spirit-premium-4',
//   'pricing-spirit-premium-5',
//   'pricing-spirit-premium-6',
//   'pricing-spirit-premium-7',
// ];

const CurrentButton = () => (
  <Button
    variant="success"
    className="pricing-page-plan-button"
    size="lg"
  >
    Current
    <GreenCheckSVG />
  </Button>
);

const consultationSpiritSrc = image(
  'pricing-spirit-premium-5',
);

export const PricingPageBody = ({
  onStarterDowngradeClick,
  onPremiumUpgradeClick,
  onProfessionalUpgradeClick,
  isMonthly,
  setIsMonthly,
  currentPlan = 'free',
  highlightedFeature,
}: {
  onStarterDowngradeClick: () => void;
  onPremiumUpgradeClick: () => void;
  onProfessionalUpgradeClick: () => void;
  isMonthly: boolean;
  setIsMonthly: (isMonthly: boolean) => void;
  currentPlan: Plan;
  highlightedFeature?: FeatureId;
}) => {
  const handleMonthlyClick = useCallback(() => {
    setIsMonthly(true);
  }, []);

  const handleAnnuallyClick = useCallback(() => {
    setIsMonthly(false);
  }, []);

  const premiumPrice = isMonthly
    ? premiumPriceMonthly
    : premiumPriceAnnually;

  // Make sure there is consistency between the
  // server-side and client-side rendering of the
  // initial pricing page.
  const [starterSpiritSrc, setStarterSpiritSrc] = useState(
    image('pricing-spirit-starter-1'),
  );

  const [premiumSpiritSrc, setPremiumSpiritSrc] = useState(
    image('pricing-spirit-premium-4'),
  );

  //   // On the client only, randomize the image.
  //   useEffect(() => {
  //     setStarterSpiritSrc(randomImage(starterImages));
  //   }, []);
  // useEffect(() => {
  //   setPremiumSpiritSrc(randomImage(premiumImages));
  // }, []);

  // Figure out if we are currently before or after August 1st, 2024
  const showJulyDiscount = useMemo(
    () => new Date() < new Date('2024-08-01'),
    [],
  );

  return (
    <HighlightedFeatureProvider
      highlightedFeature={highlightedFeature}
    >
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
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id="annual-billing-tooltip">
                      Save {percentSavings}%!
                    </Tooltip>
                  }
                >
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
                </OverlayTrigger>
              </ButtonGroup>
            </div>
            {showJulyDiscount && currentPlan === 'free' && (
              <div className="alert alert-warning mt-3">
                <p className="mb-0">
                  Limited time offer! Get 50% off your first
                  year of Premium. Use code{' '}
                  <strong>JULY50</strong> at checkout. Offer
                  expires August 1st, 2024.
                </p>
              </div>
            )}

            <div className="pricing-page-plans">
              <div className="pricing-page-plan">
                {enableImages && starterSpiritSrc && (
                  <img
                    className="plan-spirit"
                    src={starterSpiritSrc}
                    alt="A student in his dorm room studying dataviz"
                  />
                )}

                <div className="pricing-page-plan-body">
                  <div className="plan-header">
                    <h3 className="plan-header-left">
                      Starter
                    </h3>
                    <div className="plan-header-right">
                      <h3>Free</h3>
                    </div>
                  </div>

                  {currentPlan === 'free' ? (
                    <CurrentButton />
                  ) : (
                    <Button
                      variant="primary"
                      className="pricing-page-plan-button"
                      onClick={onStarterDowngradeClick}
                      size="lg"
                    >
                      Downgrade now
                    </Button>
                  )}

                  <div className="pricing-page-plan-features">
                    <StarterFeatures />
                  </div>
                </div>
              </div>
              <div className="pricing-page-plan">
                {enableImages && premiumSpiritSrc && (
                  <img
                    className="plan-spirit"
                    src={premiumSpiritSrc}
                    alt="A freelancer working on a client project"
                  />
                )}
                <div className="pricing-page-plan-body">
                  <div className="plan-header">
                    <h3 className="plan-header-left">
                      Premium
                    </h3>
                    <div className="plan-header-right">
                      <h3>${premiumPrice}</h3>
                      <h3 className="plan-header-right-faint">
                        /{isMonthly ? 'month' : 'year'}
                      </h3>
                    </div>
                  </div>

                  {currentPlan === PREMIUM ? (
                    <CurrentButton />
                  ) : (
                    <Button
                      variant="primary"
                      className="pricing-page-plan-button"
                      onClick={onPremiumUpgradeClick}
                      size="lg"
                    >
                      Upgrade now
                    </Button>
                  )}

                  <div className="pricing-page-plan-features">
                    <div className="vh-lede-01 mb-2 mt-2 vh-color-neutral-02">
                      Everything in{' '}
                      <span style={{ fontWeight: 600 }}>
                        Starter
                      </span>
                      , plus ...
                    </div>
                    <PremiumFeatures />
                  </div>
                </div>
              </div>

              {enableProfessionalPlan && (
                <div className="pricing-page-plan">
                  <div className="pricing-page-plan-body">
                    <div className="plan-header">
                      <h3 className="plan-header-left">
                        Pro
                      </h3>
                      <div className="plan-header-right">
                        <h3>
                          $
                          {isMonthly
                            ? proPriceMonthly
                            : proPriceAnnually}
                        </h3>
                        <h3 className="plan-header-right-faint">
                          /{isMonthly ? 'month' : 'year'}
                        </h3>
                      </div>
                    </div>
                    {currentPlan === PRO ? (
                      <CurrentButton />
                    ) : (
                      <Button
                        variant="primary"
                        className="pricing-page-plan-button"
                        onClick={onProfessionalUpgradeClick}
                        size="lg"
                      >
                        Upgrade now
                      </Button>
                    )}

                    <div className="pricing-page-plan-features">
                      <div className="vh-lede-01 mb-2 mt-2 vh-color-neutral-02">
                        Everything in{' '}
                        <span style={{ fontWeight: 600 }}>
                          Premium
                        </span>
                        , plus ...
                      </div>
                      <ProFeatures />
                    </div>
                  </div>
                </div>
              )}
              {enableAcademicPlan && (
                <div className="pricing-page-plan">
                  <div className="pricing-page-plan-body">
                    <div className="plan-header">
                      <h3 className="plan-header-left">
                        Academic
                      </h3>
                      <div className="plan-header-right">
                        <h3>$199.99</h3>
                        <h3 className="plan-header-right-faint">
                          /semester
                        </h3>
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      className="pricing-page-plan-button"
                      as="a"
                      href="https://buy.stripe.com/7sI00z4IVaTUcSI4gh"
                      size="lg"
                    >
                      Get started
                    </Button>

                    <div className="pricing-page-plan-features">
                      <AcademicFeatures />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-16 text-center">
              <p className="text-gray-600">
                Need a custom plan?{' '}
                <a
                  href="#"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Contact our sales team
                </a>
              </p>
            </div>
            {/* 
            <div className="mt-5 d-flex gap-4 justify-content-center">
              <div
                className="card p-4"
                style={{ maxWidth: '400px' }}
              >
                <h4 className="mb-3">
                  Need a custom plan?
                </h4>
                <p className="mb-0">
                  <a href="mailto: contact@vizhub.com">
                    Contact our sales team
                  </a>
                </p>
              </div>
            </div> */}
            <div className="pricing-page-plans">
              {enableOrgPlan && (
                <div className="pricing-page-plan">
                  <div className="pricing-page-plan-body">
                    <div className="plan-header">
                      <h3 className="plan-header-left">
                        Organization
                      </h3>
                      <div className="plan-header-right">
                        <h3>${orgPrice}</h3>
                        <h3 className="plan-header-right-faint">
                          /editor/
                          {isMonthly ? 'month' : 'year'}
                        </h3>
                      </div>
                    </div>
                    {/* <p>
                    Ideal for professionals.
                    {currentPlan === FREE &&
                      (enableFreeTrial
                        ? ' Includes 7 day free trial.'
                        : ' Your 7 day free trial has expired.')}
                  </p> */}
                    {currentPlan === 'premium' ? (
                      <CurrentButton />
                    ) : (
                      <Button
                        variant="primary"
                        className="pricing-page-plan-button"
                        onClick={onPremiumUpgradeClick}
                        size="lg"
                      >
                        Upgrade now
                      </Button>
                    )}

                    <div className="pricing-page-plan-features">
                      <div className="vh-lede-01 mb-2 mt-2 vh-color-neutral-02">
                        Everything in{' '}
                        <span style={{ fontWeight: 600 }}>
                          Starter
                        </span>
                        , plus:
                      </div>
                      <PremiumFeatures />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {enableConsulting && (
              <div className="pricing-page-plans">
                <div className="pricing-page-plan">
                  {enableImages && premiumSpiritSrc && (
                    <img
                      className="plan-spirit"
                      src={consultationSpiritSrc}
                      alt="Breakthrough in a data visualization consultation"
                    />
                  )}
                  <div className="pricing-page-plan-body">
                    <div className="plan-header">
                      <h3
                        className="plan-header-left"
                        id="consultations"
                      >
                        Expert Consultations
                      </h3>
                      <div className="plan-header-right">
                        <h3>$100</h3>
                        <h3 className="plan-header-right-faint">
                          /session
                        </h3>
                      </div>
                    </div>
                    <p>
                      Need expert help? Schedule a 1 hour
                      expert consultation today!
                    </p>

                    <Button
                      variant="primary"
                      className="pricing-page-plan-button"
                      as="a"
                      href="https://calendly.com/curran-kelleher/data-visualization-consultation"
                      size="lg"
                    >
                      Book a consultation now
                    </Button>
                    {enableOrgPlan && (
                      <div className="pricing-page-plan">
                        <div className="pricing-page-plan-body">
                          <div className="plan-header">
                            <h3 className="plan-header-left">
                              Pro
                            </h3>
                            <div className="plan-header-right">
                              <h3>${orgPrice}</h3>
                              <h3 className="plan-header-right-faint">
                                /editor/
                                {isMonthly
                                  ? 'month'
                                  : 'year'}
                              </h3>
                            </div>
                          </div>
                          {/* <p>
                    Ideal for professionals.
                    {currentPlan === FREE &&
                      (enableFreeTrial
                        ? ' Includes 7 day free trial.'
                        : ' Your 7 day free trial has expired.')}
                  </p> */}
                          {currentPlan ===
                          'professional' ? (
                            <CurrentButton />
                          ) : (
                            <Button
                              variant="primary"
                              className="pricing-page-plan-button"
                              onClick={
                                onProfessionalUpgradeClick
                              }
                              size="lg"
                            >
                              Upgrade Now
                            </Button>
                          )}

                          <div className="pricing-page-plan-features">
                            <div className="vh-lede-01 mb-2 mt-2 vh-color-neutral-02">
                              Everything in{' '}
                              <span
                                style={{ fontWeight: 600 }}
                              >
                                Premium
                              </span>
                              , but for your organization
                              ...
                            </div>
                            <OrgFeatures />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="pricing-page-plan-features">
                      <ConsultationFeatures />
                    </div>
                  </div>
                </div>
                <Testimonial
                  headshotImgSrc={image('headshot-louis')}
                  style={{
                    maxWidth: '420px',
                    justifyContent: 'space-around',
                  }}
                  link="https://www.linkedin.com/in/louis-parizeau-6b0510156/"
                  quote={
                    <>
                      Curran quickly understood my complex
                      codebase, and was able to fix many of
                      my visualization's bugs that I
                      couldn't find solutions for online.
                      Additionally, he gave specific,
                      best-practice advice to improve the
                      load time, UI responsiveness, and
                      maintainability of my D3
                      implementation. Curran was great to
                      work with and I would 100% recommend
                      him to anyone stuck with D3 bugs, or
                      looking to refactor their code to
                      follow best practices.
                    </>
                  }
                  name="Louis Parizeau"
                  title="Co-Founder"
                  association="Highgate Analytics"
                />
              </div>
            )}
          </div>
          <Footer />
        </div>
      </div>
    </HighlightedFeatureProvider>
  );
};
