export interface KWinTsRuntime {
  rawPrint: (...messages: unknown[]) => void;
  rawConsole: Console;
}
