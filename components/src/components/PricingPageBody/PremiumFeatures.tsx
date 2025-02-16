import {
  freeTierSizeLimitMB,
  premiumTierSizeLimitMB,
} from 'entities';
import { Feature } from './Feature';

export const PremiumFeatures = ({}) => (
  <>
    <Feature
      title="Fork & Modify Vizzes"
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
      title="Export Code"
      id="api-access-for-vizzes"
      learnMoreHref="https://vizhub.com/forum/t/api-access-for-vizzes/971"
      hasBottomBorder={true}
    >
      Export public vizzes as code. Perfect for integration
      with your existing workflows and applications. See
      also{' '}
      <a href="https://github.com/vizhub-core/vite-export-template">
        Vite Export Template
      </a>
      .
    </Feature>
    <Feature
      title="Private & Unlisted Vizzes"
      id="private-vizzes"
      hasBottomBorder={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/making-vizzes-private/977'
      }
      // startsExpanded={true}
    >
      Make your work private. Invite specific collaborators.
    </Feature>
    <Feature
      title="White Label Embedding"
      id="white-label-embedding"
      hasBottomBorder={true}
      // startsExpanded={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/embedding-vizzes/975'
      }
    >
      Embed your work in your Web site or app.
    </Feature>
    <Feature
      title="AI-Assisted Coding"
      id="ai-assisted-coding"
      hasBottomBorder={true}
      // startsExpanded={true}
      learnMoreHref="https://vizhub.com/forum/t/ai-assisted-coding/952"
    >
      Leverage artificial intelligence to code faster.
    </Feature>
    <Feature
      title="Upload Larger Datasets"
      id="larger-datasets"
      hasBottomBorder={false}
      // startsExpanded={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/importing-data-and-code-across-vizzes/973'
      }
    >
      Increased size limit from {freeTierSizeLimitMB * 1024}{' '}
      kB to {premiumTierSizeLimitMB} MB per viz.
    </Feature>
  </>
);
