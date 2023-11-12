import React from 'react';
import './styles.scss';
import { featureData } from './featureData';
import { Button } from '../bootstrap';

const Hero = () => (
  <div className="hero">
    <div className="hero__content">
      <div style={{backgroundColor:'black',opacity:'0.8',padding:'30px'}}>
        <div className="hero__title">
          Expand Your Circle
        </div>

        <div className="hero__desc">
          <p>
            By connecting with
            like-minded people and organizations. Find
            resources to help you grow your knowledge and
            skills.
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
    <div>
   
      <div>
        <h3 className="item">Related Books</h3>
      </div>
      <div>
        <h3 className="item">Related  Groups</h3>
      </div>
      <div>
        <h3 className="item">Related Conferences</h3>
      </div>
      <div>
        <h3 className="item">Influential People</h3>
      </div>
      <div>
        <h3 className="item">Online Learning</h3>
      </div>
      <div>
        <h3 className="item">Similar Platforms</h3>
      </div>
      <div>
        <h3 className="item">About VizHub</h3>
        <div>
        <h3 className="item">Blogs.org</h3>
      </div>
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
