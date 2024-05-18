import path from 'path';
import { Configuration, optimize } from '@rspack/core';
import { composePlugins, withNx } from '@nx/rspack';

export default composePlugins((config: Configuration) => {
  config.devServer = {
    devMiddleware: {
      writeToDisk: true,
    },
    liveReload: false,
    hot: false,
    webSocketServer: false,
    watchFiles: ['**/*.ts'],
  };

  config.mode = 'production';

  config.output = {
    path: path.join(__dirname, './output'),
    clean: true,
  };

  config.plugins?.push(
    new optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),

  );

  return config;
}, withNx());
