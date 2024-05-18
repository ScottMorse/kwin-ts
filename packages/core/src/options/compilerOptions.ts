import { mergeWith } from 'lodash';
import { Alias } from 'node-polyfill-webpack-plugin';

export type NodePolyfillOption = Exclude<Alias, 'console'>;

export interface CompilerOptions {
  inputs: string[];
  outputPath?: string;
  disableOptimization?: boolean;
  /** Default true, polyfill any imports of node libraries */
  nodePolyfills?: boolean | NodePolyfillOption[];
}

export type FinalizedCompilerOptions = Required<CompilerOptions>;

const DEFAULT_COMPILER_OPTIONS: FinalizedCompilerOptions = {
  inputs: [],
  outputPath: './kwin-ts-output',
  disableOptimization: false,
  nodePolyfills: true,
};

export const finalizeCompilerOptions = (
  options: CompilerOptions
): FinalizedCompilerOptions =>
  mergeWith(
    {},
    DEFAULT_COMPILER_OPTIONS,
    options,
    (objValue: unknown, srcValue: unknown) => {
      if (Array.isArray(objValue) || Array.isArray(srcValue)) {
        return srcValue;
      }
    }
  );
