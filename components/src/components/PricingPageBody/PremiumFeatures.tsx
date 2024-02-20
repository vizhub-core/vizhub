import { premiumTierSizeLimitMB } from 'entities';
import { Feature } from './Feature';

export const PremiumFeatures = ({}) => (
  <>
    <Feature title="Private Vizzes" hasBottomBorder={true}>
      Make your vizzes private
    </Feature>
    <Feature
      title="Unlimited Real-Time Collaborators"
      hasBottomBorder={true}
    >
      Invite friends and colleagues to view and edit your
      vizzes
    </Feature>
    <Feature
      title="White Label Embedding"
      hasBottomBorder={true}
    >
      Embed interactive vizzes without attribution
    </Feature>
    <Feature
      title="AI-Assisted Coding"
      hasBottomBorder={true}
      learnMoreHref="https://vizhub.com/forum/t/ai-assisted-coding/952"
      startsExpanded={false}
    >
      On-demand coding assistance from artificial
      intelligence
    </Feature>
    <Feature title="Upload Larger Datasets">
      Data uploads are limited to {premiumTierSizeLimitMB}{' '}
      MB
    </Feature>
  </>
);
