import path from 'path';
import { compile } from 'kwin-ts';

compile({
  inputs: [path.join(__dirname, 'scripts/**/*')],
  disableOptimization: true,
});
