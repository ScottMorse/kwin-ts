/** @todo are these constructable in JS API? */
export interface Timer {
  interval: number;
  repeat: boolean;
  running: boolean;
  triggeredOnStart: boolean;
  /**
   * @todo signature?
   * "The corresponding handler is onTriggered)" <- in JS API?
   */
  triggered(): unknown;
  /** @todo signature? */
  restart(): unknown;
  /** @todo signature? */
  start(): unknown;
  /** @todo signature? */
  stop(): unknown;
}
