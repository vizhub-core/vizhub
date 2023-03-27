import { useState } from 'react';
import './App.scss';
import './stories/stories.css';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const stories = import.meta.glob('./stories/*.jsx', { eager: true });

const entries = Object.keys(stories).map((key) => {
  const name = key.substring(10).split('.')[0];
  const component = stories[key].default;
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
            className={`entry${component === Component ? ' active' : ''}`}
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
