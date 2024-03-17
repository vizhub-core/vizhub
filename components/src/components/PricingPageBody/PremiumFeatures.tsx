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
      startsExpanded={true}
    >
      Make your visualizations private to only you and your
      collaborators. Keep your work secure and share it only
      with those you choose. Perfect for sensitive data and
      work in progress.
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
      title="Upload Larger Datasets"
      id="larger-datasets"
      hasBottomBorder={false}
      learnMoreHref={
        'https://vizhub.com/forum/t/importing-data-and-code-across-vizzes/973'
      }
    >
      Freely upload your raw data, with an increased limit
      of {premiumTierSizeLimitMB} MB per viz.
    </Feature>
  </>
);
