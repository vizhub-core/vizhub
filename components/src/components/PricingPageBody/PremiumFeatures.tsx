import {
  freeTierSizeLimitMB,
  premiumTierSizeLimitMB,
} from 'entities';
import { Feature } from './Feature';
import { CREDIT_MARKUP } from 'entities/src/Pricing';

export const PremiumFeatures = ({}) => (
  <>
    <Feature
      title="Unlimited Edit with AI Chat"
      id="unlimited-ai-chat"
      hasBottomBorder={true}
      startsExpanded={false}
      // learnMoreHref="https://vizhub.com/forum/t/ai-assisted-coding/952"
    >
      Unlimited access to Edit with AI coding chat
    </Feature>

    <Feature
      title="Unlimited Non-Public Vizzes"
      id="unlimited-non-public-vizzes"
      hasBottomBorder={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/making-vizzes-private/977'
      }
      // startsExpanded={true}
    >
      Make an unlimited number of your vizzes private or
      unlisted. Invite specific collaborators.
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
