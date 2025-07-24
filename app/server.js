import { createServer } from './index.js';
import path from 'path';

// Detect the correct root path based on current working directory
const currentDir = process.cwd();
let root;

if (currentDir.endsWith('/vizhub/app')) {
  // Running from vizhub/app directory
  root = currentDir;
} else if (currentDir.endsWith('/vizhub')) {
  // Running from vizhub directory
  root = path.join(currentDir, 'app');
} else {
  // Running from elsewhere
  root = path.join(currentDir, 'vizhub/app');
}

createServer({ root });
