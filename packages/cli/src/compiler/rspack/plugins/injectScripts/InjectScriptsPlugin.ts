import {
  Compiler,
  Compilation,
  sources,
  Assets,
  RspackPluginInstance,
} from "@rspack/core";
import { transformSync } from "@babel/core";
import fs from "fs";
import path from "path";

const wrapScriptSrc = (src: string, name: string) => `
/********* Injected by kwin-ts - ${name}.js) *********/
${src}
/***** End injected kwin-ts script - ${name}.js ******/
`;

const optimizeScriptSrc = (src: string) => {
  const result = transformSync(src, {
    plugins: [
      "@babel/preset-env",
      {
        targets: { node: "current" },
      },
    ],
  });

  if (!result) {
    throw new Error("Failed to optimize script");
  }

  return result.code;
};

export interface InjectScriptsPluginOptions {
  optimize?: boolean;
}

export class InjectScriptsPlugin implements RspackPluginInstance {
  constructor(private options: InjectScriptsPluginOptions) {}

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap("Replace", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "GlobalThisPlugin",
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets: Assets) => {
          for (const [name, asset] of Object.entries(assets)) {
            compilation.updateAsset(
              name,
              new sources.RawSource(
                this.getScriptSrc("beforeAll") +
                  asset.source() +
                  this.getScriptSrc("afterAll"),
              ),
            );
          }
        },
      );
    });
  }

  private getScriptSrc(name: string) {
    const src = fs.readFileSync(
      path.join(__dirname, `./scripts/${name}.js`),
      "utf-8",
    );

    if (!this.options.optimize) {
      return wrapScriptSrc(src, name);
    } else {
      return optimizeScriptSrc(src);
    }
  }
}
