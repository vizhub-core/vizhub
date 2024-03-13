import { Button } from '../bootstrap';
import { discordLink } from '../discordLink';
import './styles.scss';

const enableCreateVizButton = true;

export const HomeStarter = () => {
  return (
    <div className="home-starter mb-5">
      <h2>Join our Discord Community</h2>
      <div className="vh-lede-01">
        <ul>
          <li>
            Connect with like minded data visualization
            enthusiasts
          </li>
          <li>
            Share your work, get feedback, and learn from
            others
          </li>
          <li>
            Be informed of the latest updates to VizHub
          </li>
          <li>
            Join our community on Discord today and say
            hello!
          </li>
        </ul>
      </div>
      <div className="home-starter-buttons">
        {/* {enableCreateVizButton && (
          <Button
            variant="primary"
            href="/create-viz"
            as="a"
            target="_blank"
            rel="noopener noreferrer"
          >
            Create Viz
          </Button>
        )} */}
        <Button
          variant="primary"
          href={discordLink}
          as="a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Join Discord
        </Button>
        <Button
          variant="secondary"
          href="https://vizhub.com/forum/"
          as="a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Browse Forum
        </Button>
        <Button
          variant="secondary"
          href="https://vizhub.com/forum/t/index-of-courses/289"
          as="a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Free Courses
        </Button>
        <Button
          variant="secondary"
          href="https://github.com/vizhub-core/vizhub-feedback/issues/new/choose"
          as="a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Product Feedback
        </Button>
      </div>
    </div>
  );
};
