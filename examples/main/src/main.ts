import path from 'path';
import { compile } from '@kwin-ts/core';

const output = process.env.NX_EXAMPLE_MAIN_OUTPUT;

compile({
  inputs: [path.join(__dirname, 'scripts/**/*')],
  disableOptimization: true,
  outputPath: output ? path.resolve(output) : undefined,
});
