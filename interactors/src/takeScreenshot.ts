import { Image } from 'entities';
import puppeteer from 'puppeteer';

export const takeScreenshot = async ({
  srcDoc,
  width,
  height,
}) => {
  const browser = await puppeteer.launch({
    executablePath: 'google-chrome-stable',
    headless: 'new',
    defaultViewport: { width, height },
  });

  const page = await browser.newPage();

  await page.setContent(srcDoc);

  // Wait for 5 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const screenshotBuffer = await page.screenshot({
    fullPage: true,
  });

  const image: Image = {
    buffer: screenshotBuffer,
    mimeType: 'image/png',
  };

  await browser.close();

  return image;
};
