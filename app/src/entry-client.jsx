// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-client.jsx
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './app.css';
import 'vizhub-ui/dist/vizhub-ui.css';

console.log('Welcome to VizHub!');
console.log('  version:', window.pageData.version);

ReactDOM.hydrateRoot(
  document.getElementById('app'),
  <BrowserRouter>
    <App pageData={window.pageData} />
  </BrowserRouter>
);
