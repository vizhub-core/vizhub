import { Button } from '../bootstrap';
import { discordLink } from '../discordLink';
import './styles.scss';

const enableCreateVizButton = true;

export const HomeStarter = () => {
  return (
    <div className="home-starter">
      <h2>Join our community</h2>
      <div className="vh-lede-01">
        Connect with like minded data visualization
        enthusiasts. Share your projects, get feedback, and
        learn from others. Help shape the future of VizHub
        by providing feedback and contributing to its open
        source editor{' '}
        <a href="https://github.com/vizhub-core/vzcode">
          VZCode
        </a>
        .
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
