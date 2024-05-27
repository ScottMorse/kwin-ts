import { TypedEventTarget } from '../internal/events/typedEventTarget';
import { createPrivateMapFactory } from '../internal/object/map';
import { getChildren, getParent, setParent } from './child';
import { LogEventTarget, LoggerEvents } from './events';
import { LogLevel, PrintableLogLevel } from './level';
import { _registerLog } from './listen';
import { CreateLogOptions, Log, LogMessages, createLog } from './log';
import {
  CreateLoggerOptions,
  LoggerOptions,
  createLoggerOptions,
  resolveOption,
} from './options';
import { formatName } from './print';

export type Logger = LogEventTarget & {
  log(level: LogLevel, ...messages: LogMessages): Log;
  options: LoggerOptions;
  name: string;
  id: string;
  createChild: (options?: CreateLoggerOptions) => Logger;
  clone(): Logger;
} & {
  [key in PrintableLogLevel]: (...messages: LogMessages) => Log;
};

const privateMaps = createPrivateMapFactory({
  defaultInitialValues: {
    id: '-1',
    isRoot: true,
    options: createLoggerOptions(),
  },
});

const ID_LENGTH = 8;

const RANDOM_MAX = parseInt('9'.repeat(ID_LENGTH));

class _Logger extends TypedEventTarget<LoggerEvents> implements Logger {
  constructor(options: LoggerOptions) {
    super();
    privateMaps.set(this, {
      id: Math.round(Math.random() * RANDOM_MAX)
        .toString()
        .padStart(ID_LENGTH, '0'),
      isRoot: true,
      options,
    });
  }

  get id() {
    return privateMaps.get(this).get('id');
  }

  get options() {
    return privateMaps.get(this).get('options');
  }

  get name(): string {
    return formatName(this, () => privateMaps.get(this).get('isRoot'));
  }

  log(level: LogLevel, ...messages: LogMessages): Log {
    const logOptions: CreateLogOptions = {
      level,
      messages,
      date: new Date(),
      printed: false,
      meta: {
        logger: this,
        options: this.options,
      },
    };

    try {
      const log = createLog(logOptions);
      _registerLog(log);

      log.print();

      return log;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to log message: ', e);
      return {
        ...logOptions,
        id: '(error)',
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        print: () => {},
      };
    }
  }

  debug(...messages: LogMessages) {
    return this.log('debug', ...messages);
  }

  info(...messages: LogMessages) {
    return this.log('info', ...messages);
  }

  warn(...messages: LogMessages) {
    return this.log('warn', ...messages);
  }

  error(...messages: LogMessages) {
    return this.log('error', ...messages);
  }

  fatal(...messages: LogMessages) {
    return this.log('fatal', ...messages);
  }

  clone() {
    const clone = _createLogger(this.options);

    const parent = getParent(this);
    if (parent) setParent(clone, parent);

    for (const child of getChildren(this)) {
      setParent(child, clone);
    }

    privateMaps.get(clone).set('id', this.id + '-clone-' + clone.id);

    return clone;
  }

  createChild(options?: CreateLoggerOptions) {
    const child = _createLogger({
      ...this.options,
      name: 'inherit',
      verbosity: 'inherit',
      ...options,
    });

    setParent(child, this);

    privateMaps.get(child).set('isRoot', false);

    return child;
  }

  toString() {
    return `[object Logger { id: ${this.id}, name: ${this.name} }]`;
  }
}

const _createLogger = (options?: CreateLoggerOptions): Logger => {
  try {
    return new _Logger(createLoggerOptions(options));
  } catch (e) {
    /* eslint-disable no-console */
    console.error(e);
    console.error('Failed to create logger. Args: ', { options });
    return {
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
      options: {
        name: '<kwin-ts: error creating logger>',
        verbosity: 'default',
      },
      log: console.log as Logger['log'],
      id: '-1',
      name: '<kwin-ts: error creating logger>',
      ...({
        log: console.log,
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error,
        fatal: console.error,
      } as { [key in PrintableLogLevel]: unknown } as {
        [key in LogLevel]: (...messages: unknown[]) => Log;
      }),
      clone: function () {
        return { ...this };
      },
      createChild: function () {
        return { ...this };
      },
    };
    /* eslint-enable no-console */
  }
};

export const defaultLogger = _createLogger();

defaultLogger.debug(
  `Logging enabled (using default verbosity "${resolveOption(
    defaultLogger,
    'verbosity'
  )}")`
);

export const createLogger = (options?: CreateLoggerOptions) =>
  defaultLogger.createChild(options);
