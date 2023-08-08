import { VizToast } from '../components/VizToast';

const args = {
  message: 'This is a toast message',
};

const Story = () => {
  return (
    <div className="layout-centered">
      <VizToast {...args} />
    </div>
  );
};

export default Story;
