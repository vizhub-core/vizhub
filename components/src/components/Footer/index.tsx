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
            href="/explore"
            target="_blank"
            rel="noreferrer"
          >
            Explore
          </a>
          <a
            href="/create-Viz"
            target="_blank"
            rel="noreferrer"
          >
            Create
          </a>

          {/* <a href="/terms">Terms</a> */}
        </div>
        <div className="footer-links">
          <div className="footer-links-title">Contact</div>

          <a href="mailto:contact@vizhub.com">Email</a>
          <a
            href="https://calendly.com/curran-kelleher/data-visualization-consultation"
            target="_blank"
            rel="noreferrer"
          >
            Consulting
          </a>
        </div>

        <div className="footer-links">
          <div className="footer-links-title">
            <span>Community</span>
          </div>
          <a
            href={discordLink}
            target="_blank"
            rel="noreferrer"
          >
            Discord
          </a>
          <a href="/forum" target="_blank" rel="noreferrer">
            Forum
          </a>
        </div>

        <div className="footer-links">
          <div className="footer-links-title">
            <span>Follow us</span>
          </div>
          <a
            href="https://twitter.com/viz_hub"
            target="_blank"
            rel="noreferrer"
          >
            Twitter
          </a>
          <a
            href="https://www.youtube.com/@currankelleher"
            target="_blank"
            rel="noreferrer"
          >
            YouTube
          </a>
          <a
            href="https://www.facebook.com/people/VizHub/100071381815409/"
            target="_blank"
            rel="noreferrer"
          >
            {enableSocialIcons && <FacebookSVG />}
            <span>Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
};
