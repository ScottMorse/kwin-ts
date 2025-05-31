/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Note that the console does not have normal
 * Object behavior in QJSEngine. It doesn't
 * have the usual set of methods available,
 * and it behaves unexpected when introspected
 * in ways such `Object.keys(console)`,
 * and using the `instanceof` may throw a
 * TypeError with no message.
 */
export interface QJSEngineConsole {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/assert_static) */
  assert(condition?: boolean, ...data: any[]): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/clear_static) */
  count(label?: string): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/countReset_static) */
  debug(...data: any[]): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/dir_static) */
  error(...data: any[]): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/group_static) */
  info(...data: any[]): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/log_static) */
  log(...data: any[]): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/table_static) */
  time(label?: string): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/timeEnd_static) */
  timeEnd(label?: string): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/timeLog_static) */
  trace(...data: any[]): void;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/console/warn_static) */
  warn(...data: any[]): void;
}
