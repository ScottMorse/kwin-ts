/* eslint-disable no-var */

/// <reference no-default-lib="true"/>

/// <reference types="./lib.es-qtscript.d.ts" />

import {
  Workspace,
  Options,
  KWinGlobalMethods,
  QtScriptConsole,
  KWinTsRuntime,
} from "../src";

declare type Console = QtScriptConsole;

declare global {
  type Console = QtScriptConsole;

  var console: QtScriptConsole;

  var workspace: Workspace;
  var options: Options;

  var print: KWinGlobalMethods["print"];
  var registerShortcut: KWinGlobalMethods["registerShortcut"];
  var readConfig: KWinGlobalMethods["readConfig"];
  var callDBus: KWinGlobalMethods["callDBus"];

  var kwinTs: KWinTsRuntime;
}
