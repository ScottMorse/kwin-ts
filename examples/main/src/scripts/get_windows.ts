/* eslint-disable */
// for (const window of workspace.windowList()) {
//   if (window.caption) print(window.caption);
// }

const log = (key: keyof typeof globalThis) =>
  console.log(globalThis[key] === undefined ? '❌' : '', key, globalThis[key]);

log('Array');
log('ArrayBuffer');
log('AsyncDisposableStack'); // esnext
log('Atomics'); // esnext
log('BigInt'); // esnext
log('BigInt64Array'); // esnext
log('BigUint64Array'); // esnext
log('BigUint64Array'); // esnext
log('Boolean');
log('DataView');
log('Date');
log('DisposableStack'); // esnext
log('Error');
log('EvalError');
log('FinalizationRegistry'); // esnext
log('Float32Array');
log('Float64Array');
log('Function');
log('Int8Array');
log('Int32Array');
log('Int16Array');
log('Infinity');
log('Intl');
log('JSON');
log('Map');
log('Math');
log('NaN');
log('Number');
log('Object');
log('Promise');
log('Proxy');
log('RangeError');
log('ReferenceError');
log('Reflect'); // esnext
log('RegExp');
log('SharedArrayBuffer'); // esnext
log('Set'); // esnext
log('String');
log('SuppressedError'); // esnext
log('Symbol');
log('SyntaxError');
log('TypeError');
log('Uint8Array');
log('URIError');
log('Uint8ClampedArray');
log('Uint16Array');
log('Uint32Array');
log('Uint8Array');
log('Uint8ClampedArray');
log('WeakMap');
log('WeakRef');
log('WeakSet');

log('callDBus');
log('console');
log('decodeURI');
log('decodeURIComponent');
log('encodeURI');
log('encodeURIComponent');
log('escape');
log('eval');
log('globalThis');
log('isFinite');
log('isNaN');
log('options');
log('parseFloat');
log('parseInt');
log('print');
log('readConfig');
log('registerShortcut');
log('undefined');
log('unescape');
log('workspace');
