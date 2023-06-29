import xss from 'xss';

// Inspired by
// https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/server.js
// Also the Auth0 sample app found under vizhub3/auth0
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import express from 'express';
import jsesc from 'jsesc';
import { WebSocketServer } from 'ws';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import { matchPath } from 'react-router-dom';
import * as Sentry from '@sentry/node';
import { seoMetaTags } from './src/seoMetaTags.js';

// TODO import this from package.json
const version = '3.0.0-beta.10';

const env = process.env;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);
const isTest = env.VITEST;

// TODO better 404 page
const send404 = (res) => {
  res.status(404).set({ 'Content-Type': 'text/html' }).end('Not found');
};

async function createServer(
  root = process.cwd(),
  isProd = env.NODE_ENV === 'production',
  hmrPort
) {
  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : '';

  const prodServerEntry = isProd
    ? await import('./dist/server/entry-server.js')
    : null;

  const app = express();

  // Support parsing of JSON bodies in API requests.
  app.use(express.json());

  // Set up Sentry.
  // See https://vizhub.sentry.io/onboarding/setup-docs/
  Sentry.init({
    dsn: 'https://645705f71cac4ca08b3714784eb530f0@o4505320347271168.ingest.sentry.io/4505320348581888',
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Sentry.Integrations.Express({ app }),
      // Automatically instrument Node.js libraries and frameworks
      ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });

  // RequestHandler creates a separate execution context, so that all
  // transactions/spans/breadcrumbs are isolated across requests
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  let vite;
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    // Compress requests for performance in production.
    app.use((await import('compression')).default());

    // Serve the build as static files.
    app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false,
      })
    );
  }

  // Handle the API requests.
  // When an API endpoint changes, we do need to restart the server
  // TODO think about how to make it so we don't need to restart the server
  let entry;
  if (!isProd) {
    entry = await vite.ssrLoadModule('/src/entry-server.tsx');
  } else {
    entry = await import('./dist/server/entry-server.js');
  }

  // Unpack the entry point.
  const { initializeGateways, api, authentication } = entry;

  // This API is required for the ShareDB WebSocket server.
  const server = http.createServer(app);

  // Initialize gateways and database connections.
  const { gateways, shareDBBackend } = await initializeGateways({
    isProd,
    env,
    server,
  });

  // Listen for ShareDB connections over WebSocket.
  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    shareDBBackend.listen(new WebSocketJSONStream(ws));
  });

  // Set up the API endpoints.
  await api({ app, isProd, gateways });

  // Set up authentication.
  if (env.VIZHUB3_AUTH0_SECRET) {
    authentication({ app, env, gateways });
  } else {
    console.log(
      'Environment variable VIZHUB3_AUTH0_SECRET is not set. See README for details.'
    );
    console.log('Starting dev server without authentication enabled...');
  }

  // Debug for testing sentry
  app.get('/debug-sentry', function mainHandler(req, res) {
    throw new Error('My first Sentry error!');
  });

  // Handle SSR pages in such a way that they update (like hot reloading)
  // in dev on each page request, so we don't need to restart the server all the time.
  app.use('*', async (req, res) => {
    try {
      // const userInfo = await req.oidc.fetchUserInfo();
      // console.log(userInfo);

      const url = req.originalUrl;

      // This part is directly copied from:
      // https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/server.js
      let entry, template;

      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        entry = await vite.ssrLoadModule('/src/entry-server.tsx');
      } else {
        template = indexProd;
        entry = prodServerEntry;
      }
      const { render, pages } = entry;

      // Match the route and fetch its data.
      // https://stackoverflow.com/questions/66265608/react-router-v6-get-path-pattern-for-current-route
      // https://reactrouter.com/en/main/utils/match-path#matchpath
      let match;
      let matchedPage;

      for (const page of pages) {
        match = matchPath({ path: page.path }, url);
        if (match) {
          matchedPage = page;
          break;
        }
      }

      const params = match ? match.params : null;

      // Invalid URL
      if (!matchedPage) {
        return send404(res);
      }

      // Get at the currently authenticated user.
      const auth0User = req?.oidc?.user || null;

      // Invoke `getPageData` for the matched page.
      const pageData = matchedPage.getPageData
        ? await matchedPage.getPageData({
            params,
            env,
            gateways,
            auth0User,
          })
        : {};

      // Returning `null` from `getPageData()`
      // indicates that the resource was not found.
      if (pageData === null) {
        return send404(res);
      }

      // Expose the relative page URL (on page load) in `pageData`.
      // This allows the client to know if a client-side navigation happened.
      pageData.url = url;

      // Expose the current version to the client.
      pageData.version = version;

      const titleSanitized = xss(pageData.title);
      const descriptionSanitized = xss(pageData.description);
      const image = pageData.image;

      const html = template
        .replace(`<!--title-->`, titleSanitized)
        .replace(
          `<!--seo-meta-tags-->`,
          seoMetaTags({
            titleSanitized,
            descriptionSanitized,
            relativeUrl: url,
            image,
          })
        )
        .replace(`<!--app-html-->`, render(pageData))
        .replace(
          `<!--data-html-->`,
          `<script>window.pageData = ${jsesc(pageData)
            // Safely transporting page data to the client via JSON in a <script> tag.
            // We need to escape script ending tags, so we can transport HTML within JSON.

            // Inspired by:
            // https://github.com/ember-fastboot/fastboot/pull/85/commits/08d6e0ad653723be2096a0fab326164bd8f63ebf

            //const escaped = {
            //  '&': '\\u0026',
            //  '>': '\\u003e',
            //  '<': '\\u003c',
            //  '\u2028': '\\u2028',
            //  '\u2029': '\\u2029',
            //};
            //
            //const regex = /[\u2028\u2029&><]/g;
            //const replacer = (match) => escaped[match];
            //const escapeJSON = (json) => json.replace(regex, replacer);

            // https://www.man42.net/blog/2016/12/safely-escape-user-data-in-a-script-tag/
            // https://github.com/yahoo/serialize-javascript/blob/7f3ac252d86b802454cb43782820aea2e0f6dc25/index.js#L25
            // https://pragmaticwebsecurity.com/articles/spasecurity/json-stringify-xss.html
            // https://redux.js.org/usage/server-rendering/#security-considerations
            .replace(/</g, '\\u003c')};</script>`
        );

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());

  server.listen(5173, () => {
    console.log('VizHub App Server listening at http://localhost:5173');
    console.log('                               http://localhost:5173/joe');
    console.log(
      '                               http://localhost:5173/joe/viz1'
    );
    console.log('                               http://localhost:5173/explore');
  });
}

createServer();
