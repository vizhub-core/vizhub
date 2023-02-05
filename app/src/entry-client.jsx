// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-client.jsx
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

ReactDOM.hydrateRoot(
  document.getElementById('app'),
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
console.log('hydrated');
