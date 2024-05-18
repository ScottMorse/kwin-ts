import path from 'path';
import { getScriptFiles } from 'packages/core/src/options/getScriptFiles';
import {
  Configuration,
  rspack,
  optimize,
  RspackPluginInstance,
} from '@rspack/core';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
import {
  FinalizedCompilerOptions,
  finalizeCompilerOptions,
} from '../options/compilerOptions';

const resolveNodePolyfillPlugins = (
  option: FinalizedCompilerOptions['nodePolyfills']
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

export const compileWithRspack = (_options: FinalizedCompilerOptions) => {
  const options = finalizeCompilerOptions(_options);

  console.log({ options });

  const files = getScriptFiles(...options.inputs);

  const entry = files.reduce((entry, file) => {
    if (!file.endsWith('.ts')) return entry;
    entry[file.replace(/.+\/|\.ts$/g, '')] = file;
    return entry;
  }, {} as Record<string, string>);

  const defaultOutputPath = path.resolve(
    options.outputPath || './kwin-ts-output'
  );

  const plugins: Configuration['plugins'] = [
    new optimize.LimitChunkCountPlugin({
      maxChunks: Object.keys(entry).length,
    }),
  ];

  plugins.push(...resolveNodePolyfillPlugins(options.nodePolyfills));

  const compiler = rspack({
    entry,
    target: 'node',
    output: {
      filename: '[name].js',
      path: defaultOutputPath,
      clean: true,
    },
    mode: options.disableOptimization
      ? 'development'
      : process.env.NODE_ENV === 'production'
      ? 'production'
      : 'development',
    node: {
      global: false,
      __dirname: false,
    },
    plugins,
  });

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(stats?.toString({ colors: true }));
  });
};
