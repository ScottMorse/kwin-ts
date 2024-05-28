import { globSync } from 'glob';
import path from 'path';
import { InputFileType, extractFileNameType } from './inputFile';

export interface InputFile {
  type: InputFileType;
  name: string;
  nameWithExt: string;
  ext: string;
  relativePath: string;
  absolutePath: string;
  inputPatternMatch: string;
}

export type FindInputFilesResult = {
  [key in InputFileType | 'all']: InputFile[];
};

export const findInputFiles = (
  baseDirectory: string,
  ...patterns: string[]
): FindInputFilesResult => {
  const result: FindInputFilesResult = {
    all: [],
    entry: [],
    module: [],
  };

  for (const pattern of patterns) {
    const files = globSync(pattern.replace(/(\(\/|^)\*$/, '*.{ts,js}'), {
      cwd: baseDirectory,
    });

    files.forEach((file) => {
      const type = extractFileNameType(file);
      const nameWithExt = path.basename(file);
      const name = nameWithExt.replace(/(.)\..+$/, '$1');
      const ext = nameWithExt.replace(/.+(\..+)$/, '$1');

      if (ext !== '.ts' && ext !== '.js') return;

      const absolutePath = path.resolve(baseDirectory, file);

      const inputFile: InputFile = {
        type,
        name,
        nameWithExt,
        ext,
        relativePath: path.relative(baseDirectory, absolutePath),
        absolutePath,
        inputPatternMatch: pattern,
      };

      result.all.push(inputFile);
      result[type].push(inputFile);
    });
  }

  return result;
};
