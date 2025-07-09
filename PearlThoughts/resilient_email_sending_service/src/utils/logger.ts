export type LogLevel = 'info' | 'warn' | 'error';

export const log = (level: LogLevel, msg: string, meta: object = {}) =>
  console.log(`[${new Date().toISOString()}] [${level.toUpperCase()}] ${msg}`,
              JSON.stringify(meta));
