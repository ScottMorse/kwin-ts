import { importedFunction } from "./debug.module";

const log = (key: keyof typeof globalThis) =>
  kwinTs.rawPrint(
    !(key in globalThis) ? "❌" : !globalThis[key] ? "?" : "",
    key,
    globalThis[key],
  );

console.log("Globals:");
log("Array");
log("ArrayBuffer");
// log('AsyncDisposableStack'); //! es2022
log("Atomics");
// log('BigInt'); //! es2019
// log('BigInt64Array'); //! es2019
// log('BigUint64Array'); //! es2019
// log('BigUint64Array'); //! es2019
log("Boolean");
log("DataView");
log("Date");
// log('DisposableStack'); //! es2022
log("Error");
log("EvalError");
// log('FinalizationRegistry'); //! es2019
log("Float32Array");
log("Float64Array");
log("Function");
log("Int8Array");
log("Int32Array");
log("Int16Array");
log("Infinity");
// log('Intl'); // ! not in QtScript
log("JSON");
log("Map");
log("Math");
log("NaN");
log("Number");
log("Object");
log("Promise");
log("Proxy");
log("RangeError");
log("ReferenceError");
log("Reflect");
log("RegExp");
log("SharedArrayBuffer");
log("Set");
log("String");
// log('SuppressedError'); //! es2022
log("Symbol");
log("SyntaxError");
log("TypeError");
log("Uint8Array");
log("URIError");
log("Uint8ClampedArray");
log("Uint16Array");
log("Uint32Array");
log("Uint8Array");
log("Uint8ClampedArray");
log("WeakMap");
// log('WeakRef'); //! es2019
log("WeakSet");

log("callDBus");
log("console");
log("decodeURI");
log("decodeURIComponent");
log("encodeURI");
log("encodeURIComponent");
log("escape");
log("eval");
log("globalThis");
log("isFinite");
log("isNaN");
log("options");
log("parseFloat");
log("parseInt");
log("print");
log("readConfig");
log("registerShortcut");
log("undefined");
log("unescape");
log("workspace");

const logConsole = (key: keyof typeof console) =>
  kwinTs.rawPrint(
    !(key in console) ? "❌" : !console[key] ? "?" : "",
    key,
    console[key],
  );

print("");
print("\nConsole:");
logConsole("assert");
// logConsole('clear');
logConsole("count");
// logConsole('countReset');
logConsole("debug");
// logConsole('dir');
// logConsole('dirxml');
logConsole("error");
// logConsole('group');
// logConsole('groupCollapsed');
// logConsole('groupEnd');
logConsole("info");
logConsole("log");
// logConsole('table');
logConsole("time");
logConsole("timeEnd");
// logConsole('timeLog');
// logConsole('timeStamp');
logConsole("trace");
logConsole("warn");

print("printing", "many", "things", { like: "this" });

const testObject = { a: "1", b: "2", c: "3", 1: "a", 2: "b", 3: "c" };

print("Reflect.delete");
Reflect.deleteProperty(testObject, "1");

print("Reflect.get", Reflect.get(testObject, "b"));
print("Reflect.set", Reflect.set(testObject, 1, "one"));

print(JSON.stringify(testObject));

async function asyncFunc() {
  const message = new Promise((res) => res("asyncFunc message from promise"));
  await message;
  return message;
}

asyncFunc().then((message) => {
  print(message);
  print("dynamic import start");
  import("./debug.module").then((mod: typeof import("./debug.module")) => {
    mod.importedFunction();
    print("dyanmic import end");
  });
});

function* generator() {
  yield "a";
  yield "b";
  yield "c";
  yield "d";
}

importedFunction();

generator().next();
for (const result of generator()) {
  print("generator result", result);
}

// print('Atomics.waitAsync', Atomics.waitAsync); // ! es2022 shared memory

// print( // ! es2017 shared memory
//   'SharedArrayBuffer 2017:',
//   SharedArrayBuffer.byteLength,
//   SharedArrayBuffer.slice,
//   SharedArrayBuffer[Symbol.species],
//   SharedArrayBuffer[Symbol.toStringTag]
// );

print("some object", { some: "object" });

print(
  "process.env.KWIN_TS_TEST_EXAMPLE_MAIN",
  process.env.KWIN_TS_TEST_EXAMPLE_MAIN,
);

print("lib array.include", ["a", "b", "c"].includes("b"));
