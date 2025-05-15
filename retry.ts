export async function withRetry<T>(
  fn: (...args: any[]) => Promise<T>,
  args: any[],
  retries = 3,
  delay = 2000
): Promise<T | false> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fn(...args);
      if (res !== false) return res;
    } catch {}
    await new Promise((res) => setTimeout(res, delay));
  }
  return false;
}
