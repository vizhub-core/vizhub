import { Button } from '../bootstrap';
import { discordLink } from '../discordLink';
import './styles.scss';

const enableCreateVizButton = true;

export const HomeStarter = () => {
  return (
    <div className="home-starter">
      <h2>Join Our Community</h2>
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
            Stay up to data with VizHub platform changes
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
          Forum
        </Button>
        <Button
          variant="secondary"
          href="https://vizhub.com/forum/t/index-of-courses/289"
          as="a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Courses
        </Button>
        <Button
          variant="secondary"
          href="https://github.com/vizhub-core/vizhub-feedback/issues/new/choose"
          as="a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Give Feedback
        </Button>
      </div>
    </div>
  );
};
