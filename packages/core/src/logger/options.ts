import { createPrivateMapFactory } from '../internal/object/map';
import { getParent } from './child';
import { selectGlobalLoggerOption } from './global';
import type { Logger } from './logger';
import { VerbosityLevel } from './verbosity';

export interface BaseLoggerOptions {
  name: string;
  verbosity: VerbosityLevel;
}

export type LoggerOptions = {
  [key in keyof BaseLoggerOptions]: BaseLoggerOptions[key] | 'inherit';
};

export const DEFAULT_LOGGER_OPTIONS: LoggerOptions = {
  name: 'inherit',
  verbosity: 'inherit',
};

export type CreateLoggerOptions = Partial<LoggerOptions>;

export const resolveOption = <K extends keyof LoggerOptions>(
  child: Logger,
  key: K
): BaseLoggerOptions[K] => {
  const parent = getParent(child);

  const option = child.options[key];
  if (option !== 'inherit') return option as BaseLoggerOptions[K];

  if (!parent) return selectGlobalLoggerOption(key);
  const value = child.options[key];
  return (
    value === 'inherit' ? resolveOption(parent, key) : value
  ) as BaseLoggerOptions[K];
};

const optionsPrivateMap = createPrivateMapFactory<LoggerOptions>({
  defaultInitialValues: {
    ...DEFAULT_LOGGER_OPTIONS,
  },
});

class _LoggerOptions implements LoggerOptions {
  constructor(options: LoggerOptions) {
    optionsPrivateMap.set(this, options);
  }

  get name() {
    return optionsPrivateMap.get(this).get('name');
  }

  set name(name: string) {
    optionsPrivateMap.get(this).set('name', name);
  }

  get verbosity() {
    return optionsPrivateMap.get(this).get('verbosity');
  }

  set verbosity(verbosity: VerbosityLevel | 'inherit') {
    optionsPrivateMap.get(this).set('verbosity', verbosity);
  }
}

export const createLoggerOptions = (options?: CreateLoggerOptions) =>
  new _LoggerOptions({
    ...DEFAULT_LOGGER_OPTIONS,
    ...options,
    name:
      options?.name?.replace(/\s+/g, ' ').trim() || DEFAULT_LOGGER_OPTIONS.name,
  });
