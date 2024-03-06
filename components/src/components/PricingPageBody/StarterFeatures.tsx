import { freeTierSizeLimitMB } from 'entities';
import { Feature } from './Feature';

export const StarterFeatures = ({
  startsExpanded = false,
}) => {
  return (
    <>
      <Feature
        title="Public Vizzes Only"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        Share your work with the world. Open-source your
        learning and collaboration, fostering a community of
        shared knowledge and innovation.
      </Feature>
      <Feature
        title="Limited Data Size"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        Data uploads are limited to{' '}
        {freeTierSizeLimitMB * 1024} kB. If you need more,
        consider upgrading to Premium.
      </Feature>
      <Feature
        title="Hot Reloading & Interactive Widgets"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
        learnMoreHref="https://vizhub.com/forum/t/hot-reloading-and-interactive-widgets/968"
      >
        Save time with real-time updates. Our code editor
        and runtime environment lets you iterate faster with
        truly instant feedback.
      </Feature>
      <Feature
        title="Export Code"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        Take your work anywhere. With industry-standard code
        exports, your projects are portable and
        professional.
      </Feature>
      <Feature
        title="Community Access"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        Join a vibrant community. Connect, share, and grow
        with peers and experts committed to the art and
        science of visualization. Join our{' '}
        <a href="https://discord.gg/wbtJ7SCtYr">Discord</a>{' '}
        and <a href="">Forum</a> to connect with our
        community.
      </Feature>
      <Feature
        title="Free Courses"
        hasBottomBorder={false}
        startsExpanded={startsExpanded}
      >
        Never stop learning. Our{' '}
        <a href="https://vizhub.com/forum/t/index-of-courses/289">
          free online courses
        </a>{' '}
        offer the knowledge you need to start or advance
        your journey in data visualization.
      </Feature>
    </>
  );
};
