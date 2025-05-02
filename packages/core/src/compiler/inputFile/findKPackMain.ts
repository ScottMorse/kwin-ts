import fs from "fs";
import path from "path";
import type { InputFile} from "./inputFile";
import { extractFileNameType } from "./inputFile";

export type FindKPackMainResult = {
  mainFile: InputFile | null;
  attemptPath: string;
};

export const getKPackMainPath = (baseDirectory: string) =>
  path.resolve(baseDirectory, "contents", "code", `main.ts`);

export const findKPackMain = (baseDirectory: string): FindKPackMainResult => {
  const filePath = getKPackMainPath(baseDirectory);
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

  const absolutePath = path.resolve(baseDirectory, filePath);

  const inputFile: InputFile = {
    type,
    name,
    nameWithExt,
    ext,
    relativePath: path.relative(baseDirectory, absolutePath),
    absolutePath,
  };

  return {
    mainFile: inputFile,
    attemptPath: filePath,
  };
};
