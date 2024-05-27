import { defaultLogger } from '../logger';
import { compileLogger } from './logger';
import {
  CreateCompilerOptions,
  finalizeCompilerOptions,
} from './options/compilerOptions';
import { CompilationResult } from './result/compilationResult';
import { compileWithRspack } from './rspack/compileWithRspack';

export const compile = async (
  options: CreateCompilerOptions
): Promise<CompilationResult> => {
  try {
    const logger = compileLogger.clone();
    logger.options.verbosity = options.verbosity ?? logger.options.verbosity;

    logger.info('Compiling');
    const result = await compileWithRspack(finalizeCompilerOptions(options));
    logger.debug('Result', result);
    if (!result.success) {
      throw result;
    }
    logger.info('Compiled successfully');

    return result;
  } catch (error) {
    defaultLogger.error('Failed to compile', error);
    return {
      outputs: [],
      success: false,
    };
  }
};
