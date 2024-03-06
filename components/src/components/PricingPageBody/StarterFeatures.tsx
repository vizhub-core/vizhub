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
        View, fork and modify visualizations viewable by
        everyone.
      </Feature>
      <Feature
        title="Limited Data Size"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        Data uploads are limited to{' '}
        {freeTierSizeLimitMB * 1024} kB.
      </Feature>
      <Feature
        title="Hot Reloading & Interactive Widgets"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
        learnMoreHref="https://vizhub.com/forum/t/hot-reloading-and-interactive-widgets/968"
      >
        Iterate faster and with truly instant feedback
      </Feature>
      <Feature
        title="Export Code"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        Export industry-standard source code files
      </Feature>
      <Feature
        title="Community Access"
        hasBottomBorder={true}
        startsExpanded={startsExpanded}
      >
        Join our{' '}
        <a href="https://discord.gg/wbtJ7SCtYr">Discord</a>{' '}
        and <a href="">Forum</a> to connect with our
        community
      </Feature>
      <Feature
        title="Free Courses"
        hasBottomBorder={false}
        startsExpanded={startsExpanded}
      >
        Learn to code and visualize data with our{' '}
        <a href="https://vizhub.com/forum/t/index-of-courses/289">
          free online courses
        </a>
        .
      </Feature>
    </>
  );
};
