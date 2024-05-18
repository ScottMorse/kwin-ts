import path from 'path';
import { compile } from '@kwin-ts/core';

compile({
  inputs: [path.join(__dirname, 'scripts/**/*')],
  disableOptimization: true,
});
