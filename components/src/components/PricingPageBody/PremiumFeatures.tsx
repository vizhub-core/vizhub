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
      Protect your exclusive insights. With private
      visualizations, your confidential data remains secure,
      perfect for sensitive projects in professional
      settings.
    </Feature>
    <Feature
      title="AI-Assisted Coding"
      hasBottomBorder={true}
      learnMoreHref="https://vizhub.com/forum/t/ai-assisted-coding/952"
    >
      Enhance your coding with AI. Speed up your workflow,
      reduce errors, and innovate faster, freeing up time
      for research, analysis, and creativity.
    </Feature>
    <Feature
      title="Unlimited Real-Time Collaborators"
      hasBottomBorder={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/real-time-collaborators/976'
      }
    >
      Break down barriers to collaboration. Share your
      projects with an unlimited number of collaborators for
      a truly integrated team experience, essential for
      SMBs, research teams, and educators.
    </Feature>
    <Feature
      title="White Label Embedding"
      hasBottomBorder={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/embedding-vizzes/975'
      }
    >
      Present with <em>your</em> branding. Embed
      visualizations seamlessly into your Web pages or
      application. Let VizHub host your interactives so you
      don't have to.
    </Feature>
    <Feature
      title="Upload Larger Datasets"
      learnMoreHref={
        'https://vizhub.com/forum/t/importing-data-and-code-across-vizzes/973'
      }
    >
      Handle more complex data with ease. Our increased data
      limit of {premiumTierSizeLimitMB} MB per viz enables
      more detailed analysis and richer storytelling, a
      crucial feature for SMBs, non-profits, and researchers
      needing to convey impactful narratives from rich data.
    </Feature>
  </>
);
