import type { KWinTsConfigOptions } from "../config";
import { finalizeConfig } from "../config";
import { runKwinTs } from "../internal/run";
import { defaultLogger } from "../logger";
import type { InputFile } from "./inputFile";
import { findBulkInputFiles, findKPackMain } from "./inputFile";
import { compileLogger } from "./logger";
import type { CompilationResult } from "./result/compilationResult";
import { compileWithRspack } from "./rspack/compileWithRspack";

export interface BulkInputOptions {
  inputs: string | string[] | readonly string[];
}

export const compile = async (
  options: KWinTsConfigOptions,
  bulkInputOptions?: BulkInputOptions,
): Promise<CompilationResult> => {
  const result = await runKwinTs(async () => {
    try {
      const logger = compileLogger.clone();
      logger.options.verbosity = options.verbosity ?? logger.options.verbosity;

      const config = finalizeConfig(options);

      for (const [key, value] of Object.entries(options)) {
        logger.debug(`Option: ${key} = ${JSON.stringify(value, null, 2)}`);
      }

      const inputFiles: InputFile[] = [];
      if (bulkInputOptions) {
        logger.debug("Finding bulk input files");
        const bulkResult = findBulkInputFiles(
          config.baseDirectory,
          ...bulkInputOptions.inputs,
        );

        if (!bulkResult.entry.length) {
          logger.error(
            `No entry scripts found for inputs ${JSON.stringify(
              bulkInputOptions.inputs,
            )} in input base directory ${config.baseDirectory}`,
          );
          return {
            outputs: [],
            success: false,
          };
        }

        inputFiles.push(...bulkResult.entry);
      } else {
        const { mainFile, attemptPath } = findKPackMain(config.baseDirectory);
        if (!mainFile) {
          logger.error(`Could not find ${attemptPath}`);
          return { outputs: [], success: false };
        }
        inputFiles.push(mainFile);
      }

      logger.debug(
        `Using input files:\n  ${inputFiles
          .map((file) => file.absolutePath)
          .sort()
          .join("\n  ")}`,
      );

      logger.info("Compiling");
      const result = await compileWithRspack(config, inputFiles);
      if (!result.success) {
        throw result.error;
      }
      logger.debug("Result", JSON.stringify(result, null, 2));
      logger.info("Compiled successfully");

      return result;
    } catch (error) {
      defaultLogger.error("Failed to compile", error);
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
    },
  );
};
