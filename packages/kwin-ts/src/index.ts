import {
  CompilerOptions,
  finalizeCompilerOptions,
} from './core/compilerOptions';
import { compileWithRspack } from './rspack/compileWithRspack';

export const compile = (options: CompilerOptions) =>
  compileWithRspack(finalizeCompilerOptions(options));
