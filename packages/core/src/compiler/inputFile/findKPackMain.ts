import fs from "fs";
import path from "path";
import type { InputFile } from "./inputFile";
import { extractFileNameType } from "./inputFile";

export type FindKPackMainResult = {
  mainFile: InputFile | null;
  attemptPath: string;
};

export const getKPackMainPath = (inputDirectory: string) =>
  path.resolve(inputDirectory, "contents", "code", `main.ts`);

export const findKPackMain = (inputDirectory: string): FindKPackMainResult => {
  const filePath = getKPackMainPath(inputDirectory);
  if (!fs.existsSync(filePath)) {
    return {
      mainFile: null,
      attemptPath: filePath,
    };
  }

  const type = extractFileNameType(filePath);
  const nameWithExt = path.basename(filePath);
  const name = nameWithExt.replace(/(.)\..+$/, "$1");
  const ext = nameWithExt.replace(/.+(\..+)$/, "$1");

  if (ext !== ".ts" && ext !== ".js") {
    return {
      mainFile: null,
      attemptPath: filePath,
    };
  }

  const absolutePath = path.resolve(inputDirectory, filePath);

  const inputFile: InputFile = {
    type,
    name,
    nameWithExt,
    ext,
    relativePath: path.relative(inputDirectory, absolutePath),
    absolutePath,
  };

  return {
    mainFile: inputFile,
    attemptPath: filePath,
  };
};
