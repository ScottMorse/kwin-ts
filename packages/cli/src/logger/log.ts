import { deepFreeze } from '../internal/object/freeze';
import { createPrivateMapFactory } from '../internal/object/map';
import { NoMethods } from '../internal/types';
import { LogLevel } from './level';
import type { Logger } from './internal/logger';
import { LoggerOptions } from './options';
import { printLog } from './print';

export type LogMainMessage = string | Error;

export type LogMessages = [LogMainMessage, ...rest: unknown[]];

export interface Log {
  id: string;
  level: LogLevel;
  messages: LogMessages;
  date: Date;
  printed: boolean;
  print(force?: boolean): void;
  meta: {
    logger: Logger;
    options: LoggerOptions;
  };
}

export type CreateLogOptions = NoMethods<Omit<Log, 'id'>>;

const privateMaps = createPrivateMapFactory<
  CreateLogOptions & {
    id: string;
  }
>({
  defaultInitialValues: {} as any,
});

let logId = 0;

export const __setPrinted = (log: Log, printed: boolean) => {
  privateMaps.get(log).set('printed', printed);
};

class _Log implements Log {
  constructor(log: CreateLogOptions) {
    privateMaps.set(this, {
      ...log,
      id: logId.toString().padStart(10, '0'),
    });

    logId++;
  }

  get date() {
    return privateMaps.get(this).get('date');
  }

  get id() {
    return privateMaps.get(this).get('id');
  }

  get level() {
    return privateMaps.get(this).get('level');
  }

  get messages() {
    return privateMaps.get(this).get('messages');
  }

  get printed() {
    return privateMaps.get(this).get('printed');
  }

  get meta() {
    return deepFreeze(privateMaps.get(this).get('meta'));
  }

  print(force?: boolean) {
    try {
      printLog(this, force);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to print log: ', e);
    }
  }

  toString() {
    const mainMessage = this.messages[0];
    return `[object Log "${
      mainMessage instanceof Error ? mainMessage.message : mainMessage
    }" { id: '${this.id}', level: '${
      this.level
    }', date: '${this.date.toISOString()}', printed: ${
      this.printed
    }, logger: '${this.meta.logger.name}' ]`;
  }
}

export const createLog = (log: CreateLogOptions) => new _Log(log);
