export interface KWinGlobalMethods {
  print: typeof console.log;
  /** @todo possible types of generic */
  readConfig: <T>(key: string, defaultValue: T) => T;
  /** @todo args type, return signature */
  callDBus: (
    service: string,
    path: string,
    iface: string,
    method: string,
    ...args: unknown[]
  ) => unknown;
  /** @todo callback type, return signature */
  registerShortcut: (
    name: string,
    description: string,
    key: string,
    callback: () => unknown,
  ) => unknown;
}

export interface KWinNamespace {
  PlacementArea: number;
  MovementArea: number;
  MaximizeArea: number;
  MaximizeFullArea: number;
  FullScreenArea: number;
  WorkArea: number;
  FullArea: number;
  ScreenArea: number;

  ElectricTop: number;
  ElectricTopRight: number;
  ElectricRight: number;
  ElectricBottomRight: number;
  ElectricBottom: number;
  ElectricBottomLeft: number;
  ElectricLeft: number;
  ElectricTopLeft: number;
  ElectricNone: number;
  ELECTRIC_COUNT: number;
}
