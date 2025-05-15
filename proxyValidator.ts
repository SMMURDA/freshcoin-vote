import axios from 'axios';

export async function isProxyWorking(proxy: string): Promise<boolean> {
  const parts = proxy.split(':');
  const host = parts[0];
  const port = parseInt(parts[1]);
  const hasAuth = parts.length === 4;

  const proxyConfig: any = {
    protocol: 'http',
    host,
    port,
  };

  if (hasAuth) {
    proxyConfig.auth = {
      username: parts[2],
      password: parts[3],
    };
  }

  try {
    await axios.get('http://www.google.com', {
      proxy: proxyConfig,
      timeout: 5000,
    });
    return true;
  } catch {
    return false;
  }
}
