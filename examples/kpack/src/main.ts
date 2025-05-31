import path from "path";
import { compile } from "@kwin-ts/core";

const main = async () => {
  await compile({
    inputDirectory: path.join(__dirname, "my-kpackage"),
    optimize: "auto",
    environmentVariables: {
      KWIN_TS_TEST_EXAMPLE_MAIN: "yay test environment var from main.ts",
    },
    verbosity: "debug",
  });
};

if (require.main === module) {
  main();
}
