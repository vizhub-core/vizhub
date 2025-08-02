import React from 'react';
import './styles.scss';
import { featureData } from './featureData';
import { Button } from '../bootstrap';

const Hero = () => (
  <div className="hero">
    <div className="hero__content">
      <div
        style={{
          backgroundColor: 'black',
          opacity: '0.8',
          padding: '30px',
          borderRadius: '30px',
          position: 'absolute',
          top: '42%',
          left: '40%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          width: '50%',
          textAlign: 'left',
        }}
      >
        <div className="hero__title">
          Expand Your Circle
        </div>

        <div className="hero__desc">
          <p>
            Connect with like-minded people and
            organizations. Find resources to help you grow
            your knowledge and skills.
          </p>
        </div>
        <Button className="hero_section_button" size="lg">
          TRY FOR FREE
        </Button>
        <div className="hero__bottomSection">
          <p>Already a member? Log in</p>
        </div>
      </div>
    </div>
  </div>
);

const Features = () => (
  <div className="features">
    <div className="features-grid">
      <div className="feature-item">
        <h3>
          <a href="/dashboard">Dashboard</a>
        </h3>
        <p>Access your personal VizHub dashboard</p>
      </div>
      <div className="feature-item">
        <h3>Related Books</h3>
        <p>Discover books about data visualization</p>
      </div>
      <div className="feature-item">
        <h3>Related Groups</h3>
        <p>Connect with data visualization communities</p>
      </div>
      <div className="feature-item">
        <h3>Related Conferences</h3>
        <p>Find conferences and events</p>
      </div>
      <div className="feature-item">
        <h3>Influential People</h3>
        <p>Learn from data visualization experts</p>
      </div>
      <div className="feature-item">
        <h3>Online Learning</h3>
        <p>Explore online courses and tutorials</p>
      </div>
      <div className="feature-item">
        <h3>Similar Platforms</h3>
        <p>Discover other visualization platforms</p>
      </div>
      <div className="feature-item">
        <h3>About VizHub</h3>
        <p>Learn more about VizHub</p>
      </div>
    </div>
  </div>
);

export const ResourcesPageBody = () => (
  <div className="vh-page vh-resources-page-body">
    <Hero />
    <Features />
  </div>
);
