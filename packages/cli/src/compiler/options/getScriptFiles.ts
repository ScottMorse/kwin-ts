import { globSync } from "glob";

export const getScriptFiles = (...patterns: string[]) => {
  // ensure TS paths only
  return globSync(
    patterns.map((pattern) => pattern.replace(/(\*\..+)?$/, "*.ts")),
  );
};
