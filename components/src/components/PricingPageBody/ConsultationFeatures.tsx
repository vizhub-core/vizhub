import { Feature } from './Feature';

export const ConsultationFeatures = ({}) => (
  <>
    <Feature
      title="First Meeting Free"
      id="first-meeting-free"
      hasBottomBorder={true}
      startsExpanded={true}
    >
      Not sure if this format is right for you, or
      interested in a larger fixed-price custom
      visualization engagement?{' '}
      <a href="https://calendly.com/curran-kelleher/casual">
        Schedule an exploratory call for free
      </a>
      to find out how I can help you with your interactive
      data visualization needs.
    </Feature>
    <Feature
      title="Visualize Your Data"
      id="visualize-your-data"
      hasBottomBorder={true}
      // startsExpanded={true}
    >
      Get help with your data visualization project. Bring
      your data and your questions, and we'll work together
      to create a visualization that tells the story of your
      data.
    </Feature>
    <Feature
      title="Design & Build Interactive Visualizations"
      id="design-interactive-visualizations"
      hasBottomBorder={true}
      // startsExpanded={true}
    >
      Do you have a rich or complex dataset that you want to
      visualize in an interactive way, but you're not sure
      where to begin? Bring your data and your ideas, and
      we'll work together to brainstorm, strategize, sketch,
      and prototype an interactive visualization.
    </Feature>
    <Feature
      title="Augment your Engineering Team"
      id="augment-your-engineering-team"
      hasBottomBorder={true}
      // startsExpanded={true}
    >
      Are you looking to develop next level visualizations,
      but your team does not have the right expertise? I can
      help you develop your visualization project, and
      provide guidance to your team on an ongoing basis.
    </Feature>
    <Feature
      title="Work Through Hard Problems"
      id="work-through-hard-problems"
      hasBottomBorder={true}
      // startsExpanded={true}
    >
      Have you been stuck for hours or days on a data
      visualization problem? Bring your problem to the
      consultation, and we'll work through it together.
    </Feature>
    <Feature
      title="Optimize Performance"
      id="optimize-performance"
      hasBottomBorder={true}
      // startsExpanded={true}
    >
      Is your data visualization slow or sluggish? We can
      help you optimize its performance. Bring your
      visualization, and we'll analyze it together,
      identifying bottlenecks and implementing strategies to
      improve its speed and efficiency.
    </Feature>

    <Feature
      title="Integrate Visualizations with Your Platform"
      id="integrate-visualizations-with-your-platform"
      hasBottomBorder={false}
      // startsExpanded={true}
    >
      Want to seamlessly integrate your visualizations into
      your website or application? We can help. Bring your
      platform details and visualization requirements, and
      we'll work together to ensure a smooth integration
      that enhances your user experience.
    </Feature>
  </>
);
