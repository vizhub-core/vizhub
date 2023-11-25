import { Image } from 'entities';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

const debug = false;

// The maximum number of concurrent screenshots
const maxSimultaneousScreenshots = 3;

// The maximum time to wait for a page to load (in ms)
const maxPageLoadTimeMS = 8000;

let browser: Browser; // Reusable browser instance

const launchBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: 'google-chrome-stable',
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
      console.log(
        `Waiting for ${maxPageLoadTimeMS / 1000} seconds`,
      );
    }

    // Wait for document.readyState to be "complete",
    // or a maximum of 5 seconds
    // await Promise.race([
    //   page.waitForFunction(
    //     'document.readyState === "complete"',
    //   ),
    //   new Promise((resolve) =>
    //     setTimeout(resolve, maxPageLoadTimeMS),
    //   ),
    // ]);
    await new Promise((resolve) =>
      setTimeout(resolve, maxPageLoadTimeMS),
    );

    if (debug) {
      console.log(`Done waiting`);
    }

    // // Wait for all network requests to finish
    // await page.waitForFunction(
    //   'document.readyState === "complete"',
    // );

    // // Wait for an additional second, just in case
    // // for various graphics to finish rendering.
    // await new Promise((resolve) =>
    //   setTimeout(resolve, 1000),
    // );

    // Take a screenshot of the page
    const screenshotBuffer = await page.screenshot({
      fullPage: true,
    });

    const image: Image = {
      buffer: screenshotBuffer,
      mimeType: 'image/png',
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
