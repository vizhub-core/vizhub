import { Feature } from './Feature';

export const OrgFeatures = ({}) => (
  <>
    <Feature
      title="Private Organization"
      id="private-org"
      hasBottomBorder={true}
      // startsExpanded={true}
    >
      Create a VizHub Organization for your proprietary work
    </Feature>
    <Feature
      title="Per-Editor Pricing"
      id="per-editor-pricing"
      hasBottomBorder={true}
      // startsExpanded={true}
    >
      Only pay for org members who create and edit vizzes.
    </Feature>

    {/* <Feature
      title="Pay Per Seat"
      id="white-label-embedding"
      hasBottomBorder={true}
      startsExpanded={true}
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
      startsExpanded={true}
      learnMoreHref="https://vizhub.com/forum/t/ai-assisted-coding/952"
    >
      Leverage artificial intelligence to code faster.
    </Feature>
    <Feature
      title="Upload Larger Datasets"
      id="larger-datasets"
      hasBottomBorder={false}
      startsExpanded={true}
      learnMoreHref={
        'https://vizhub.com/forum/t/importing-data-and-code-across-vizzes/973'
      }
    >
      Increased size limit from {freeTierSizeLimitMB * 1024}{' '}
      kB to {premiumTierSizeLimitMB} MB per viz.
    </Feature> */}
  </>
);
