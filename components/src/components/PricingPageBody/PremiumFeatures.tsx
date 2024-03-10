import { premiumTierSizeLimitMB } from 'entities';
import { Feature } from './Feature';

export const PremiumFeatures = ({}) => (
  <>
    <Feature
      title="Private Vizzes"
      id="private-vizzes"
      hasBottomBorder={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/making-vizzes-private/977'
      }
    >
      Protect your exclusive insights. With private
      visualizations, your confidential data remains secure.
      Perfect for sensitive projects in professional
      settings.
    </Feature>
    <Feature
      title="AI-Assisted Coding"
      id="ai-assisted-coding"
      hasBottomBorder={true}
      learnMoreHref="https://vizhub.com/forum/t/ai-assisted-coding/952"
    >
      Enhance your coding with AI. Speed up your workflow,
      reduce errors, and innovate faster. Break through
      technical challenges faster, freeing up time for
      research, analysis, and creativity.
    </Feature>
    <Feature
      title="Unlimited Real-Time Collaborators"
      id="real-time-collaborators"
      hasBottomBorder={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/real-time-collaborators/976'
      }
    >
      Break down barriers to collaboration. Share your
      projects with an unlimited number of collaborators for
      a truly integrated team experience. Perfect for remote
      pair programming, live coding interviews, and
      actioning client feedback with the client on the call.
    </Feature>
    <Feature
      title="White Label Embedding"
      id="white-label-embedding"
      hasBottomBorder={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/embedding-vizzes/975'
      }
    >
      Present your visualizations with your branding. Embed
      visualizations seamlessly into your Web pages or
      application, without the VizHub logo and linkback. Let
      VizHub host your interactives so you don't have to.
    </Feature>
    <Feature
      title="Upload Larger Datasets"
      id="larger-datasets"
      hasBottomBorder={false}
      learnMoreHref={
        'https://vizhub.com/forum/t/importing-data-and-code-across-vizzes/973'
      }
    >
      Handle larger data with ease. Our increased data limit
      of {premiumTierSizeLimitMB} MB per viz enables more
      detailed analysis and richer storytelling.
    </Feature>
  </>
);
