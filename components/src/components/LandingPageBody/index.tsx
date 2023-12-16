import { image } from '../image';
import './styles.scss';

const headerBackgroundSrc = image('landing-header-bkg');

export const LandingPageBody = () => {
  return (
    <div className="vh-page vh-landing-page">
      <img
        className="header-background"
        src={headerBackgroundSrc}
        alt="header"
      />
    </div>
  );
};
