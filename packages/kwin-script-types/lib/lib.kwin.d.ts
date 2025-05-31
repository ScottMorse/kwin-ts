/// <reference no-default-lib="true"/>

/// <reference types="@kwin-ts/qjsengine-types" />

import type {
  Workspace,
  Options,
  KWinGlobalMethods,
  KWinTsRuntimeUtility as _KWinTsRuntimeUtility,
  Desktop,
  Output,
  TileManager,
  KWindow,
  ClientAreaOption,
  QPoint,
  QRect,
  QSize,
  KWinNamespace,
} from "../src";

declare global {
  var workspace: Workspace;
  var options: Options;

  var print: KWinGlobalMethods["print"];
  var registerShortcut: KWinGlobalMethods["registerShortcut"];
  var readConfig: KWinGlobalMethods["readConfig"];
  var callDBus: KWinGlobalMethods["callDBus"];

  var KWinTS: KWinTsRuntimeUtility;

  var KWin: KWinNamespace;
}
