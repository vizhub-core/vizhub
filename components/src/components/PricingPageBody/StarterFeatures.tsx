import { discordLink } from '../discordLink';
import { Feature } from './Feature';

export const StarterFeatures = () => {
  return (
    <>
      <Feature
        title="Search Public Vizzes"
        id="search"
        hasBottomBorder={true}
      >
        Find compelling open source visualizations.
      </Feature>
      <Feature
        title="Fork & Modify Vizzes"
        id="public-vizzes"
        hasBottomBorder={true}
        // startsExpanded={true}
      >
        Create your own works right in your browser.
      </Feature>
      <Feature
        title="Community Access"
        id="community-access"
        hasBottomBorder={true}
      >
        Join the <a href={discordLink}>VizHub Discord</a>{' '}
        and <a href="https://vizhub.com/forum/">Forum</a> to
        connect with our community. Ask for help or any
        time!
      </Feature>
      <Feature
        title="Free Courses"
        id="free-courses"
        hasBottomBorder={false}
      >
        Access our{' '}
        <a href="https://vizhub.com/forum/t/index-of-courses/289">
          free online courses
        </a>{' '}
        to get started or level up your data visualization
        skills.
      </Feature>
    </>
  );
};
