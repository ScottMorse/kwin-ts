## Eslint plugin

- Recommended config
- Apply config to internal projects
- Disallow unusable globals (window, setTimeout, etc.) with eslint/no-restricted-globals
- Disallow async?

## Packages

- kwin-ts: aggregated package (kwin-ts/core, kwin-ts/eslint, kwin-ts/cli)
- @kwin-ts/core: Core compiler package
  - Needs ability to compile qml scripts (ui/\*\*/\.js)
- @kwin-ts/eslint: Rules/recommended plugin
- @kwin-ts/cli: CLI
- @kwin-ts/kwin-script-types: Types used in KWin scripts (should export types and provide global declarations)
- @kwin-ts/qjsengine-types: Base types for QJSEngine
  - Double check implementation with: https://doc.qt.io/qt-5/qtqml-javascript-functionlist.html
- @kwin-ts/qmlscript-types: Types for QML scripts (found in contents/ui/\*\*/\*.js to be called in qml files)
  - Need to create
  - Needs to define `Qt` global and any other QML-related globals
  - Possibly move/change the `qml/` types in `kwin-script-types`
- @kwin-ts/scripting: Utilities to be used within KWin scripts
  - Need to create (idea only)

Other features:

- Ability to initialize new project (with CLI or `bun create` etc?)
