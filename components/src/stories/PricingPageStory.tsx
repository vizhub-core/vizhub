import { PricingPageBody } from '../components/PricingPageBody';

export const args = {
  onStarterDowngradeClick: () => console.log('Starter downgrade clicked'),
  onPremiumUpgradeClick: () => console.log('Premium upgrade clicked'),
  onProfessionalUpgradeClick: () => console.log('Professional upgrade clicked'),
  isMonthly: true,
  setIsMonthly: (isMonthly: boolean) => console.log('Set monthly:', isMonthly),
  currentPlan: 'free' as const,
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <PricingPageBody {...args} />
    </div>
  );
};

export default Story;
