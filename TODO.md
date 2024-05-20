## Eslint

- Recommended config
- Apply config to internal projects
- Disallow unusable globals (window, setTimeout, etc.) with eslint/no-restricted-globals
- Disallow async

## Packages

- kwin-ts: aggregated package (kwin-ts/core, kwin-ts/eslint, kwin-ts/cli)
- @kwin-ts/core: Core compiler package
- @kwin-ts/eslint: Rules/recommended plugin
- @kwin-ts/cli: CLI
  - feature note: ability to make kwin-ts.config.{js,ts,json}
- @kwin-ts/types: Types used in KWin scripts (should export types and provide global declarations)
- @kwin-ts/scripting: Utilities to be used within KWin scripts

## Research

- Find out how KWin compiles JS to see compatible target for rspack/tsconfig
