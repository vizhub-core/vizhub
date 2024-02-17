import { ForkSVGSymbol } from '../Icons/sam/ForkSVG';
import { StarSVGSymbol } from '../Icons/sam/StarSVG';
import './styles.scss';

export const VizPreviewCollection = ({
  children,
  opacity = 1,
}) => (
  <>
    <ForkSVGSymbol />
    <StarSVGSymbol />
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
