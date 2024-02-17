import { ForkSVGSymbol } from '../Icons/sam/ForkSVG';
import './styles.scss';

export const VizPreviewCollection = ({
  children,
  opacity = 1,
}) => (
  <>
    <ForkSVGSymbol />
    <div
      className="viz-preview-collection"
      style={{
        opacity,
      }}
    >
      {children}
    </div>
  </>
);
