// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-server.jsx
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import SSRProvider from 'react-bootstrap/cjs/SSRProvider.js';
import { App } from './App';
export { pages } from './pages';
export { initializeGateways, api } from 'api/src/api';
import { VizKit } from 'api/src/VizKit';
export { authentication } from './authentication';

// This is the API client that runs on the server side.
export const vizKit = VizKit({ baseUrl: 'http://localhost:5173/api' });

export const render = (pageData) =>
  ReactDOMServer.renderToString(
    <StaticRouter location={pageData.url}>
      <SSRProvider>
        <App pageData={pageData} />
      </SSRProvider>
    </StaticRouter>
  );
