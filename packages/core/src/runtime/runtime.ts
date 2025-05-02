import fs from "fs";
import path from "path";
import { fatalExit } from "../internal/fatal";

export const KWIN_TS_RUNTIME_PATH = path.resolve(
  __dirname,
  "./kwin/main.runtime.ts",
);

if (
  !fs.existsSync(KWIN_TS_RUNTIME_PATH) ||
  !fs.statSync(KWIN_TS_RUNTIME_PATH).isFile()
) {
  fatalExit("Could not find runtime module at " + KWIN_TS_RUNTIME_PATH);
}
