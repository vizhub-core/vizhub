import { ForkSVGSymbol } from '../Icons/sam/ForkSVG';
import { ThumbsUpSVGSymbol } from '../Icons/sam/ThumbsUpSVG';
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
        <ThumbsUpSVGSymbol />
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
