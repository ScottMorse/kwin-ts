export type Override<T, U> = Omit<T, keyof U> & U;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Func<T = any[], R = any> = T extends any[]
  ? (...args: T) => R
  : never;

export type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Func ? never : K;
}[keyof T];

export type NoMethods<T> = Pick<T, NonFunctionKeys<T>>;

export type KeyOfType<Type, KeyType> = Extract<keyof Type, KeyType>;
export type StringKeyOf<Type> = KeyOfType<Type, string>;
export type NumberKeyOf<Type> = KeyOfType<Type, number>;
export type SymbolKeyOf<Type> = KeyOfType<Type, symbol>;

export type KeyOfValueType<Type, ValueType> = {
  [Key in keyof Type]: Type[Key] extends ValueType ? Key : never;
}[keyof Type];
