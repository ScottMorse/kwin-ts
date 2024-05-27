export interface Options {
  focusPolicy: number;
  xwaylandCrashPolicy: number;
  xwaylandMaxCrashCount: number;
  nextFocusPrefersMouse: boolean;
  clickRaise: boolean;
  autoRaise: boolean;
  autoRaiseInterval: number;
  delayFocusInterval: number;
  shadeHover: boolean;
  shadeHoverInterval: number;
  separateScreenFocus: boolean;
  activeMouseScreen: boolean;
  placement: number;
  activationDesktopPolicy: number;
  focusPolicyIsReasonable: boolean;
  borderSnapZone: number;
  windowSnapZone: number;
  centerSnapZone: number;
  snapOnlyWhenOverlapping: boolean;
  rollOverDesktops: boolean;
  focusStealingPreventionLevel: number;
  operationTitlebarDblClick: number;
  operationMaxButtonLeftClick: number;
  operationMaxButtonMiddleClick: number;
  operationMaxButtonRightClick: number;
  commandActiveTitlebar1: number;
  commandActiveTitlebar2: number;
  commandActiveTitlebar3: number;
  commandInactiveTitlebar1: number;
  commandInactiveTitlebar2: number;
  commandInactiveTitlebar3: number;
  commandWindow1: number;
  commandWindow2: number;
  commandWindow3: number;
  commandWindowWheel: number;
  commandAll1: number;
  commandAll2: number;
  commandAll3: number;
  keyCmdAllModKey: number;
  condensedTitle: boolean;
  electricBorderMaximize: boolean;
  electricBorderTiling: boolean;
  electricBorderCornerRatio: number;
  borderlessMaximizedWindows: boolean;
  killPingTimeout: number;
  hideUtilityWindowsForInactive: boolean;
  compositingMode: number;
  useCompositing: boolean;
  hiddenPreviews: number;
  glSmoothScale: number;
  glStrictBinding: boolean;
  glStrictBindingFollowsDriver: boolean;
  glPreferBufferSwap: number;
  glPlatformInterface: number;
  windowsBlockCompositing: boolean;
  allowTearing: boolean;

  /** @todo signals are normal methods? */
  /** @todo return signature */
  configChanged(): unknown;
  focusPolicyChanged(): unknown;
  focusPolicyIsResonableChanged(): unknown;
  xwaylandCrashPolicyChanged(): unknown;
  xwaylandMaxCrashCountChanged(): unknown;
  xwaylandEavesdropsChanged(): unknown;
  nextFocusPrefersMouseChanged(): unknown;
  clickRaiseChanged(): unknown;
  autoRaiseChanged(): unknown;
  autoRaiseIntervalChanged(): unknown;
  delayFocusIntervalChanged(): unknown;
  shadeHoverChanged(): unknown;
  shadeHoverIntervalChanged(): unknown;
  separateScreenFocusChanged(): unknown;
  activeMouseScreenChanged(): unknown;
  placementChanged(): unknown;
  activationDesktopPolicyChanged(): unknown;
  borderSnapZoneChanged(): unknown;
  windowSnapZoneChanged(): unknown;
  centerSnapZoneChanged(): unknown;
  snapOnlyWhenOverlappingChanged(): unknown;
  rollOverDesktopsChanged(): unknown;
  focusStealingPreventionLevelChanged(): unknown;
  operationTitlebarDblClickChanged(): unknown;
  operationMaxButtonLeftClickChanged(): unknown;
  operationMaxButtonRightClickChanged(): unknown;
  operationMaxButtonMiddleClickChanged(): unknown;
  commandActiveTitlebar1Changed(): unknown;
  commandActiveTitlebar2Changed(): unknown;
  commandActiveTitlebar3Changed(): unknown;
  commandInactiveTitlebar1Changed(): unknown;
  commandInactiveTitlebar2Changed(): unknown;
  commandInactiveTitlebar3Changed(): unknown;
  commandWindow1Changed(): unknown;
  commandWindow2Changed(): unknown;
  commandWindow3Changed(): unknown;
  commandWindowWheelChanged(): unknown;
  commandAll1Changed(): unknown;
  commandAll2Changed(): unknown;
  commandAll3Changed(): unknown;
  keyCmdAllModKeyChanged(): unknown;
  condensedTitleChanged(): unknown;
  electricBorderMaximizeChanged(): unknown;
  electricBorderTilingChanged(): unknown;
  electricBorderCornerRatioChanged(): unknown;
  borderlessMaximizedWindowsChanged(): unknown;
  killPingTimeoutChanged(): unknown;
  hideUtilityWindowsForInactiveChanged(): unknown;
  compositingModeChanged(): unknown;
  useCompositingChanged(): unknown;
  hiddenPreviewsChanged(): unknown;
  glSmoothScaleChanged(): unknown;
  glStrictBindingChanged(): unknown;
  glStrictBindingFollowsDriverChanged(): unknown;
  glPreferBufferSwapChanged(): unknown;
  glPlatformInterfaceChanged(): unknown;
  windowsBlockCompositingChanged(): unknown;
  allowTearingChanged(): unknown;
  animationSpeedChanged(): unknown;
}
