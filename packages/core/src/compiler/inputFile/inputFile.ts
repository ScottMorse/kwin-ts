import { freeze } from "../../internal/object/freeze";

export interface InputFile {
  type: InputFileType;
  name: string;
  nameWithExt: string;
  ext: string;
  relativePath: string;
  absolutePath: string;
  inputPatternMatch?: string;
}

const INPUT_FILE_TYPE_META = {
  entry: {
    fileSubExtension: "",
  },
  module: {
    fileSubExtension: "module",
  },
} as const;

export type InputFileType = keyof typeof INPUT_FILE_TYPE_META;

export const INPUT_FILE_TYPES = freeze(
  Object.keys(INPUT_FILE_TYPE_META) as InputFileType[],
);

const _matchFileNameType = (fileName: string, type: InputFileType): boolean => {
  const { fileSubExtension } = INPUT_FILE_TYPE_META[type];
  return fileSubExtension
    ? fileName.endsWith(`.${fileSubExtension}.ts`)
    : !(Object.keys(INPUT_FILE_TYPE_META) as InputFileType[]).some(
        (t) => t !== type && _matchFileNameType(fileName, t),
      );
};

export const matchFileNameType = (fileName: string, type: InputFileType) =>
  _matchFileNameType(fileName, type);

export const extractFileNameType = (fileName: string): InputFileType => {
  for (const type of Object.keys(INPUT_FILE_TYPE_META) as InputFileType[]) {
    if (type === "entry") continue;

    if (matchFileNameType(fileName, type)) {
      return type;
    }
  }

  return "entry";
};
