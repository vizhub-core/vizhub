import { Footer } from '../Footer';
import { HomeStarter } from '../HomeStarter';
import { Button } from '../bootstrap';
import { image } from '../image';
import { useLanguage } from '../LanguageContext';
import './styles.scss';

const enableFooter = true;
const headerBackgroundSrc = image('landing-header-bkg');

export const LandingPageBodyI18n = ({
  isUserAuthenticated,
}: {
  isUserAuthenticated: boolean;
}) => {
  const { t } = useLanguage();

  return (
    <div className="vh-page vh-landing-page">
      <img
        className="header-background"
        src={headerBackgroundSrc}
      />
      <div className="landing-page-body">
        <div className="hero-section ai-hero">
          <div className="particles-background"></div>
          <div className="hero-content">
            <div className="hero-text">
              <div className="badge-container">
                <span className="new-feature-badge">
                  {t('landing.hero.badge')}
                </span>
              </div>
              <h1>
                {t('landing.hero.title')}
              </h1>
              <p className="hero-description">
                {t('landing.hero.description')}
              </p>
              <div className="feature-list">
                <div className="feature-item">
                  <i className="bi bi-robot"></i>
                  <span>{t('landing.feature.ai')}</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-people-fill"></i>
                  <span>{t('landing.feature.collaboration')}</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-shield-lock"></i>
                  <span>{t('landing.feature.private')}</span>
                </div>
                <div className="feature-item">
                  <i className="bi bi-code-square"></i>
                  <span>{t('landing.feature.embed')}</span>
                </div>
              </div>
              <div className="hero-buttons">
                <Button
                  href="/create-viz"
                  size="lg"
                  className="hero-create-button"
                >
                  <span className="button-content">
                    <i className="bi bi-play-fill me-2"></i>
                    {t('landing.button.get-started')}
                  </span>
                </Button>
                <Button
                  href="/explore"
                  variant="outline-light"
                  size="lg"
                >
                  <i className="bi bi-collection me-2"></i>
                  {t('landing.button.explore')}
                </Button>
                <Button
                  href="/pricing"
                  variant="outline-light"
                  size="lg"
                >
                  <i className="bi bi-credit-card me-2"></i>
                  {t('landing.button.pricing')}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="features-container">
          <div
            className="feature-section"
            id="ai-assisted-coding"
          >
            <div className="feature-section-content brand-background">
              <div className="feature-section-copy">
                <h3>{t('landing.ai.title')}</h3>
                <p>
                  {t('landing.ai.description')}
                </p>

                <Button
                  href="/pricing?feature=ai-assisted-coding"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                >
                  {t('landing.ai.cta')}
                </Button>
              </div>
              <div className="feature-section-image">
                <a
                  href="https://vizhub.com/forum/t/ai-assisted-coding/952"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <video autoPlay loop muted>
                    <source
                      src={image('ai-assist-demo', 'webm')}
                      type="video/webm"
                    />
                    Your browser does not support the video
                    tag.
                  </video>
                </a>
              </div>
            </div>
          </div>
          <HomeStarter />
        </div>
        {enableFooter && <Footer />}
      </div>
    </div>
  );
};