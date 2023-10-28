import React from 'react';
import { Button } from '../bootstrap';
import { featureData } from './featureData';
import './styles.scss';

const Hero = () => (
  <div className="hero">
    <div className="hero__content">
      <div className="hero__title">
        See Data Come to Life
      </div>
      <div className="hero__desc">
        Discover VizHub, the ultimate platform for creating,
        sharing, and exploring dynamic data visualizations.
      </div>
      <Button>Explore Now</Button>
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
