import { mergeWith } from "lodash";
import type { Alias } from "node-polyfill-webpack-plugin";
import { expandHome } from "../internal/fileSystem/home";
import { deepFreeze } from "../internal/object/freeze";
import type { Override } from "../internal/types";
import type { VerbosityLevel } from "../logger";

export type NodePolyfillOption = Exclude<Alias, "console">;

/**
 * Variables that can be accessed via `process.env` in
 * the input KWin scripts.
 */
export interface EnvironmentVariables {
  [key: string]: unknown;
}

export interface KWinTsConfigOptions {
  /** Defaults to the current working directory */
  inputDirectory?: string;
  /**
   * The directory where output scripts will be written.
   *
   * By default, output goes into the input `inputDirectory`,
   * which is the current working directory by default, so
   * that the generated`main.js` will be alongside the original `main.ts`.
   *
   * The default can be set via `process.env.KWIN_TS_DEFAULT_OUTPUT_PATH`.
   */
  outputDirectory?: string;
  /** Toggle minimization, mangling, etc. If "auto", will determine based on NODE_ENV, disabling for NODE_ENV="development" */
  optimize?: boolean | "auto";
  /** Default `true`, clean the output directory before writing */
  cleanOutput?: boolean;
  /** Default `true`, polyfill any imports of node libraries */
  nodePolyfills?:
    | boolean
    | NodePolyfillOption[]
    | readonly NodePolyfillOption[];
  /** The logging level */
  verbosity?: VerbosityLevel /**
   * By default, this is `false`, meaning logs written
   * via `console` or `print` are formatted via
   * Node's formatter.
   *
   * Enable raw formatting to use the default KWin
   * script's output.
   */;
  rawLogFormatting?: boolean;
  /**
   * Variables that can be accessed via `process.env` in
   * the input KWin scripts.
   */
  environmentVariables?: EnvironmentVariables;
}

export type KWinTsConfig = Override<
  Required<KWinTsConfigOptions>,
  {
    optimize: boolean;
  }
>;

export const DEFAULT_CONFIG: KWinTsConfig = deepFreeze({
  outputDirectory:
    process.env.KWIN_TS_DEFAULT_OUTPUT_PATH ?? "./kwin-ts-output",
  inputDirectory: process.env.KWIN_TS_INPUT_BASE_DIRECTORY ?? process.cwd(),
  optimize: process.env.NODE_ENV !== "development",
  nodePolyfills: true,
  cleanOutput: false,
  verbosity:
    (process.env.KWIN_TS_COMPILER_VERBOSITY_LEVEL as VerbosityLevel) ??
    "default",
  rawLogFormatting:
    process.env.KWIN_TS_RAW_LOG_FORMATTING?.toString() === "true" || false,
  environmentVariables: JSON.parse(
    process.env.KWIN_TS_RUNTIME_ENVIRONMENT_VARIABLES ?? "{}",
  ),
});

const resolveDirectory = (
  dir: string | null | undefined,
  defaultValue: string,
) => {
  return dir ? expandHome(dir) : defaultValue;
};

export const finalizeConfig = (options: KWinTsConfigOptions): KWinTsConfig =>
  mergeWith(
    {},
    DEFAULT_CONFIG,
    {
      ...options,
      inputDirectory: resolveDirectory(
        options.inputDirectory,
        DEFAULT_CONFIG.inputDirectory,
      ),
      outputDirectory: resolveDirectory(
        options.outputDirectory,
        DEFAULT_CONFIG.outputDirectory,
      ),
      optimize:
        options.optimize === "auto"
          ? DEFAULT_CONFIG.optimize
          : options.optimize,
    },
    (objValue: unknown, srcValue: unknown) => {
      if (Array.isArray(objValue) || Array.isArray(srcValue)) {
        return srcValue;
      }
    },
  );
