import { PricingPageBody } from '../components/PricingPageBody';

// This simulates being on the premium plan.
const Story = () => {
  return (
    <div className="layout-fullscreen">
      <PricingPageBody currentPlan="premium" />
    </div>
  );
};

export default Story;
