export interface RemotePromise<T> extends Promise<T> {
  resolve(value: T): void;
  reject(reason?: unknown): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createRemotePromise = <T = any>() => {
  const callbackState = {
    resolve: (value: T) => console.warn(new Error("No resolve set"), { value }),
    reject: (reason: unknown) =>
      console.warn(new Error("No reject set"), { reason }),
  };

  const promise = new Promise<T>((resolve, reject) => {
    callbackState.resolve = resolve as typeof callbackState.resolve;
    callbackState.reject = reject;
  }) as RemotePromise<T>;

  promise.resolve = (value: T) => callbackState.resolve(value);
  promise.reject = (reason: unknown) => callbackState.reject(reason);

  return promise;
};
