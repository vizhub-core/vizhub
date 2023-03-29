import { useState } from 'react';
import './App.scss';
import './stories/stories.css';

// Auto generates list of stories.
// Supports hot reloading!
// https://vitejs.dev/guide/features.html#glob-import
const stories = import.meta.glob('./stories/*.jsx', { eager: true });
const entries = Object.keys(stories)
  .map((key) => {
    const name = key.substring(10).split('.')[0].replace('Story', '');
    const component = stories[key].default;
    return { key, name, component };
  })
  .filter(({ key }) => key.includes('Story'));
const entriesMap = new Map(entries.map((d) => [d.name, d]));

function App() {
  const [storyName, setStoryName] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const Component = storyName ? entriesMap.get(storyName).component : null;
  return (
    <div className="App">
      {showSidebar ? (
        <div className="sidebar" tabIndex="0">
          <div
            className="entry hide-sidebar"
            onClick={() => setShowSidebar(false)}
          >
            hide sidebar
          </div>
          {entries.map(({ name }) => (
            <div
              tabIndex="-1"
              key={name}
              className={`entry${name === storyName ? ' active' : ''}`}
              onClick={() => setStoryName(name)}
            >
              {name}
            </div>
          ))}
        </div>
      ) : null}
      <div className="component">{Component ? <Component /> : null}</div>
    </div>
  );
}

export default App;
