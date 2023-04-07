import { Spinner } from 'components';
import { useState, useEffect } from 'react';
import './styles.scss';

export const EditorDemo = () => {
  const [demoModule, setDemoModule] = useState(null);
  useEffect(() => {
    import('./EditorDemoBody').then(setDemoModule);
  }, []);

  const Component = demoModule ? demoModule.EditorDemoBody : Spinner;
  return (
    <div className="editor-demo">
      <Component />
    </div>
  );
};
