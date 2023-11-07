import React from 'react';
import { Button } from '../bootstrap';
import { featureData } from './featureData';
import './styles.scss';
import { LogoSVG } from '../Icons/LogoSVG';
import { FacebookSVG } from '../Icons/FacebookSVG';
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
        TRY FOR FREE
      </Button>
      <div className="hero__bottomSection">
        <p>Already a member? Log in</p>
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
// Adding section for 'Join 10000 VizHub Users'
const VideoVizhub = () => (
  <div className="VideoVizhub">
    <div className="VideoVizhub __content">
      <div>
        <div>
        <h2>Introduction to VizHub </h2>
        </div>
        <div>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/jeKO0tsB7XI?si=UCGlA1J350C-OUJW"
            title="YouTube video player"
            //frameborder="0"
            //allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            //allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
);
const SectionJoinVizHubUsers = () => (
  <div className="SectionJoinVizHubUsers">
    <div className="SectionJoinVizHubUsers__content">
      <h2>
        Join THOUSANDS of people around the world who are
        creating visualizations{' '}
      </h2>
      <Button color="gray">10,000</Button>
      <p>and COUNTING ......</p>
      <div className="SectionJoinVizHubUsers__button">
        <Button> JOIN 10,000 + PEOPLE </Button>
        <div className="hero__bottomSection">
          <p>Already a member? Log in</p>
        </div>
      </div>
    </div>
  </div>
);
const Footer = () => (
  <div className="Footer">
    <div className="Footer__logo">
      <LogoSVG height={32} />
    </div>
    <div className="Footer__content">
      <div>
        <ul id="menu-footer">
          <li>
            <a href="https://vizhub.com/forum/">Forum</a>
          </li>
          <li>
            <a href="https://discord.gg/wbtJ7SCtYr">
              Discord
            </a>
          </li>
          <li>
            <a href="https://vizhub.com/">Contact</a>
          </li>
        </ul>
      </div>
      <div>
        <ul id="menu-footer">
          <li>
            <a href="https://vizhub.com/">
              Terms and Conditions
            </a>
          </li>
          <li>
            <a href="https://vizhub.com/">Privacy Policy</a>
          </li>
          <li>
            <a href="https://vizhub.com/forum/c/site-feedback/2">
              Feedback
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
);
const SocialMedia = () => (
  <div className="SocialMedia ">
    <div className="SocialMedia__content">
      <FacebookSVG />
    </div>
  </div>
);
const Copyright = () => (
  <div className="Copyright ">
    <div className="Copyright__content">
      ©2023 Datavis Tech INC
    </div>
  </div>
);
export const LandingPageBody = () => (
  <div className="vh-page vh-landing-page-body">
    <Hero />
    <Features />
    <VideoVizhub />
    <SectionJoinVizHubUsers />
    <Footer />
    <SocialMedia />
    <Copyright />
  </div>
);
