import { FREE_NON_PUBLIC_VIZ_LIMIT } from 'entities/src/Pricing';
import { discordLink } from '../links';
import { Feature } from './Feature';

export const StarterFeatures = () => {
  return (
    <>
      <Feature
        title="Limited VizBot AI Chat"
        id="limited-ai-chat"
        hasBottomBorder={true}
        startsExpanded={true}
        // learnMoreHref="/features#ai-assisted-coding"
      >
        Limited access to VizBot AI coding chat, up to 5
        chat messages per day
      </Feature>
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
        title="Export Code"
        id="api-access-for-vizzes"
        learnMoreHref="https://vizhub.com/forum/t/api-access-for-vizzes/971"
        hasBottomBorder={true}
      >
        Export public vizzes as code. Perfect for
        integration with your existing workflows and
        applications. See also{' '}
        <a href="https://github.com/vizhub-core/vite-export-template">
          Vite Export Template
        </a>
        .
      </Feature>
      <Feature
        title={`Limited Non-Public Vizzes (up to ${FREE_NON_PUBLIC_VIZ_LIMIT})`}
        id="limited-non-public-vizzes"
        hasBottomBorder={true}
      >
        Create up to {FREE_NON_PUBLIC_VIZ_LIMIT} private or
        unlisted vizzes.
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
