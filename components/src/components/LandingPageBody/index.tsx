import React from 'react';
import { Button } from '../bootstrap';
import { featureData } from './featureData';
import './styles.scss';

const Content = ({ feature }) => {
  return (
    <div className="feature__group">
      <div className="feature__top">
        <div className="feature__header">
          {feature.sectionHeader}
        </div>
        <div className="feature__title">
          {feature.title}
        </div>
      </div>
      <div className="feature__description">
        {feature.description}
      </div>
      <Button>{feature.cta}</Button>
    </div>
  );
};

const ImageSection = ({ feature }) => {
  return (
    <div className="feature__image">
      {feature.imageDescription}
    </div>
  );
};

// Put the image
// Who can use it
// Title on features section

const HeroSection = () => {
  return (
    <div className="vh-landing-page-hero">
      <div className="vh-landing-page-hero__content">
        <div className="vh-landing-page-hero__title">
          See Data Come to Life
        </div>
        <div className="vh-landing-page-hero__description">
          Discover VizHub, the ultimate platform for
          creating, sharing, and exploring dynamic data
          visualizations.
        </div>
        <Button>Explore Now</Button>
      </div>
      {/* <div className="vh-landing-page-hero__image">
        <img src="https://user-images.githubusercontent.com/68416/278831147-b5ad6780-1321-4184-aab6-6f3dd83364a6.png" />
      </div> */}
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <div className="vh-landing-page-features">
      <div className="vh-landing-page-features__title">
        FEATURES
      </div>
      {featureData.map((feature, index) => (
        <div className="feature">
          {index % 2 === 0 ? (
            <>
              <Content feature={feature} />
              <ImageSection feature={feature} />
            </>
          ) : (
            <>
              <ImageSection feature={feature} />
              <Content feature={feature} />
            </>
          )}
        </div>
      ))}
    </div>
  );
};
export const LandingPageBody = () => {
  return (
    <div className="vh-page vh-landing-page-body">
      <HeroSection />
      <FeaturesSection />
    </div>
  );
};
