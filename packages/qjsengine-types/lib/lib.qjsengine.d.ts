/* eslint-disable no-var */
/// <reference no-default-lib="true"/>

/// <reference types="./lib.es-qtscript.d.ts" />

import type { QJSEngineConsole } from "../src";

declare type Console = QJSEngineConsole;

declare global {
  type Console = QJSEngineConsole;

  var console: QJSEngineConsole;
}
