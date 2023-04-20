import { LogoSVG } from '../components/Icons/LogoSVG';

const icons = [LogoSVG];

const Story = () => {
  return (
    <div className="layout-fullscreen">
      {icons.map((IconSVG) => (
        <div style={{ display: 'flex', 'flex-wrap': 'wrap' }}>
          <div style={{ border: '1px solid gray', margin: '10px' }}>
            <IconSVG />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Story;
