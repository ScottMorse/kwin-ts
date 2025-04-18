import isPlainObject from "lodash/isPlainObject";
import mapValues from "lodash/mapValues";

export type Frozen<T> = T extends object ? Readonly<T> : T;

export const freeze = <T extends object>(obj: T): Frozen<T> =>
  Object.freeze(obj) as Frozen<T>;

export type DeepFrozen<T> = T extends object
  ? {
      readonly [K in keyof T]: Frozen<T[K]>;
    }
  : T;

/** Call Object.freeze recursively in object. Does not mutate original object. No-op on non-plain-objects. */
export const deepFreeze = <T extends object>(obj: T): DeepFrozen<T> =>
  (isPlainObject(obj)
    ? Object.freeze(mapValues(obj, deepFreeze))
    : obj) as DeepFrozen<T>;
