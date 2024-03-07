import { freeTierSizeLimitMB } from 'entities';
import { Feature } from './Feature';

export const StarterFeatures = () => {
  return (
    <>
      <Feature
        title="Create Public Vizzes"
        id="public-vizzes"
        hasBottomBorder={true}
      >
        Fork & modify public visualizations. Open-source
        your learning and collaboration, fostering a
        community of shared knowledge and innovation.
      </Feature>
      <Feature
        title="Search Public Vizzes"
        id="search"
        hasBottomBorder={true}
      >
        Search by keyword to find public visualizations that
        inspire you. Explore and learn from the community's
        best work.
      </Feature>
      <Feature
        title="Limited Data Size"
        id="limited-data-size"
        hasBottomBorder={true}
      >
        Data uploads are limited to{' '}
        {freeTierSizeLimitMB * 1024} kB. If you need more,
        consider upgrading to Premium.
      </Feature>
      <Feature
        title="Hot Reloading & Interactive Widgets"
        id="hot-reloading"
        hasBottomBorder={true}
        learnMoreHref="https://vizhub.com/forum/t/hot-reloading-and-interactive-widgets/968"
      >
        Save time with real-time updates. Our code editor
        and runtime environment lets you iterate faster with
        truly instant feedback.
      </Feature>
      <Feature
        title="Community Access"
        id="community-access"
        hasBottomBorder={true}
      >
        Join a vibrant community. Connect, share, and grow
        with peers and experts committed to the art and
        science of visualization. Join our{' '}
        <a href="https://discord.gg/wbtJ7SCtYr">Discord</a>{' '}
        and <a href="https://vizhub.com/forum/">Forum</a> to
        connect with our community.
      </Feature>
      <Feature
        title="Free Courses"
        id="free-courses"
        hasBottomBorder={false}
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
