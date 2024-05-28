import path from 'path';
import { getScriptFiles } from '../options/getScriptFiles';
import {
  Configuration,
  rspack,
  optimize,
  RspackPluginInstance,
  SwcLoaderOptions,
} from '@rspack/core';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import {
  CompilerOptions,
  finalizeCompilerOptions,
} from '../options/compilerOptions';
import { InjectScriptsPlugin } from './plugins/injectScripts/InjectScriptsPlugin';
import { CompilationResult } from '../result/compilationResult';
import { createRemotePromise } from '@kwin-ts/core/internal/async/promise';
import { compileLogger } from '../internal/logger';
import { rspackLogger } from './internal/logger';

const resolveNodePolyfillPlugins = (
  option: CompilerOptions['nodePolyfills']
) => {
  if (Array.isArray(option)) {
    if (!option.length) return [];
    return [
      new NodePolyfillPlugin({
        includeAliases: option,
      }) as any,
    ];
  }
  return option
    ? [
        new NodePolyfillPlugin({
          excludeAliases: ['console'],
        }) as unknown as RspackPluginInstance, // node-polyfill-webpack-plugin is compatible with rspack as of version 3
      ]
    : [];
};

export const compileWithRspack = async (
  _options: CompilerOptions
): Promise<CompilationResult> => {
  const logger = rspackLogger.clone();

  logger.options.verbosity = _options.verbosity ?? logger.options.verbosity;

  const options = finalizeCompilerOptions(_options);
  for (const [key, value] of Object.entries(options)) {
    logger.debug(
      `Option: ${key} = ${typeof value === 'string' ? `"${value}"` : value}`
    );
  }

  logger.debug('Compiling via rspack');

  const remotePromise = createRemotePromise<CompilationResult>();

  const files = getScriptFiles(...options.inputs);
  logger.info(
    `Found ${files.length} file${files.length === 1 ? '' : 's'} to compile.`
  );

  const entry = files.reduce((entry, file) => {
    if (!file.endsWith('.ts')) return entry;
    const name = file.replace(/.+\/|\.ts$/g, '');
    entry[name] = file;
    logger.debug(`Added entry "${name}": ${file}`);
    return entry;
  }, {} as Record<string, string>);

  const defaultOutputPath = path.resolve(
    options.outputPath ?? './kwin-ts-output'
  );
  logger.debug('Output path:', defaultOutputPath);

  const plugins: RspackPluginInstance[] = [
    new optimize.LimitChunkCountPlugin({
      maxChunks: Object.keys(entry).length,
    }),
    new InjectScriptsPlugin({
      optimize: !options.disableOptimization,
    }),
    ...resolveNodePolyfillPlugins(options.nodePolyfills),
  ];

  plugins.forEach((plugin) =>
    logger.debug(
      `Using plugin: "${plugin?.constructor?.name ?? '(unknown plugin name)'}"`
    )
  );

  const mode = options.disableOptimization
    ? 'development'
    : process.env.NODE_ENV === 'development'
    ? 'development'
    : 'production';

  logger.info('Using mode: ' + mode);

  const swcLoaderOptions: SwcLoaderOptions = {};

  const compiler = rspack({
    entry,
    target: 'node',
    output: {
      filename: '[name].js',
      path: defaultOutputPath,
      clean: true,
    },
    mode,
    node: {
      global: false,
      __dirname: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'builtin:swc-loader',
            options: swcLoaderOptions,
          },
          exclude: /node_modules/,
        },
      ],
    },
    plugins,
  });

  logger.debug('Running compiler');
  compiler.run((err, stats) => {
    logger.debug('Compiler finished');
    logger.debug(`Stats:\n${stats?.toString()}`);

    if (err) {
      logger.error(err);
      remotePromise.resolve({
        outputs: [],
        success: false,
      });
      return;
    }

    // const info = stats?.compilation.chunks
    remotePromise.resolve({
      /** @todo */
      outputs: [],
      success: true,
    });
  });

  return await remotePromise;
};
