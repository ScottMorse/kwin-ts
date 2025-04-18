import {
  Compiler,
  Compilation,
  sources,
  Assets,
  RspackPluginInstance,
} from "@rspack/core";
import fs from "fs";
import path from "path";
import { rspackLogger } from "../../logger";
import { transformSourceCodeWithBabel } from "../../../../compiler/babel";

const wrapScriptSrc = (src: string, name: string) => `

/******* START ${name}.js - Injected by kwin-ts *******/
${src}
/********* END ${name}.js - Injected by kwin-ts *******/

`;

export interface InjectScriptsPluginOptions {
  optimize?: boolean;
}

export class InjectScriptsPlugin implements RspackPluginInstance {
  constructor(
    private options: InjectScriptsPluginOptions,
    private logger = rspackLogger,
  ) {
    this.logger = logger.createChild({
      ...logger.options,
      name: "InjectScriptsPlugin",
    });
  }

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap("Replace", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "GlobalThisPlugin",
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets: Assets) => {
          for (const [name, asset] of Object.entries(assets)) {
            this.logger.debug(
              `Injecting raw kwin-ts scripts into asset: ${name}`,
            );

            let newSourceCode = this.getScriptSrc("beforeAll") + asset.source();

            this.logger.debug(
              `Applying additional babel transform to script: ${name} (full optimization: ${!!this
                .options.optimize})`,
            );
            newSourceCode = transformSourceCodeWithBabel(
              newSourceCode,
              this.options.optimize,
            );

            compilation.updateAsset(name, new sources.RawSource(newSourceCode));
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
      return src;
    }
  }
}
