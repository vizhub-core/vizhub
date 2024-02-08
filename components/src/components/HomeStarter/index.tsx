import { Button } from '../bootstrap';
import { discordLink } from '../discordLink';
import './styles.scss';

const enableCreateVizButton = true;

export const HomeStarter = () => {
  return (
    <div className="home-starter">
      <h2>Create Custom Interactive Data Visualizations</h2>
      <div className="vh-lede-01">
        Creating data visualizations with Web Technologies
        is easier than you think. Your journey starts here!
      </div>
      <div className="home-starter-buttons">
        {enableCreateVizButton && (
          <Button
            variant="primary"
            href="/create-viz"
            as="a"
            target="_blank"
            rel="noopener noreferrer"
          >
            Create Viz
          </Button>
        )}
        <Button
          variant="secondary"
          href={discordLink}
          as="a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
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
          Learn
        </Button>
        <Button
          variant="secondary"
          href="https://github.com/vizhub-core/vizhub-feedback/issues/new/choose"
          as="a"
          target="_blank"
          rel="noopener noreferrer"
        >
          Feedback
        </Button>
      </div>
    </div>
  );
};
