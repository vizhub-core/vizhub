import { useState, useEffect } from 'react';
import './App.scss';
import './stories/stories.css';
import { Sidebar } from './Sidebar';

// Auto generates list of stories.
// Supports hot reloading!
// https://vitejs.dev/guide/features.html#glob-import
const stories = import.meta.glob('./stories/*.jsx', {
  eager: true,
});
const entries = Object.keys(stories)
  .map((key) => {
    const name = key
      .substring(10)
      .split('.')[0]
      .replace('Story', '');
    // @ts-ignore
    const component = stories[key].default;
    return { key, name, component };
  })
  .filter(({ key }) => key.includes('Story'));
const entriesMap = new Map(entries.map((d) => [d.key, d]));

export const KitchenSinkApp = () => {
  // Get initial story from URL
  const getStoryFromURL = () => {
    const params = new URLSearchParams(
      window.location.search,
    );
    return params.get('story');
  };

  const [storyKey, setStoryKey] = useState(
    getStoryFromURL(),
  );
  const [showSidebar, setShowSidebar] = useState(true);

  // Update URL when story changes
  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search,
    );
    if (storyKey) {
      params.set('story', storyKey);
    } else {
      params.delete('story');
    }
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
  }, [storyKey]);
  const Component = storyKey
    ? entriesMap.get(storyKey).component
    : null;
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
      <div className="component">
        {Component ? <Component /> : null}
      </div>
    </div>
  );
};
