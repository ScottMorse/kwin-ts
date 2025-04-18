import { defaultLogger } from "../internal/logger";

export const fatalExit = (
  message: string,
  error?: unknown,
  logger = defaultLogger,
) => {
  logger.error(...(error ? [message, error] : [message]));
  process.exit(1);
};
