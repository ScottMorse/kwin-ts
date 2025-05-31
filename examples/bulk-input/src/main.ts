import path from "path";
import { compile } from "@kwin-ts/core";

const main = async () => {
  await compile(
    {
      inputDirectory: path.join(__dirname, "scripts"),
      optimize: "auto",
      environmentVariables: {
        KWIN_TS_TEST_EXAMPLE_MAIN: "yay test environment var from main.ts",
      },
      verbosity: "debug",
    },
    {
      inputs: ["**/*"],
    },
  );
};

if (require.main === module) {
  main();
}
