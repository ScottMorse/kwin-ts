import { filterUndefined } from "../internal/object/filter";
import type { LogLevel } from "./level";

export interface GlobalLoggerOptions {
  name: string;
  verbosity: LogLevel;
}

export const DEFAULT_GLOBAL_LOGGER_OPTIONS: GlobalLoggerOptions = {
  name: "kwin-ts",
  verbosity: process.env.NODE_ENV === "development" ? "info" : "warn",
};

const GLOBAL_STATE = {
  loggerOptions: {
    ...DEFAULT_GLOBAL_LOGGER_OPTIONS,
  },
};

export const selectGlobalLoggerOption = <K extends keyof GlobalLoggerOptions>(
  key: K,
) => GLOBAL_STATE.loggerOptions[key];

export type DefaultLoggingOptions = Partial<GlobalLoggerOptions>;

export const setLoggingDefaults = (
  options:
    | DefaultLoggingOptions
    | ((options: DefaultLoggingOptions) => DefaultLoggingOptions),
) => {
  try {
    GLOBAL_STATE.loggerOptions = {
      ...GLOBAL_STATE.loggerOptions,
      ...filterUndefined(
        typeof options === "function"
          ? options(GLOBAL_STATE.loggerOptions)
          : options,
      ),
    };

    return { ...GLOBAL_STATE.loggerOptions };
  } catch (e) {
    import("./logger").then((mod) =>
      mod.defaultLogger.error("Failed to set logging defaults: ", e),
    );
    return { ...GLOBAL_STATE.loggerOptions };
  }
};
