import path from "path";
import type { RspackPluginInstance, SwcLoaderOptions } from "@rspack/core";
import {
  rspack,
  optimize,
  EnvironmentPlugin,
  DefinePlugin,
  ProvidePlugin,
} from "@rspack/core";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import type { KWinTsConfig } from "../../config";
import { createRemotePromise } from "../../internal/async/promise";
import { KWIN_TS_RUNTIME_PATH } from "../../runtime";
import type { InputFile } from "../inputFile";
import type { CompilationResult } from "../result/compilationResult";
import { rspackLogger } from "./logger";
import { KWinTsPlugin } from "./plugins/main/kwinTsPlugin";

const resolveNodePolyfillPlugins = (option: KWinTsConfig["nodePolyfills"]) => {
  if (Array.isArray(option)) {
    if (!option.length) return [];
    return [
      new NodePolyfillPlugin({
        onlyAliases: option,
      }) as never,
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
  config: KWinTsConfig,
  entryFiles: InputFile[],
): Promise<CompilationResult> => {
  const logger = rspackLogger.clone();
  logger.options.verbosity = config.verbosity ?? logger.options.verbosity;

  logger.debug("Compiling via rspack");

  const remotePromise = createRemotePromise<CompilationResult>();

  const entry = entryFiles.reduce(
    (entry, file) => {
      const entryName = file.relativePath.replace(/\..+$/, "");
      entry[entryName] = [KWIN_TS_RUNTIME_PATH, file.absolutePath];
      logger.debug(`Added entry "${entryName}": ${file.relativePath}`);
      return entry;
    },
    {} as Record<string, string[]>,
  );

  const defaultOutputPath = path.resolve(
    config.outputDirectory ?? "./kwin-ts-output",
  );
  logger.debug("Output path:", defaultOutputPath);

  const plugins: RspackPluginInstance[] = [
    new EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV ?? "production",
    }),
    new ProvidePlugin({
      process: "process",
    }),
    new DefinePlugin(
      Object.entries({
        __KWIN_TS_RUNTIME_RAW_FORMATTING: config.rawLogFormatting,
        ...config.environmentVariables,
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
    new KWinTsPlugin(config),
    ...resolveNodePolyfillPlugins(config.nodePolyfills),
  ];

  plugins.forEach((plugin) =>
    logger.debug(
      `Using plugin: "${plugin?.constructor?.name ?? "(unknown plugin name)"}"`,
    ),
  );

  /**
   * @todo development mode just will not compile valid code (
   * for loops may use never-defined vars), very difficult to debug
   *
   * Thanks to the babel transformations, this may not be important to fix,
   * since an "optimize: false" option generates easier-to-debug output already.
   *
   */
  // const mode = options.optimize ? "production" : "development";
  const mode = "production";
  logger.info("Using mode: " + mode);

  const swcLoaderOptions: SwcLoaderOptions = {};

  const compiler = rspack({
    entry,
    mode,
    plugins,
    output: {
      filename: "[name].js",
      path: defaultOutputPath,
    },
    optimization: {
      minimize: config.optimize,
      mangleExports: config.optimize,
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
        input: entryFiles.find((file) =>
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

    if (stats?.hasWarnings()) {
      stats?.compilation.warnings.forEach((warning) => logger.warn(warning));
    }

    if (err || stats?.hasErrors()) {
      if (err) logger.error(err);
      stats?.compilation.errors.forEach((error) => logger.error(error));
      remotePromise.resolve({
        outputs,
        success: false,
        error: err ?? new Error("Rspack compilation completed with errors"),
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
