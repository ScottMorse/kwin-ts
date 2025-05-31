import fs from "fs";
import path from "path";
import { globSync } from "glob";

export interface FindStaticKPackageFilesOptions {
  inputDirectory: string;
  includeGlobs?: string[];
  excludeGlobs?: string[];
}

export const DEFAULT_INCLUDE_GLOBS = [
  "metadata.{json,desktop}",
  "contents/config/**/*.{xml,kcfg,json}",
  "contents/ui/**/*.{ui,qml,js,json}",
  "contents/images/**/*.{png,jpg,jpeg,gif,svg,webp,avif,bmp,ico}",
  "contents/translations/**/*.{po,mo,qm}",
];

export const findStaticKPackageFiles = ({
  inputDirectory,
  includeGlobs = [],
  excludeGlobs = [],
}: FindStaticKPackageFilesOptions) =>
  Array.from(
    new Set(
      [...DEFAULT_INCLUDE_GLOBS, ...includeGlobs].flatMap((file) =>
        globSync(file, {
          cwd: inputDirectory,
          ignore: excludeGlobs,
        }),
      ),
    ),
  );

export const copyKPackageFiles = (
  inputDirectory: string,
  outputDirectory: string,
) => {
  const outputFiles = findStaticKPackageFiles({ inputDirectory }).map(
    (file) => ({
      input: path.join(inputDirectory, file),
      output: path.join(outputDirectory, file),
    }),
  );
  for (const { input, output } of outputFiles) {
    const outputDir = path.dirname(output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.copyFileSync(input, output);
  }

  return outputFiles;
};
