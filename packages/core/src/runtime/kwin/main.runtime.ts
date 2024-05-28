/* eslint-disable no-console */
import { format } from 'util';

const rawPrint = print;

const rawConsole: Console = {
  debug: console.debug,
  error: console.error,
  info: console.info,
  log: console.log,
  warn: console.warn,
  trace: console.trace,

  assert: console.assert,
  count: console.count,
  time: console.time,
  timeEnd: console.timeEnd,
};

if (!process.env.__KWIN_TS_RUNTIME_RAW_FORMATTING) {
  globalThis.print = (...args: unknown[]) => rawPrint(format(...args));

  const consoleMethods: NonNullable<
    {
      [key in keyof Console]?: Console[key] extends (...args: unknown[]) => void
        ? key
        : never;
    }[keyof Console]
  >[] = ['debug', 'error', 'info', 'log', 'warn', 'trace'];

  for (const method of consoleMethods) {
    console[method] = (...args: unknown[]) =>
      rawConsole[method](format(...args));
  }
}

globalThis.kwinTs = {
  rawPrint: rawPrint,
  rawConsole,
};
