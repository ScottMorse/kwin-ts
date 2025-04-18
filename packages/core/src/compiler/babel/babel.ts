import { transformSync } from "@babel/core";

export const transformSourceCodeWithBabel = (
  sourceCode: string,
  optimize?: boolean,
) => {
  const plugins = [require.resolve("./plugins/silence-qml-warnings")];

  if (optimize) {
    plugins.push(
      "minify-mangle-names",
      "minify-simplify",
      "minify-type-constructors",
      "minify-constant-folding",
      "minify-dead-code-elimination",
    );
  }

  const result = transformSync(sourceCode, {
    plugins,
    minified: !!optimize,
    comments: !optimize,
    compact: !!optimize,
  });

  if (!result?.code) {
    throw new Error("No code output from babel transformSync");
  }

  return result.code;
};
