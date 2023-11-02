import React from 'react';
import { Button } from '../bootstrap';
import { featureData } from './featureData';
import './styles.scss';

const Hero = () => (
  <div className="hero">
    <div className="hero__content">
      <div className="hero__title">Joy of Visualizing</div>
      <div className="hero__subtitle">
        <p>
          Embark on Your Visualization Journey with VizHub!
        </p>
      </div>
      <div className="hero__desc">
        <p>
          The ultimate platform for creating, sharing, and
          exploring visualizations.
        </p>
      </div>
      <Button className="hero_section_button" size="lg">
<<<<<<< HEAD
        TRY FOR FREE
      </Button>
      <div className="hero__bottomSection">
      <p>Already a member? Log in</p>
=======
        Get Started
      </Button>
>>>>>>> refs/remotes/origin/landing-page-design-modify
    </div>
    </div>
   
  </div>
);

const Content = ({ feature }) => (
  <div className="item__group">
    <div className="item__top">
      <div className="item__header">
        {feature.sectionHeader}
      </div>
      <div className="item__title">{feature.title}</div>
    </div>
    <div className="item__desc">{feature.description}</div>
    <Button>{feature.cta}</Button>
  </div>
);

const Image = ({ feature }) => (
  <div className="item__img">
    {feature.imageDescription}
  </div>
);

const Features = () => (
  <div className="features">
    <div className="features__title">FEATURES</div>
    {featureData.map((feature, index) => (
      <div key={feature.id || index} className="item">
        {index % 2 === 0 ? (
          <>
            <Content feature={feature} />
            <Image feature={feature} />
          </>
        ) : (
          <>
            <Image feature={feature} />
            <Content feature={feature} />
          </>
        )}
      </div>
    ))}
  </div>
);

export const LandingPageBody = () => (
  <div className="vh-page vh-landing-page-body">
    <Hero />
    <Features />
  </div>
);
