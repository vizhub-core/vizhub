import { useState } from 'react';
import './App.scss';
import './stories/stories.css';
import { Sidebar } from './Sidebar';

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
const entriesMap = new Map(entries.map((d) => [d.key, d]));

function App() {
  const [storyKey, setStoryKey] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const Component = storyKey ? entriesMap.get(storyKey).component : null;
  return (
    <div className="App">
      {showSidebar ? (
        <Sidebar
          entries={entries}
          storyKey={storyKey}
          setStoryKey={setStoryKey}
          setShowSidebar={setShowSidebar}
        />
      ) : null}
      <div className="component">{Component ? <Component /> : null}</div>
    </div>
  );
}

export default App;
