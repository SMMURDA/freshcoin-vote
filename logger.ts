import fs from 'fs';
import path from 'path';

const logFile = path.join(__dirname, '../log.txt');

export function logger(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(line.trim());
  fs.appendFileSync(logFile, line);
}
