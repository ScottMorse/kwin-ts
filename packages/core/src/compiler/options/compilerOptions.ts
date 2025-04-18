import { deepFreeze } from "../../internal/object/freeze";
import { Override } from "../../internal/types";
import { VerbosityLevel } from "../../logger";
import { mergeWith } from "lodash";
import { Alias } from "node-polyfill-webpack-plugin";

export type NodePolyfillOption = Exclude<Alias, "console">;

/**
 * Variables that can be accessed via `process.env` in
 * the input KWin scripts.
 */
export interface EnvironmentVariables {
  [key: string]: unknown;
}

export interface CreateCompilerOptions {
  /**
   *
   */
  inputs: string | string[] | readonly string[];
  /** Defaults to the current working directory */
  inputBaseDirectory?: string;
  /**
   * The directory where output scripts will be written.
   * The default can be set via `process.env.KWIN_TS_DEFAULT_OUTPUT_PATH`
   */
  outputDirectory?: string;
  /** If "auto", will determine based on NODE_ENV, disabling for NODE_ENV="development" */
  optimize?: boolean | "auto";
  /** Default true, polyfill any imports of node libraries */
  nodePolyfills?:
    | boolean
    | NodePolyfillOption[]
    | readonly NodePolyfillOption[];
  /** The logging level for the compilation */
  verbosity?: VerbosityLevel;
  /**
   * By default, this is false, meaning logs written
   * via `console` or `print` are formatted via
   * Node's formatter.
   *
   * Enable raw formatting to get the original KWin
   * script's output.
   */
  rawLogFormatting?: boolean;
  /**
   * Variables that can be accessed via `process.env` in
   * the input KWin scripts.
   */
  environmentVariables?: EnvironmentVariables;
}

export type CompilerOptions = Override<
  Required<CreateCompilerOptions>,
  {
    optimize: boolean;
  }
>;

export const DEFAULT_COMPILER_OPTIONS: CompilerOptions = deepFreeze({
  inputs: [],
  outputDirectory:
    process.env.KWIN_TS_DEFAULT_OUTPUT_PATH ?? "./kwin-ts-output",
  inputBaseDirectory: process.env.KWIN_TS_INPUT_BASE_DIRECTORY ?? process.cwd(),
  optimize: process.env.NODE_ENV !== "development",
  nodePolyfills: true,
  verbosity:
    (process.env.KWIN_TS_COMPILER_VERBOSITY_LEVEL as VerbosityLevel) ??
    "default",
  rawLogFormatting:
    process.env.KWIN_TS_RAW_LOG_FORMATTING?.toString() === "true" || false,
  environmentVariables: JSON.parse(
    process.env.KWIN_TS_RUNTIME_ENVIRONMENT_VARIABLES ?? "{}",
  ),
});

export const finalizeCompilerOptions = (
  options: CreateCompilerOptions,
): CompilerOptions =>
  mergeWith(
    {},
    DEFAULT_COMPILER_OPTIONS,
    {
      ...options,
      optimize:
        options.optimize === "auto"
          ? DEFAULT_COMPILER_OPTIONS.optimize
          : options.optimize,
    },
    (objValue: unknown, srcValue: unknown) => {
      if (Array.isArray(objValue) || Array.isArray(srcValue)) {
        return srcValue;
      }
    },
  );
