import type {
  TypedEvent} from "../internal/events/typedEventTarget";
import {
  TypedEventTarget,
  createTypedEventFactory,
} from "../internal/events/typedEventTarget";
import type { Log } from "./log";

export type LogEvent = TypedEvent<"log", { log: Log }>;

export type LoggerEvents = {
  log: LogEvent;
};

export type LogEventTarget = TypedEventTarget<LoggerEvents>;

const globalTarget = new TypedEventTarget<LoggerEvents>();

export const createLogEvent = createTypedEventFactory<LogEvent>("log");

export const getGlobalEventTarget = () => globalTarget;
