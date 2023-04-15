// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-server.jsx
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import SSRProvider from 'react-bootstrap/cjs/SSRProvider.js';
import fetch from 'node-fetch';
import { App } from './App';
export { pages } from './pages/server';
export { initializeGateways, api } from 'api/src/api';
export { authentication } from './authentication';

export const render = (pageData) =>
  ReactDOMServer.renderToString(
    <StaticRouter location={pageData.url}>
      <SSRProvider>
        <App pageData={pageData} />
      </SSRProvider>
    </StaticRouter>
  );
