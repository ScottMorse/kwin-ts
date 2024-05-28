import path from 'path';
import { Configuration } from '@rspack/core';
import { composePlugins, withNx } from '@nx/rspack';

//
module.exports = composePlugins(withNx(), (config: Configuration) => {
  config.output = {
    ...config.output,
    path: path.join(__dirname, './dist'),
    clean: true,
  };
  config.devServer = {
    devMiddleware: {
      writeToDisk: true,
    },
    hot: false,
    liveReload: false,
  };
  return config;
});
