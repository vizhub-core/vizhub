import { SortControlWrapper, args } from './SortControlStoryHorizontal.jsx';
// An option for the vertical layout.
const isVertical = true;
const Story = () => {
  return (
    <div className="layout-centered">
      <SortControlWrapper {...args} isVertical={isVertical} />
    </div>
  );
};

export default Story;
