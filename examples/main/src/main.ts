import path from "path";
import { compile } from "@kwin-ts/core";

const output = process.env.NX_EXAMPLE_MAIN_OUTPUT;

const main = async () => {
  await compile({
    inputs: ["**/*"],
    inputBaseDirectory: path.join(__dirname, "scripts"),
    optimize: "auto",
    outputDirectory: output ? path.resolve(output) : undefined,
    environmentVariables: {
      KWIN_TS_TEST_EXAMPLE_MAIN: "yay test environment var from main.ts",
    },
    verbosity: "debug",
  });
};

main();
