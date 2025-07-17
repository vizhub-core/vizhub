import { LogoSVG } from '../Icons/LogoSVG';
import { discordLink } from '../links';
import './styles.scss';

// TODO enable this once styling is worked out
const enableSocialIcons = false;

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="vh-footer">
      <div className="footer-container">
        <div>
          <LogoSVG height={50} />
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: '300px', marginTop: '20px', lineHeight: '1.6' }}>
            The AI-powered platform for creating, sharing, and exploring interactive data visualizations.
          </p>
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <a href="https://twitter.com/viz_hub" target="_blank" rel="noreferrer" style={{ color: 'white' }}>
              <i className="bi bi-twitter" style={{ fontSize: '20px' }}></i>
            </a>
            <a href="https://www.youtube.com/@viz_hub" target="_blank" rel="noreferrer" style={{ color: 'white' }}>
              <i className="bi bi-youtube" style={{ fontSize: '20px' }}></i>
            </a>
            <a href={discordLink} target="_blank" rel="noreferrer" style={{ color: 'white' }}>
              <i className="bi bi-discord" style={{ fontSize: '20px' }}></i>
            </a>
            <a href="https://github.com/vizhub-core" target="_blank" rel="noreferrer" style={{ color: 'white' }}>
              <i className="bi bi-github" style={{ fontSize: '20px' }}></i>
            </a>
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-links-title">Platform</div>
          <a
            href="/pricing"
            rel="noreferrer"
          >
            Pricing
          </a>
          <a
            href="/features"
            rel="noreferrer"
          >
            Features
          </a>
          <a
            href="/vizbot"
            rel="noreferrer"
          >
            VizBot AI
          </a>
          <a
            href="https://screenshotgenie.com"
            target="_blank"
            rel="noreferrer"
          >
            Screenshot Genie
          </a>
          <a href="/terms" rel="noreferrer">Terms</a>
        </div>
        <div className="footer-links">
          <div className="footer-links-title">
            Community
          </div>
          <a href="/" rel="noreferrer">
            Explore
          </a>
          <a href="/forum" rel="noreferrer">
            Forum
          </a>
          <a href="/showcase" rel="noreferrer">
            Showcase
          </a>
          <a href="/blog" rel="noreferrer">
            Blog
          </a>
        </div>
        <div className="footer-links">
          <div className="footer-links-title">Resources</div>
          <a href="/docs" rel="noreferrer">
            Documentation
          </a>
          <a href="/tutorials" rel="noreferrer">
            Tutorials
          </a>
          <a href="/api" rel="noreferrer">
            API
          </a>
          <a
            href="https://github.com/vizhub-core"
            target="_blank"
            rel="noreferrer"
          >
            Open Source
          </a>
        </div>
        <div className="footer-links">
          <div className="footer-links-title">Contact</div>
          <a href="/contact" rel="noreferrer">
            Contact Us
          </a>
          <a
            href={discordLink}
            target="_blank"
            rel="noreferrer"
          >
            Discord
          </a>
          <a href="mailto:contact@vizhub.com">Email</a>
          <a href="/support" rel="noreferrer">
            Support
          </a>
        </div>
      </div>
      <div className="footer-copyright">
        Copyright © {currentYear} VizHub, Inc. All rights reserved.
        VizHub is a registered trademark.
      </div>
    </div>
  );
};
