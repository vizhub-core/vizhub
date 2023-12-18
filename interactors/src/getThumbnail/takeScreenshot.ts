import { CommitId, Image } from 'entities';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';
import sharp from 'sharp';

const debug = false;

// The maximum number of concurrent screenshots
const maxSimultaneousScreenshots = 3;

// The maximum time to wait for a page to load (in ms)
const maxPageLoadTimeMS = 8000;

// Limit JS heap size to this many megabytes
const maxMemoryMB = 512;

let browser: Browser; // Reusable browser instance

const launchBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: 'google-chrome-stable',
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        `--js-flags="--max-old-space-size=${maxMemoryMB}"`,
      ],
    });
  }
  return browser;
};

// A semaphore to limit the number of concurrent screenshots
class Semaphore {
  max: number;
  counter: number;
  queue: Array<() => void>;
  constructor(max: number) {
    this.max = max;
    this.counter = max;
    this.queue = [];
  }

  async acquire() {
    if (this.counter > 0) {
      this.counter--;
      return Promise.resolve();
    }

    // If counter is 0, wait until a resource is free
    return new Promise<void>((resolve: () => void) => {
      this.queue.push(resolve);
    });
  }

  release() {
    if (this.queue.length > 0) {
      // Release the next task in the queue
      const nextResolve = this.queue.shift();
      nextResolve();
    } else {
      // Increment the counter if no tasks are waiting
      this.counter++;
    }
  }
}

// Create a semaphore to govern concurrent tasks.
// We limit concurrent tasks so that we don't
// overload the server (run out of memory)

const screenshotSemaphore = new Semaphore(
  maxSimultaneousScreenshots,
);

export const takeScreenshot = async ({
  srcDoc,
  width,
  height,

  // Exposed here only so we can override it in tests
  waitTime = maxPageLoadTimeMS,
}: {
  srcDoc: string;
  width: number;
  height: number;
  waitTime?: number;
}) => {
  if (debug) {
    console.log('Launching puppeteer');
    console.log('srcDoc', srcDoc);
    console.log('width', width);
    console.log('height', height);
  }

  if (debug) {
    console.log('Acquiring screenshot semaphore');
  }
  await screenshotSemaphore.acquire();

  try {
    const browser = await launchBrowser();

    const page = await browser.newPage();
    await page.setViewport({ width, height });

    await page.setContent(srcDoc);

    if (debug) {
      console.log(`Waiting for ${waitTime / 1000} seconds`);
    }

    await new Promise((resolve) =>
      setTimeout(resolve, waitTime),
    );

    if (debug) {
      console.log(`Done waiting`);
    }

    // Take a screenshot of the page
    const pngBuffer = await page.screenshot({
      fullPage: true,
    });

    // Convert the screenshot to WebP format using sharp
    const webpBuffer = await sharp(pngBuffer)
      .webp()
      .toBuffer();

    const image: Image = {
      buffer: webpBuffer,
    };
    if (debug) {
      console.log('Closing page');
    }
    await page.close();

    return image;
  } catch (error) {
    if (debug) {
      console.error('Error taking screenshot:', error);
    }
    throw error;
  } finally {
    if (debug) {
      console.log('Releasing screenshot semaphore');
    }
    screenshotSemaphore.release();
  }
};
