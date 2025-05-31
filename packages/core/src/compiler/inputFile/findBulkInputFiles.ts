import path from "path";
import { globSync } from "glob";
import type { InputFile, InputFileType } from "./inputFile";
import { extractFileNameType } from "./inputFile";

export type FindInputFilesResult = {
  [key in InputFileType | "all"]: InputFile[];
};

export const findBulkInputFiles = (
  inputDirectory: string,
  ...patterns: string[]
): FindInputFilesResult => {
  const result: FindInputFilesResult = {
    all: [],
    entry: [],
    module: [],
  };

  for (const pattern of patterns) {
    const files = globSync(pattern.replace(/(\(\/|^)\*$/, "*.{ts,js}"), {
      cwd: inputDirectory,
    });

    files.forEach((file) => {
      const type = extractFileNameType(file);
      const nameWithExt = path.basename(file);
      const name = nameWithExt.replace(/(.)\..+$/, "$1");
      const ext = nameWithExt.replace(/.+(\..+)$/, "$1");

      if (ext !== ".ts" && ext !== ".js") return;

      const absolutePath = path.resolve(inputDirectory, file);

      const inputFile: InputFile = {
        type,
        name,
        nameWithExt,
        ext,
        relativePath: path.relative(inputDirectory, absolutePath),
        absolutePath,
        inputPatternMatch: pattern,
      };

      result.all.push(inputFile);
      result[type].push(inputFile);
    });
  }

  return result;
};
