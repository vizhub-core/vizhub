import { ForkSVGSymbol } from '../Icons/sam/ForkSVG';
import { StarSVGSymbol } from '../Icons/sam/StarSVG';
import './styles.scss';

export const VizPreviewCollection = ({
  children,
  opacity = 1,
  includeSymbols = true,
}) => (
  <>
    {includeSymbols && (
      <>
        <ForkSVGSymbol />
        <StarSVGSymbol />
      </>
    )}

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
