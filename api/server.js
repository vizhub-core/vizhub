import xss from 'xss';

// Inspired by
// https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/server.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import jsesc from 'jsesc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);
const isTest = process.env.VITEST;
//
//process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertyuiop';
//
async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort
) {
  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : '';

  const app = express();

  app.use((await import('compression')).default());

  let entry;
  if (!isProd) {
    // Skip the build step in dev.
    const entry = await vite.ssrLoadModule('/src/entry-server.jsx');
  } else {
    const entry = await import('./dist/server/entry-server.js');
  }

  return { app };
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log('VizHub API Server listening at http://localhost:3000');
  })
);
