export const LOG_LEVELS = Object.freeze([
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
  "silent",
] as const);

export type LogLevel = (typeof LOG_LEVELS)[number];

export type PrintableLogLevel = Exclude<LogLevel, "silent">;

const getLevelValue = (level: LogLevel) => LOG_LEVELS.indexOf(level);

export const meetsMinimumLevel = (level: LogLevel, minimum: LogLevel) =>
  getLevelValue(level) >= getLevelValue(minimum);
