import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { logger } from './logger';

puppeteer.use(StealthPlugin());

export async function vote(proxyLine: string): Promise<void> {
  const targetUrl = 'https://www.freshcoins.io/coins/matic';
  const xpath = '//*[@id="__next"]/div/div[2]/div/div[1]/div[1]/button';

  const parts = proxyLine.split(':');
  const host = parts[0];
  const port = parts[1];
  const hasAuth = parts.length === 4;

  const proxyUrl = `http://${host}:${port}`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        `--proxy-server=${proxyUrl}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--incognito',
      ],
    });

    const page = await browser.newPage();

    if (hasAuth) {
      const username = parts[2];
      const password = parts[3];
      await page.authenticate({ username, password });
    }

    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    const [voteButton] = await page.$x(xpath);
    if (voteButton) {
      await voteButton.click();
      await page.waitForTimeout(2000);
      logger(`SUCCESS: Voted with proxy ${proxyLine}`);
    } else {
      logger(`FAILED: Vote button NOT found - ${proxyLine}`);
    }

    await browser.close();
  } catch (err: any) {
    logger(`ERROR: ${proxyLine} -> ${err.message}`);
  }
}
