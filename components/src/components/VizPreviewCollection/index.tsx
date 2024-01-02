import './styles.scss';

export const VizPreviewCollection = ({
  children,
  opacity = 1,
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
