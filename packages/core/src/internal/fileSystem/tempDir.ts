import fs from "fs";
import os from "os";
import path from "path";

export const createTempDir = () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "kwin-ts-"));
  process.on("exit", () => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
  return tempDir;
};
