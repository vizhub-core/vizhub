// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-client.jsx
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './app.css';
import 'vizhub-ui/dist/vizhub-ui.css';

// @ts-ignore
const pageData = window.pageData;

console.log('Welcome to VizHub!');
console.log('  version:', pageData.version);

hydrateRoot(
  document.getElementById('app'),
  <BrowserRouter>
    <App pageData={pageData} />
  </BrowserRouter>
);
