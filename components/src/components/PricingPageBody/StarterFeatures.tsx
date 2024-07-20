import { Feature } from './Feature';

export const StarterFeatures = () => {
  return (
    <>
      <Feature
        title="Fork & Modify Public Vizzes"
        id="public-vizzes"
        hasBottomBorder={true}
        // startsExpanded={true}
      >
        Create your own works right in your browser.
      </Feature>
      <Feature
        title="Hot Reloading & Interactive Widgets"
        id="hot-reloading"
        hasBottomBorder={true}
        // startsExpanded={true}
        learnMoreHref="https://vizhub.com/forum/t/hot-reloading-and-interactive-widgets/968"
      >
        Iterate faster with truly instant feedback.
      </Feature>
      <Feature
        title="Unlimited Real-Time Collaborators"
        id="real-time-collaborators"
        hasBottomBorder={true}
        // startsExpanded={true}
        learnMoreHref={
          'https://vizhub.com/forum/t/real-time-collaborators/976'
        }
      >
        Invite others to edit code with you in real time.
      </Feature>
      <Feature
        title="Search Public Vizzes"
        id="search"
        hasBottomBorder={true}
      >
        Find compelling open source visualizations.
      </Feature>
      {/* <Feature
        title="Community Access"
        id="community-access"
        hasBottomBorder={true}
      >
        Join our{' '}
        <a href="https://discord.gg/wbtJ7SCtYr">Discord</a>{' '}
        and <a href="https://vizhub.com/forum/">Forum</a> to
        connect with our community. Ask for help or any
        time!
      </Feature> */}
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
