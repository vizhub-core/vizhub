import { VizToast } from '../components/VizToast';

const Story = () => {
  return (
    <div className="layout-centered">
      <VizToast title="Limited Editing Permissions">
        <ul className="mb-0">
          <li>You do not have permissions to edit this viz</li>
          <li>Local edits are possible but won't be saved</li>
          <li>Disconnected from remote updates</li>
          <li>
            <a href="">Fork the viz</a> to save your local changes
          </li>
        </ul>
      </VizToast>
    </div>
  );
};

export default Story;
