import { useState } from 'react';
import './App.scss';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const stories = import.meta.glob('./stories/*.jsx', { eager: true });

const entries = Object.keys(stories).map((key) => {
  const name = key.substring(10).split('.')[0];
  const component = stories[key][name];
  return { name, component };
});

function App() {
  const [Component, setComponent] = useState(null);
  return (
    <div className="App">
      <div className="sidebar">
        {entries.map(({ name, component }) => (
          <div
            key={name}
            className="entry"
            onClick={() => setComponent(component)}
          >
            {name}
          </div>
        ))}
      </div>
      <div className="component">{Component}</div>
    </div>
  );
}

export default App;
