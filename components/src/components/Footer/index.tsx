import { LogoSVG } from '../Icons/LogoSVG';
import { FacebookSVG } from '../Icons/FacebookSVG';
import { discordLink } from '../discordLink';
import './styles.scss';

// TODO enable this once styling is worked out
const enableSocialIcons = false;

export const Footer = () => {
  return (
    <div className="vh-footer">
      <div className="footer-container">
        <LogoSVG height={50} />
        <div className="footer-links">
          <div className="footer-links-title">Platform</div>
          <a
            href="/pricing"
            target="_blank"
            rel="noreferrer"
          >
            Pricing
          </a>
          <a
            href="/features"
            target="_blank"
            rel="noreferrer"
          >
            Features
          </a>
          <a
            href="https://screenshotgenie.com"
            target="_blank"
            rel="noreferrer"
          >
            Screenshot Genie
          </a>
          {/* <a href="/terms">Terms</a> */}
        </div>
        <div className="footer-links">
          <div className="footer-links-title">
            Community
          </div>
          <a href="/" target="_blank" rel="noreferrer">
            Explore
          </a>
          <a href="/forum" target="_blank" rel="noreferrer">
            Forum
          </a>
        </div>
        <div className="footer-links">
          <div className="footer-links-title">Social</div>
          <a
            href="https://twitter.com/viz_hub"
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://www.youtube.com/@viz_hub"
            target="_blank"
            rel="noreferrer"
          >
            YouTube
          </a>
        </div>
        <div className="footer-links">
          <div className="footer-links-title">Contact</div>
          {/* <a
            href="https://calendly.com/curran-kelleher/data-visualization-consultation"
            target="_blank"
            rel="noreferrer"
          >
            Consulting
          </a> */}
          <a
            href={discordLink}
            target="_blank"
            rel="noreferrer"
          >
            Discord
          </a>
          <a href="mailto:contact@vizhub.com">Email</a>
        </div>
      </div>
      <div className="footer-copyright">
        Copyright © 2025 VizHub, Inc. All rights reserved.
        VizHub is a registered trademark.
      </div>
    </div>
  );
};
