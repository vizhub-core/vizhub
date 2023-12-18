import { Button } from '../bootstrap';
import { image } from '../image';
import './styles.scss';

export const HomeStarter = () => {
  return (
    <div className="home-starter">
      <img
        className="home-starter-background"
        src={image('home-starter-background')}
      />
      <div className="home-starter-content">
        <h2>
          Join a thriving community of dataviz
          practitioners.
        </h2>
        <div className="vh-lede-01">
          Join our online Discord community or use the
          VizHub Forum to interact with the community!
        </div>
        <div className="home-starter-buttons">
          <Button variant="primary" href="/create-viz">
            Create Visualization
          </Button>
          <Button
            variant="primary"
            href="https://discord.gg/wbtJ7SCtYr"
          >
            Join Discord
          </Button>
          <Button
            variant="secondary"
            href="https://vizhub.com/forum/"
          >
            Visit Forum
          </Button>
        </div>
      </div>
    </div>
  );
};
