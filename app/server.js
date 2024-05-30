import xss from 'xss';

// Inspired by
// https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/server.js
// Also the Auth0 sample app found under vizhub3/auth0
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import { matchPath } from 'react-router-dom';
import * as Sentry from '@sentry/node';
import { createProxyMiddleware } from 'http-proxy-middleware';

const version = '3.0.0';

// Generate a random server ID for debugging scaling.
const serverId = Math.random().toString(36).slice(2);

let port = 5173;

const env = process.env;

const __dirname = path.dirname(
  fileURLToPath(import.meta.url),
);
const resolve = (p) => path.resolve(__dirname, p);
const isTest = env.VITEST;

const googleAnalyticsScript = `
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-N0T7CPN61K"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());
      gtag('config', 'G-N0T7CPN61K');
    </script>`;

// TODO better 404 page
const send404 = (res) => {
  res
    .status(404)
    .set({ 'Content-Type': 'text/html' })
    .end('Not found');
};

async function createServer(
  root = process.cwd(),

  // `isProd` is true when running in production mode.
  // Governs:
  // - whether to use Vite's dev server or not
  // - whether to use the production build or not
  // - whether to use Sentry or not

  isProd = env.NODE_ENV === 'production',
  hmrPort,
) {
  // if using the production build,
  // load it only once and cache the result
  const indexProd = isProd
    ? fs.readFileSync(
        resolve('dist/client/index.html'),
        'utf-8',
      )
    : '';
  const prodServerEntry = isProd
    ? await import('./dist/server/entry-server.js')
    : null;

  const app = express();

  // Configuration for the proxy to /forum
  app.set('trust proxy', true);
  const forumProxyConfig = {
    target:
      process.env.VIZHUB3_FORUM_PROXY_TARGET ||
      'http://54.198.173.108:80',
    changeOrigin: true,
    pathRewrite: {
      '^/forum': '',
    },
    onProxyReq: (proxyReq, req) => {
      proxyReq.setHeader('X-Forwarded-For', req.ip);
      // proxyReq.setHeader('X-Forwarded-Proto', req.protocol);
      proxyReq.setHeader('X-Forwarded-Proto', 'https');
      proxyReq.setHeader('X-Forwarded-Host', 'vizhub.com');
      proxyReq.setHeader('Host', 'vizhub.com');
    },
  };
  app.use(
    '/forum',
    createProxyMiddleware(forumProxyConfig),
  );

  // Support parsing of JSON bodies in API requests.
  // Removed as this interferes with the Stripe webhook signing.
  // app.use(express.json());

  // Set up Vite in dev mode.
  // This will attach the Vite dev server to our Express app.
  // This will also reload the server routes on file changes.
  let vite;
  if (!isProd) {
    // Development environment
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
    // Production environment

    // Compress requests for performance in production.
    app.use((await import('compression')).default());

    // Serve the build as static files.
    // app.use(
    //   (await import('serve-static')).default(
    //     resolve('dist/client'),
    //     {
    //       index: false,
    //     },
    //   ),
    // );

    // Set the max-age for the Cache-Control header to 1 year (in seconds)
    const oneYearInSeconds = 365 * 24 * 60 * 60;

    const serveStatic = (await import('serve-static'))
      .default;

    app.use(
      serveStatic(resolve('dist/client'), {
        index: false,
        setHeaders: (res) => {
          if (!isProd) {
            // Custom Cache-Control for dev
            res.setHeader(
              'Cache-Control',
              'public, max-age=0',
            );
          } else {
            // Aggressive Cache-Control for prod
            res.setHeader(
              'Cache-Control',
              `public, max-age=${oneYearInSeconds}`,
            );
          }
        },
      }),
    );

    // Set up Sentry, prod only.
    // See https://vizhub.sentry.io/onboarding/setup-docs/

    Sentry.init({
      dsn: 'https://645705f71cac4ca08b3714784eb530f0@o4505320347271168.ingest.sentry.io/4505320348581888',
      integrations: [],

      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions

      // Set sampling rate for profiling - this is relative to tracesSampleRate
      profilesSampleRate: 1.0,
    });

    Sentry.setupExpressErrorHandler(app);
    // RequestHandler creates a separate execution context, so that all
    // transactions/spans/breadcrumbs are isolated across requests
    // app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    // app.use(Sentry.Handlers.tracingHandler());
  }

  // Handle the API requests.
  // When an API endpoint changes, we do need to restart the server
  // TODO think about how to make it so we don't need to restart the server
  let entry;
  if (!isProd) {
    entry = await vite.ssrLoadModule(
      '/src/entry-server.tsx',
    );
  } else {
    entry = await import('./dist/server/entry-server.js');
  }

  // Unpack the entry point.
  const {
    initializeGateways,
    api,
    authentication,
    accessControl,
    seoMetaTags,
  } = entry;

  // This API is required for the ShareDB WebSocket server.
  const server = http.createServer(app);

  // Initialize gateways and database connections.
  const { gateways, shareDBBackend, shareDBConnection } =
    await initializeGateways({
      isProd,
      env,
      // server,
      attachMiddleware: (shareDBBackend) => {
        shareDBBackend.use(
          'connect',
          accessControl.identifyServerAgent,
        );
      },
    });

  // Set up authentication.
  let authMiddleware;
  if (env.VIZHUB3_AUTH0_SECRET) {
    authMiddleware = authentication({ env, gateways, app });
  } else {
    console.log(
      'Environment variable VIZHUB3_AUTH0_SECRET is not set. See README for details.',
    );
    console.log(
      'Starting dev server without authentication enabled...',
    );
  }

  // Access control at ShareDB level.
  shareDBBackend.use(
    'connect',
    accessControl.identifyClientAgent({
      authMiddleware,
      gateways,
    }),
  );
  shareDBBackend.use(
    'apply',
    accessControl.vizWrite(gateways),
  );
  shareDBBackend.use(
    'commit',
    accessControl.sizeCheck(gateways),
  );
  shareDBBackend.use(
    'readSnapshots',
    accessControl.vizRead(gateways),
  );
  shareDBBackend.use('query', accessControl.query());

  // Listen for ShareDB connections over WebSocket.
  const wss = new WebSocketServer({ server });

  // Set up new connections to interact with ShareDB.
  wss.on('connection', (ws, req) => {
    // console.log('req in connection ', Object.keys(req));
    const stream = new WebSocketJSONStream(ws);

    // Prevent server crashes on errors.
    stream.on('error', (error) => {
      console.log(
        'WebSocket stream error: ' + error.message,
      );
    });

    shareDBBackend.listen(stream, req);
  });

  // Set up the API endpoints.
  await api({ app, gateways, shareDBConnection });

  // Debug for testing sentry
  // app.get('/debug-sentry', function mainHandler(req, res) {
  //   throw new Error('My first Sentry error!');
  // });

  // Handle SSR pages in such a way that they update (like hot reloading)
  // in dev on each page request, so we don't need to restart the server all the time.
  app.use('*', async (req, res) => {
    try {
      const { originalUrl, baseUrl, query } = req;

      // This part is directly copied from:
      // https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/server.js
      let entry, template;

      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(
          resolve('index.html'),
          'utf-8',
        );
        template = await vite.transformIndexHtml(
          originalUrl,
          template,
        );
        entry = await vite.ssrLoadModule(
          '/src/entry-server.tsx',
        );
      } else {
        // use cached template in production
        template = indexProd;
        entry = prodServerEntry;
      }
      const { render, pages, escapeProperly } = entry;

      // Match the route and fetch its data.
      // https://stackoverflow.com/questions/66265608/react-router-v6-get-path-pattern-for-current-route
      // https://reactrouter.com/en/main/utils/match-path#matchpath
      let match;
      let matchedPage;

      // If the URL is `/`, match it to the home page.
      const urlToMatch = baseUrl || '/';

      for (const page of pages) {
        match = matchPath({ path: page.path }, urlToMatch);

        // Attempt to match the URL to the secondary path
        if (!match && page.path2) {
          match = matchPath(
            { path: page.path2 },
            urlToMatch,
          );
        }

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
            query,
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

      // Redirect to another page if page date indicates.
      if (pageData.redirect) {
        return res.redirect(pageData.redirect);
      }

      // Expose the relative page URL (on page load) in `pageData`.
      // This allows the client to know if a client-side navigation happened.
      pageData.url = originalUrl;

      // This has the query string stripped off.
      pageData.baseUrl = baseUrl;

      // Expose the current version to the client.
      pageData.version = version;
      pageData.serverId = serverId;

      const titleSanitized = xss(pageData.title);
      const descriptionSanitized = xss(
        pageData.description,
      );
      const image = pageData.image;
      const disableGoogleAnalytics =
        pageData.disableGoogleAnalytics;

      // Functions are used as the second argument to `replace()`
      // so that they are only evaluated when the template is rendered.
      // This avoids issues with special characters like "$$" in the page data.
      const html = template
        .replace(/<!--title-->/, () => titleSanitized)
        .replace(
          /<!--seo-meta-tags-->/,
          () =>
            seoMetaTags({
              titleSanitized,
              descriptionSanitized,
              relativeUrl: originalUrl,
              image,
            }) +
            (disableGoogleAnalytics
              ? ''
              : googleAnalyticsScript),
        )
        .replace(/<!--app-html-->/, () => render(pageData))
        .replace(
          /<!--data-html-->/,
          () =>
            `<script>window.pageData = ${escapeProperly(
              JSON.stringify(pageData),
            )};</script>`,
        );

      res
        .status(200)
        .set({ 'Content-Type': 'text/html' })
        .end(html);
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  // The error handler must be before any other error middleware and after all controllers
  // app.use(Sentry.Handlers.errorHandler());

  const BASE_URL = `http://localhost:${port}`;
  const ENDPOINTS = [
    '',
    '/joe',
    '/joe/viz1',
    '/joe/v3-runtime-demo',
    '/explore',
    '/account',
    '/pricing',
    '/resources',
    '/create-viz',
    '/vizhub-ui-kitchen-sink',
    '/search?query=map',
  ];

  server.listen(port, () => {
    console.log(
      `VizHub App Server listening at ${BASE_URL}`,
    );
    ENDPOINTS.slice(1).forEach((endpoint) => {
      console.log(
        `                               ${BASE_URL}${endpoint}`,
      );
    });
  });
}

createServer();
