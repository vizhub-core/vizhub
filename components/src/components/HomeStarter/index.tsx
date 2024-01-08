import { Button } from '../bootstrap';
import './styles.scss';

const enableCreateVizButton = false;

export const HomeStarter = () => {
  return (
    <div className="home-starter">
      <h2>Join our community</h2>
      <div className="vh-lede-01">
        Join the VizHub Discord or use the VizHub Forum to
        interact with our community. Plus, check out our
        free, skill-boosting dataviz courses!
      </div>
      <div className="home-starter-buttons">
        {enableCreateVizButton && (
          <Button variant="primary" href="/create-viz">
            Create Visualization
          </Button>
        )}
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
        <Button
          variant="secondary"
          href="https://vizhub.com/forum/t/index-of-courses/289"
        >
          Explore Courses
        </Button>
        <Button
          variant="secondary"
          href="https://vizhub.com/forum/t/announcing-vizhub-3/939"
        >
          VizHub 3 Feedback
        </Button>
      </div>
      {/* <div className="home-starter-content">
        <h2>Discover the VizHub Community</h2>
        <div className="vh-lede-01">
          Step into a vibrant space where students and
          professionals unite! Our Discord and Forum are
          buzzing hubs for collaboration and innovation.
          Plus, check out our free, skill-boosting courses!
        </div>
        <div className="home-starter-buttons">
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
          <Button
            variant="secondary"
            href="https://vizhub.com/forum/t/index-of-courses/289"
          >
            Explore Courses
          </Button>
        </div>
      </div> */}
    </div>
  );
};
