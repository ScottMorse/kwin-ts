/* eslint-disable */

/**
 * This script is injected before all other scripts in the compilation process
 * by kwin-ts.
 *
 * There is no globalThis present in QtScript, so this is a simple polyfill.
 * The only global object that seems to be available in QtScript is `this`
 * at the main scope. Injecting this raw JS script before the bundled script
 * is the simplest means of capturing the main scope `this`.
 */
const globalThis = this;
globalThis.globalThis = globalThis;
