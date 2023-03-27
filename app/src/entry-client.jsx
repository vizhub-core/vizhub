// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-client.jsx
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './app.css';

ReactDOM.hydrateRoot(
  document.getElementById('app'),
  <BrowserRouter>
    <App pageData={window.pageData} />
  </BrowserRouter>
);
console.log('hydrated');
