import { Feature } from './Feature';

export const ProFeatures = ({}) => (
  <>
    <Feature
      title="AI Credits Included Monthly"
      id="ai-credits-included"
      hasBottomBorder={true}
      startsExpanded={true}
    >
      Get up to $30 in AI credits each month for AI-assisted
      coding.
      <ul className="mt-2">
        <li>
          <strong>Monthly Allocation</strong> - Up to $30 in
          AI credits included per month
        </li>
        <li>
          <strong>Top Up Anytime</strong> - When you need
          more credits
        </li>
      </ul>
    </Feature>
    <Feature
      title="Priority Support"
      id="priority-support"
      hasBottomBorder={true}
    >
      Get faster responses to your questions in Discord.
    </Feature>
    <Feature
      title="Early Access to New Features"
      id="early-access"
      hasBottomBorder={false}
    >
      Be the first to try new features before they're
      released to everyone.
    </Feature>
  </>
);
