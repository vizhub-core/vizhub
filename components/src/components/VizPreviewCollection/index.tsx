import './styles.scss';

export const VizPreviewCollection = ({
  children,
  opacity,
}) => (
  <div
    className="viz-preview-collection"
    style={{
      opacity,
    }}
  >
    {children}
  </div>
);
