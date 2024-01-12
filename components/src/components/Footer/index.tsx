import { LogoSVG } from '../Icons/LogoSVG';
import './styles.scss';
export const Footer = () => {
  return (
    <div className="vh-footer">
      <div className="footer-container">
        <LogoSVG height="50" />
        <div className="footer-links">
          <div className="footer-links-title">Contact</div>
          <a href="/about">About</a>
          <a href="/pricing">Pricing</a>
          <a href="/resources">Resources</a>
          <a href="/terms">Terms</a>
        </div>
        <div className="footer-links">
          <div className="footer-links-title">Contact</div>
          <a href="/about">About</a>
          <a href="/pricing">Pricing</a>
          <a href="/resources">Resources</a>
          <a href="/terms">Terms</a>
        </div>
        <div className="footer-links">
          <div className="footer-links-title">Contact</div>
          <a href="/about">About</a>
          <a href="/pricing">Pricing</a>
          <a href="/resources">Resources</a>
          <a href="/terms">Terms</a>
        </div>
        <div className="footer-links">
          <div className="footer-links-title">Contact</div>
          <a href="/about">About</a>
          <a href="/pricing">Pricing</a>
          <a href="/resources">Resources</a>
          <a href="/terms">Terms</a>
        </div>
      </div>
    </div>
  );
};
