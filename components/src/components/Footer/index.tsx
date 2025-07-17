import { LogoSVG } from '../Icons/LogoSVG';
import { discordLink, youtubeLink } from '../links';
import './styles.scss';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="vh-footer">
      <div className="ai-banner">
        <div className="ai-banner-content">
          <h2>Create Stunning Visualizations with AI</h2>
          <p>Transform your data into beautiful, interactive visualizations using VizBot, our AI-powered assistant.</p>
          <a href="/vizbot" className="ai-banner-button">Try VizBot Now</a>
        </div>
      </div>
      
      <div className="footer-container">
        <div className="footer-brand">
          <LogoSVG height={50} />
          <p className="footer-tagline">
            The AI-powered platform for interactive data visualization
          </p>
          <div className="social-icons">
            <a href="https://twitter.com/viz_hub" target="_blank" rel="noreferrer" aria-label="Twitter">
              <i className="bi bi-twitter"></i>
            </a>
            <a href={youtubeLink} target="_blank" rel="noreferrer" aria-label="YouTube">
              <i className="bi bi-youtube"></i>
            </a>
            <a href={discordLink} target="_blank" rel="noreferrer" aria-label="Discord">
              <i className="bi bi-discord"></i>
            </a>
            <a href="https://github.com/vizhub-core" target="_blank" rel="noreferrer" aria-label="GitHub">
              <i className="bi bi-github"></i>
            </a>
          </div>
        </div>
        
        <div className="footer-links-container">
          <div className="footer-links">
            <h3 className="footer-links-title">Platform</h3>
            <ul>
              <li><a href="/pricing" rel="noreferrer">Pricing</a></li>
              <li><a href="/features" rel="noreferrer">Features</a></li>
              <li><a href="/vizbot" rel="noreferrer"><span className="ai-badge">AI</span> VizBot</a></li>
              <li><a href="https://screenshotgenie.com" target="_blank" rel="noreferrer">Screenshot Genie</a></li>
              <li><a href="/terms" rel="noreferrer">Terms of Service</a></li>
              <li><a href="/privacy" rel="noreferrer">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3 className="footer-links-title">Community</h3>
            <ul>
              <li><a href="/" rel="noreferrer">Explore</a></li>
              <li><a href="/forum" rel="noreferrer">Forum</a></li>
              <li><a href="/showcase" rel="noreferrer">Showcase</a></li>
              <li><a href="/blog" rel="noreferrer">Blog</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3 className="footer-links-title">AI Tools</h3>
            <ul>
              <li><a href="/vizbot" rel="noreferrer">VizBot Assistant</a></li>
              <li><a href="/ai-templates" rel="noreferrer">Visualization Templates</a></li>
              <li><a href="/ai-insights" rel="noreferrer">Data Insights</a></li>
              <li><a href="/ai-tutorials" rel="noreferrer">AI Tutorials</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3 className="footer-links-title">Resources</h3>
            <ul>
              <li><a href="/docs" rel="noreferrer">Documentation</a></li>
              <li><a href="/tutorials" rel="noreferrer">Tutorials</a></li>
              <li><a href="/api" rel="noreferrer">API</a></li>
              <li><a href="https://github.com/vizhub-core" target="_blank" rel="noreferrer">Open Source</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3 className="footer-links-title">Contact</h3>
            <ul>
              <li><a href="/contact" rel="noreferrer">Contact Us</a></li>
              <li><a href={discordLink} target="_blank" rel="noreferrer">Discord</a></li>
              <li><a href="mailto:contact@vizhub.com">Email</a></li>
              <li><a href="/support" rel="noreferrer">Support</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-copyright">
          Copyright © {currentYear} VizHub, Inc. All rights reserved.
          VizHub is a registered trademark.
        </div>
        <div className="footer-bottom-links">
          <a href="/terms">Terms</a>
          <a href="/privacy">Privacy</a>
          <a href="/cookies">Cookies</a>
        </div>
      </div>
    </footer>
  );
};
