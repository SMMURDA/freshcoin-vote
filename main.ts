import fs from 'fs';
import path from 'path';
import { isProxyWorking } from './proxyvalid';
import { withRetry } from './retry';
import { vote } from './vote';
import { logger } from './logger';

const proxyFile = path.join(__dirname, '../proxy.txt');

async function main() {
  const delayBetweenVotes = 1000; // ms delay antar proxy

  const rawProxies = fs
    .readFileSync(proxyFile, 'utf-8')
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean);

  if (rawProxies.length === 0) {
    console.error('No proxies found in proxy.txt');
    return;
  }

  while (true) {
    for (const proxy of rawProxies) {
      const valid = await isProxyWorking(proxy);
      if (!valid) {
        logger(`SKIPPED (invalid): ${proxy}`);
        continue;
      }

      await withRetry(
        async (p: string) => {
          await vote(p);
          return true;
        },
        [proxy]
      );

      await new Promise((res) => setTimeout(res, delayBetweenVotes));
    }

    logger('--- Rotasi proxy selesai, mulai ulang ---');
  }
}

main();
