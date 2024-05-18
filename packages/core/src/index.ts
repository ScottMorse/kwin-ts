import {
  CompilerOptions,
  finalizeCompilerOptions,
} from './options/compilerOptions';
import { compileWithRspack } from './rspack/compileWithRspack';

export const compile = (options: CompilerOptions) =>
  compileWithRspack(finalizeCompilerOptions(options));
