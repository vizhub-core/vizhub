import { premiumTierSizeLimitMB } from 'entities';
import { Feature } from './Feature';

export const PremiumFeatures = ({}) => (
  <>
    <Feature
      title="Private Vizzes"
      hasBottomBorder={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/making-vizzes-private/977'
      }
    >
      Maintain confidentiality with private visualizations
    </Feature>
    <Feature
      title="AI-Assisted Coding"
      hasBottomBorder={true}
      learnMoreHref="https://vizhub.com/forum/t/ai-assisted-coding/952"
    >
      Speed up your coding process with artificial
      intelligence
    </Feature>
    <Feature
      title="Unlimited Real-Time Collaborators"
      hasBottomBorder={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/real-time-collaborators/976'
      }
    >
      Share your work selectively with specific
      collaborators
    </Feature>
    <Feature
      title="White Label Embedding"
      hasBottomBorder={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/embedding-vizzes/975'
      }
    >
      Embed interactive visualizations without VizHub
      branding
    </Feature>
    <Feature
      title="Upload Larger Datasets"
      learnMoreHref={
        'https://vizhub.com/forum/t/importing-data-and-code-across-vizzes/973'
      }
    >
      Data uploads are limited to {premiumTierSizeLimitMB}{' '}
      MB
    </Feature>
  </>
);
