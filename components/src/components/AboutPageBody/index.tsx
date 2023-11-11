import React from 'react';

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

      <div className="hero__bottomSection">
        <p>Already a member? Log in</p>
      </div>
    </div>
  </div>
);

export const AboutPageBody = () => (
  <div className="vh-page vh-landing-page-body">
    <Hero />
  </div>
);
//how to solve untracked files
//git add .
