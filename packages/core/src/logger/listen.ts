import { LogEvent, createLogEvent, getGlobalEventTarget } from "./events";
import { LogLevel, meetsMinimumLevel } from "./level";
import type { Log } from "./log";
import type { Logger } from "./logger";
import { VerbosityLevel, resolveLogLevel } from "./verbosity";

export const _registerLog = (log: Log) => {
  getGlobalEventTarget().dispatchEvent(createLogEvent({ log }));
};

export type StopFunction = () => void;

/** This could make good generic code */
type PatternOption = string | string[] | RegExp | RegExp[] | null;

export interface LogFilter {
  logger?: Logger | Logger[] | null;
  messagePattern?: PatternOption;
  loggerNamePattern?: PatternOption;
  loggerIdPattern?: PatternOption;
  logIdPattern?: PatternOption;
  verbosity?: VerbosityLevel;
  logLevel?: LogLevel;
}

export interface ListenToLogsOptions {
  filter?: LogFilter;
  onLog: (log: Log, stop: StopFunction) => void;
  onStop?: () => void;
}

const matchesPattern = (
  value: string,
  pattern: PatternOption | undefined,
): boolean => {
  if (!pattern) return true;
  if (Array.isArray(pattern))
    return pattern.some((p) => matchesPattern(value, p));
  if (typeof pattern === "string") return value === pattern;
  return pattern.test(value);
};

const matchesLogger = (
  log: Log,
  loggerOrId: Logger | string,
  includeClones = true,
) => {
  const id = typeof loggerOrId === "string" ? loggerOrId : loggerOrId.id;
  if (id === log.meta.logger.id) return true;
  if (includeClones) {
    return (
      id.startsWith(log.meta.logger.id + "-clone") ||
      log.meta.logger.id.startsWith(id + "-clone")
    );
  }
  return false;
};

class FilterHandlers {
  constructor(public options: ListenToLogsOptions) {}

  logLevel(level: LogLevel, log: Log) {
    return log.level === level;
  }

  verbosity(verbosity: VerbosityLevel, log: Log) {
    return meetsMinimumLevel(log.level, resolveLogLevel(verbosity));
  }

  logger(loggerFilter: LogFilter["logger"], log: Log) {
    if (Array.isArray(loggerFilter)) {
      return loggerFilter.some((logger) => matchesLogger(log, logger));
    }

    return !loggerFilter || matchesLogger(log, loggerFilter);
  }

  messagePattern(pattern: PatternOption, log: Log) {
    const [mainMessage] = log.messages;
    const messageString =
      mainMessage instanceof Error ? mainMessage.message : mainMessage;
    return matchesPattern(messageString, pattern);
  }

  loggerNamePattern(pattern: PatternOption, log: Log) {
    return matchesPattern(log.meta.logger.name, pattern);
  }

  loggerIdPattern(pattern: PatternOption, log: Log) {
    return matchesPattern(log.meta.logger.id, pattern);
  }

  logIdPattern(pattern: PatternOption, log: Log) {
    return matchesPattern(log.id, pattern);
  }
}

export const listenToLogs = (options: ListenToLogsOptions): StopFunction => {
  const filterHandlers = new FilterHandlers(options);

  const onLog = (event: LogEvent) => {
    const log = event.log;
    const { filter, onLog } = options;

    for (const [key, value] of Object.entries(filter ?? {})) {
      if (
        value !== undefined &&
        value !== null &&
        key !== "includeLoggerClones" &&
        !filterHandlers[key as keyof LogFilter]?.(value, log)
      )
        return;
    }

    onLog(log, stop);
  };

  const stop = () => {
    getGlobalEventTarget().removeEventListener("log", onLog);
    options.onStop?.();
  };

  getGlobalEventTarget().addEventListener("log", onLog);

  return stop;
};
