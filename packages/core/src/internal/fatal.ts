import { defaultLogger } from "../logger";

export const fatalExit = (
  message: string,
  error?: unknown,
  logger = defaultLogger,
) => {
  logger.fatal(
    ...((error ? [message, error] : [message]) as [string, error?: Error]),
  );
  process.exit(1);
};

export const handleUncaughtExceptions = () => {
  const callback = (error: Error) => {
    fatalExit("Uncaught exception", error);
  };

  process.on("uncaughtException", callback);

  return () => {
    process.off("uncaughtException", callback);
  };
};
