import { freeTierSizeLimitMB } from 'entities';
import { Feature } from './Feature';

export const StarterFeatures = () => {
  return (
    <>
      <Feature
        title="Search Public Vizzes"
        id="search"
        hasBottomBorder={true}
      >
        Search by keyword to find public visualizations that
        inspire you. Explore and learn from the community's
        best work. Most content is MIT licensed, so you can
        use it in your own projects.
      </Feature>
      <Feature
        title="Export Code"
        id="api-access-for-vizzes"
        learnMoreHref="https://vizhub.com/forum/t/api-access-for-vizzes/971"
        hasBottomBorder={true}
      >
        Export public vizzes as code. Use our API to
        automate the export of your visualizations, perfect
        for integration with your existing workflows and
        applications. See also{' '}
        <a href="https://github.com/vizhub-core/vite-export-template">
          Vite Export Template
        </a>
        .
      </Feature>
      <Feature
        title="Create Public Vizzes"
        id="public-vizzes"
        hasBottomBorder={true}
      >
        Fork & modify public visualizations. Jump straght
        into coding without the need to set up a local
        development environment. Share your work with the
        world. Data uploads are limited to{' '}
        {freeTierSizeLimitMB * 1024} kB.
      </Feature>
      <Feature
        title="Real-Time Collaborators"
        id="real-time-collaborators"
        hasBottomBorder={true}
        learnMoreHref={
          'https://vizhub.com/forum/t/real-time-collaborators/976'
        }
      >
        Break down barriers to collaboration. Share your
        projects with an unlimited number of collaborators
        for a truly integrated team experience. Perfect for
        remote pair programming, live coding interviews, and
        actioning client feedback with the client on the
        call.
      </Feature>
      <Feature
        title="Join our Community"
        id="community-access"
        hasBottomBorder={true}
      >
        Join a vibrant community. Connect, share, and grow
        with peers and experts committed to the art and
        science of visualization. Join our{' '}
        <a href="https://discord.gg/wbtJ7SCtYr">Discord</a>{' '}
        and <a href="https://vizhub.com/forum/">Forum</a> to
        connect with our community. Ask for help any time!
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
