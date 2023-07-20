import { useTreeData } from 'react-stately';
import { VizPageSidebar } from '../components/VizPageSidebar';

// const args = {
//   //onExportClick: () => console.log('onExportClick'),
// };

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <VizPageSidebar />
    </div>
  );
};

export default Story;
