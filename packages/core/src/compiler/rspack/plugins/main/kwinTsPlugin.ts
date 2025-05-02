import fs from "fs";
import path from "path";
import type {
  Compiler,
  Assets,
  RspackPluginInstance} from "@rspack/core";
import {
  Compilation,
  sources
} from "@rspack/core";
import { transformSourceCodeWithBabel } from "../../../babel";
import { rspackLogger } from "../../logger";

const wrapScriptSrc = (src: string, name: string) => `

/******* START ${name}.js - Injected by kwin-ts *******/
${src}
/********* END ${name}.js - Injected by kwin-ts *******/

`;

export interface InjectScriptsPluginOptions {
  optimize?: boolean;
}

export class KWinTsPlugin implements RspackPluginInstance {
  constructor(
    private options: InjectScriptsPluginOptions,
    private logger = rspackLogger,
  ) {
    this.logger = logger.createChild({
      ...logger.options,
      name: "KWinTsPlugin",
    });
  }

  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap("Replace", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "KWinTsPlugin - Inject Runtime",
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        (assets: Assets) => {
          for (const [name, asset] of Object.entries(assets)) {
            this.logger.debug(
              `Injecting raw kwin-ts runtime into asset: ${name}`,
            );

            compilation.updateAsset(
              name,
              new sources.RawSource(
                this.getScriptSrc("beforeAll") + asset.source(),
              ),
            );
          }
        },
      );

      compilation.hooks.processAssets.tap(
        {
          name: "KWinTsPlugin - Babel Transform",
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
        },
        (assets: Assets) => {
          for (const [name, asset] of Object.entries(assets)) {
            this.logger.debug(`Applying babel transform to asset: ${name}`, {
              optimize: this.options.optimize,
            });

            compilation.updateAsset(
              name,
              new sources.RawSource(
                transformSourceCodeWithBabel(
                  asset.source().toString(),
                  this.options.optimize,
                ),
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
      return src;
    }
  }
}
