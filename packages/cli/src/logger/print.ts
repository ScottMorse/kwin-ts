import { getChildren, getParent } from "./child";
import { LOG_LEVELS, PrintableLogLevel, meetsMinimumLevel } from "./level";
import { format } from "node:util";
import { __setPrinted, type Log } from "./log";
import type { Logger } from "./internal/logger";
import { resolveOption } from "./options";
import { resolveLogLevel } from "./verbosity";

const resolveConsoleMethod = (level: PrintableLogLevel) => {
  const method = console[level === "fatal" ? "error" : level];
  if (!method) {
    console.error(`No matched console method: ${level}`);

    return console.log;
  }
  return method;
};

export const formatName = (
  log: Log | Logger,
  _getIsRoot = (_logger: Logger) => false,
): string => {
  const logger = (log as Log).meta?.logger || log;

  const parent = getParent(logger);
  const nthChild = parent
    ? getChildren(parent).findIndex((l) => l.id === logger.id)
    : 0;
  const rawName = logger.options.name;

  const newPart =
    rawName === "inherit"
      ? parent
        ? _getIsRoot(parent)
          ? ""
          : `<child ${nthChild + 1}>`
        : resolveOption(logger, "name")
      : resolveOption(logger, "name");

  return (
    (parent ? formatName(parent) : "") +
    (newPart && parent ? "." : "") +
    newPart
  );
};

const PAD_LENGTH = LOG_LEVELS.reduce(
  (max, level) =>
    level !== "silent" && level.length > max ? level.length : max,
  -1,
);

const formatPrefix = (log: Log) => {
  return `[${log.level.toUpperCase().padEnd(PAD_LENGTH)} ${
    log.meta.logger.name
  }]`;
};

export const printLog = (log: Log, force?: boolean) => {
  if (!force) {
    if (
      !meetsMinimumLevel(
        log.level,
        resolveLogLevel(resolveOption(log.meta.logger, "verbosity")),
      )
    ) {
      return false;
    }
  }

  if (log.level === "silent") {
    return false;
  }

  const lines = format(...log.messages).split("\n");

  resolveConsoleMethod(log.level)(
    formatPrefix(log) +
      " " +
      lines.reduce(
        (acc, line) =>
          acc +
          "\n" +
          formatPrefix(log) +
          " " +
          (/^(\}|\]|\))/.test(line) ? line : line.replace(/^( {2})?/, "  ")),
      ),
  );

  __setPrinted(log, true);
  return true;
};
