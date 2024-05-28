import { defaultLogger } from '../logger';
import { fatalExit, handleUncaughtExceptions } from './fatal';
import { Func } from './types';

export const runKwinTs = async <Run extends Func>(
  run: Run,
  isMain: boolean
): Promise<
  (ReturnType<Run> extends Promise<infer R> ? R : ReturnType<Run>) | null
> => {
  if (!isMain) {
    return run();
  }

  setTimeout(() => {
    throw new Error('say what');
  }, 200);

  try {
    defaultLogger.info('Initializing');

    const cleanupExceptionHandling = handleUncaughtExceptions();

    const cleanup = () => {
      defaultLogger.debug('Cleaning up');
      cleanupExceptionHandling();
      defaultLogger.info('Done');
    };
    try {
      return await run();
    } catch (error) {
      fatalExit('Failure', error);
    } finally {
      cleanup();
    }
  } catch (error) {
    fatalExit('Failure', error);
  }

  return Promise.resolve(null);
};
