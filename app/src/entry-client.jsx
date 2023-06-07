// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-client.jsx
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import './app.css';
import 'vizhub-ui/dist/vizhub-ui.css';

ReactDOM.hydrateRoot(
  document.getElementById('app'),
  <BrowserRouter>
    <App pageData={window.pageData} />
  </BrowserRouter>
);
