import { runKwinTs } from '../internal/run';
import { defaultLogger } from '../logger';
import { findInputFiles } from './inputFile';
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
  const result = await runKwinTs(async () => {
    try {
      const logger = compileLogger.clone();
      logger.options.verbosity = options.verbosity ?? logger.options.verbosity;

      const finalOptions = finalizeCompilerOptions(options);

      for (const [key, value] of Object.entries(options)) {
        logger.debug(`Option: ${key} = ${JSON.stringify(value, null, 2)}`);
      }

      logger.debug('Finding input files');
      const inputFiles = findInputFiles(
        finalOptions.inputBaseDirectory,
        ...finalOptions.inputs
      );

      if (!inputFiles.entry.length) {
        logger.error(
          `No entry scripts found for inputs ${JSON.stringify(
            finalOptions.inputs
          )} in input base directory ${finalOptions.inputBaseDirectory}`
        );
        return {
          outputs: [],
          success: false,
        };
      }

      logger.info(
        `Found input files (${Object.keys(inputFiles)
          .sort()
          .map(
            (key) =>
              `${key}: ${inputFiles[
                key as keyof typeof inputFiles
              ].length.toLocaleString()}`
          )
          .join(', ')}):`
      );

      logger.info('Compiling');
      const result = await compileWithRspack(
        finalizeCompilerOptions(options),
        inputFiles
      );
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
  }, !process.env.__KWIN_TS_IS_CLI);

  return Promise.resolve(
    result ?? {
      outputs: [],
      success: false,
    }
  );
};
