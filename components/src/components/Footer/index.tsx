import { LogoSVG } from '../Icons/LogoSVG';
import { FacebookSVG } from '../Icons/FacebookSVG';

import { discordLink } from '../discordLink';
import './styles.scss';
export const Footer = () => {
  return (
    <div className="vh-footer">
      <div className="footer-container">
        <LogoSVG height={50} />
        <div className="footer-links">
          <div className="footer-links-title">Platform</div>
          <a href="/pricing">Pricing</a>
          <a href="/explore">Explore</a>
          <a href="/create-Viz">Create</a>

          {/* <a href="/terms">Terms</a> */}
        </div>
        <div className="footer-links">
          <div className="footer-links-title">Contact</div>
          <a href={discordLink}>Discord</a>

          <a href="mailto:contact@vizhub.com">Email</a>
          <a href="https://calendly.com/curran-kelleher/data-visualization-consultation">
            Consulting
          </a>
        </div>

        <div className="footer-links">
          <div className="footer-links-title">
            Resources
          </div>
          <a href="/forum">Forum</a>
          <a href="https://twitter.com/viz_hub">Twitter</a>
          <a href="https://www.youtube.com/@currankelleher">
            YouTube
          </a>
          <a
            href="/https://www.facebook.com/profile.php?id=100071381815409"
            target="_blank"
          >
            <FacebookSVG />
            <span>Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
};
