import { AccountPageBody } from '../components/AccountPageBody';

export const args = {
  currentPlan: 'free',
  pricingHref: 'pricingHref',
  loginHref: 'loginHref',
  isUserAuthenticated: true,
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <AccountPageBody {...args} />
    </div>
  );
};

export default Story;
