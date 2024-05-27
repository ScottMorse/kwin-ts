export interface KWinGlobalThis {
  /** @todo possible types of generic */
  readConfig: <T>(key: string, defaultValue: T) => T;
  /** @todo args type, return signature */
  callDBus: (
    service: string,
    path: string,
    iface: string,
    method: string,
    args: object[]
  ) => unknown;
  /** @todo callback type, return signature */
  registerShortcut: (
    name: string,
    description: string,
    key: string,
    callback: () => unknown
  ) => unknown;
}
