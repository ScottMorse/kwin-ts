import type { Logger } from "./logger";

const CHILD_TO_PARENT_MAP = new WeakMap<Logger, Logger>();
const PARENT_TO_CHILDREN_MAP = new WeakMap<Logger, Logger[]>();

export const getParent = (logger: Logger) => CHILD_TO_PARENT_MAP.get(logger);

export const getChildren = (logger: Logger) =>
  PARENT_TO_CHILDREN_MAP.get(logger) || [];

export const setParent = (child: Logger, parent: Logger) => {
  CHILD_TO_PARENT_MAP.set(child, parent);
  PARENT_TO_CHILDREN_MAP.set(
    parent,
    PARENT_TO_CHILDREN_MAP.get(parent)?.concat(child) || [child]
  );
};
