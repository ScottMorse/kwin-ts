import { VerbosityLevel } from "@kwin-ts/core/logger";
import { mergeWith } from "lodash";
import { Alias } from "node-polyfill-webpack-plugin";

export type NodePolyfillOption = Exclude<Alias, "console">;

export interface CreateCompilerOptions {
  inputs: string[];
  outputPath?: string;
  /** If "auto", will determine based on NODE_ENV, disabling for NODE_ENV="development" */
  disableOptimization?: boolean | "auto";
  /** Default true, polyfill any imports of node libraries */
  nodePolyfills?: boolean | NodePolyfillOption[];
  verbosity?: VerbosityLevel;
}

export type CompilerOptions = Omit<
  Required<CreateCompilerOptions>,
  "disableOptimization"
> & { disableOptimization: boolean };

const DEFAULT_COMPILER_OPTIONS: CompilerOptions = {
  inputs: [],
  outputPath: "./kwin-ts-output",
  disableOptimization: false,
  nodePolyfills: true,
  verbosity: "default",
};

export const finalizeCompilerOptions = (
  options: CreateCompilerOptions,
): CompilerOptions =>
  mergeWith(
    {},
    DEFAULT_COMPILER_OPTIONS,
    {
      ...options,
      disableOptimization:
        options.disableOptimization === "auto" //
          ? process.env.NODE_ENV === "development"
          : (options.disableOptimization ??
            DEFAULT_COMPILER_OPTIONS.disableOptimization),
    },
    (objValue: unknown, srcValue: unknown) => {
      if (Array.isArray(objValue) || Array.isArray(srcValue)) {
        return srcValue;
      }
    },
  );
