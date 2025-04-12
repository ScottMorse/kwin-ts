import path from "path";
import fs from "fs";
import { FindInputFilesResult } from "../inputFile/findInputFiles";
import {
  rspack,
  optimize,
  RspackPluginInstance,
  EnvironmentPlugin,
  DefinePlugin,
  SwcLoaderOptions,
} from "@rspack/core";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import { CompilerOptions } from "../options/compilerOptions";
import { InjectScriptsPlugin } from "./plugins/injectScripts/InjectScriptsPlugin";
import { CompilationResult } from "../result/compilationResult";
import { createRemotePromise } from "@kwin-ts/core/internal/async/promise";
import { rspackLogger } from "./logger";
import { KWIN_TS_RUNTIME_PATH } from "@kwin-ts/core/runtime";

const resolveNodePolyfillPlugins = (
  option: CompilerOptions["nodePolyfills"],
) => {
  if (Array.isArray(option)) {
    if (!option.length) return [];
    return [
      new NodePolyfillPlugin({
        onlyAliases: option,
      }) as any,
    ];
  }
  return option
    ? [
        new NodePolyfillPlugin({
          excludeAliases: ["console"],
        }) as unknown as RspackPluginInstance, // node-polyfill-webpack-plugin is compatible with rspack as of version 3
      ]
    : [];
};

export const compileWithRspack = async (
  options: CompilerOptions,
  inputFiles: FindInputFilesResult,
): Promise<CompilationResult> => {
  const logger = rspackLogger.clone();
  logger.options.verbosity = options.verbosity ?? logger.options.verbosity;

  logger.debug("Compiling via rspack");

  const remotePromise = createRemotePromise<CompilationResult>();

  const entry = inputFiles.entry.reduce(
    (entry, file) => {
      const entryName = file.relativePath.replace(/\..+$/, "");
      entry[entryName] = [KWIN_TS_RUNTIME_PATH, file.absolutePath];
      logger.debug(`Added entry "${entryName}": ${file.relativePath}`);
      return entry;
    },
    {} as Record<string, string[]>,
  );

  const defaultOutputPath = path.resolve(
    options.outputDirectory ?? "./kwin-ts-output",
  );
  logger.debug("Output path:", defaultOutputPath);

  const plugins: RspackPluginInstance[] = [
    new EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV,
    }),
    new DefinePlugin(
      Object.entries({
        __KWIN_TS_RUNTIME_RAW_FORMATTING: options.rawLogFormatting,
        ...options.environmentVariables,
      }).reduce(
        (acc, [key, value]) => ({
          ...acc,
          ["process.env." + key]: JSON.stringify(value),
        }),
        {},
      ),
    ),
    new optimize.LimitChunkCountPlugin({
      maxChunks: Object.keys(entry).length,
    }),
    new InjectScriptsPlugin(options),
    ...resolveNodePolyfillPlugins(options.nodePolyfills),
  ];

  plugins.forEach((plugin) =>
    logger.debug(
      `Using plugin: "${plugin?.constructor?.name ?? "(unknown plugin name)"}"`,
    ),
  );

  const mode = options.optimize ? "production" : "development";
  logger.info("Using mode: " + mode);

  const swcLoaderOptions: SwcLoaderOptions = {};

  const compiler = rspack({
    entry,
    mode,
    plugins,
    output: {
      filename: "[name].js",
      path: defaultOutputPath,
      clean: true,
    },
    resolve: {
      extensions: [".js", ".ts"],
    },
    node: {
      global: false,
      __dirname: false,
    },
    module: {
      rules: [
        {
          test: /\.(t|js)sx?$/,
          use: {
            loader: "builtin:swc-loader",
            options: swcLoaderOptions,
          },
          exclude: /node_modules/,
        },
      ],
    },
  });

  logger.debug("Running compiler");
  compiler.run((err, stats) => {
    logger.debug("Compiler finished");
    logger.debug(`rspack Stats:\n${stats}`);

    const outputs = Object.entries(stats?.toJson().namedChunkGroups ?? {}).map(
      ([name]) => ({
        outputPath: path.resolve(defaultOutputPath, name + ".js"),
        input: inputFiles.all.find((file) =>
          file.relativePath.match(new RegExp(name + ".[tj]s$")),
        ) ?? {
          absolutePath: "(error)",
          ext: "(error)",
          inputPatternMatch: "(error)",
          name: "(error)",
          nameWithExt: "(error)",
          relativePath: "(error)",
          type: "entry",
        },
      }),
    );

    if (err) {
      logger.error(err);
      remotePromise.resolve({
        outputs,
        success: false,
      });
      return;
    }

    // const info = stats?.compilation.chunks
    remotePromise.resolve({
      /** @todo */
      outputs,
      success: true,
    });
  });

  const result = await remotePromise;

  logger.info("Completed");

  return result;
};
