import type { QPoint, QRect, QSize } from "../qt";
import type { Output } from "./output";
import type { Tile } from "./tile";

export interface KWindow {
  bufferGeometry: QRect;
  clientGeometry: QRect;
  post: QPoint;
  size: QSize;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  output: Output;
  rect: QRect;
  resourceName: string;
  /** The XDG name */
  resourceClass: string;
  /** The XDG role */
  windowRole: string;
  /**
   * The window is the desktop (e.g. Plasma background)
   * @todo are the below booleans' key names the same as the resourceName/Class?
   */
  desktopWindow: boolean;
  dock: boolean;
  toolbar: boolean;
  menu: boolean;
  normalWindow: boolean;
  dialog: boolean;
  splash: boolean;
  utility: boolean;
  dropdownMenu: boolean;
  popupMenu: boolean;
  popupWindow: boolean;
  tooltip: boolean;
  notification: boolean;
  criticalNotification: boolean;
  appletPopup: boolean;
  onScreenDisplay: boolean;
  comboBox: boolean;
  dndicon: boolean;

  /** @todo This apparently corresponds to the type of window */
  windowType: number;
  managed: boolean;
  deleted: boolean;
  skipCloseAnimation: boolean;

  outline: boolean;
  /** @todo or is this a QUuid instance? */
  internalId: string;
  pid: number;
  stackingOrder: number;
  fullScreen: boolean;
  fullScreenable: boolean;
  active: boolean;
  desktops: number[];
  onAllDesktops: boolean;
  activities: string[];
  skipTaskbar: boolean;
  skipPager: boolean;
  skipSwitcher: boolean;
  closeable: boolean;
  icon: string;
  keepAbove: boolean;
  keepBelow: boolean;
  shadeable: boolean;
  shade: boolean;
  minimizable: boolean;
  minimized: boolean;
  iconGeometry: QSize;
  specialWindow: boolean;
  demandsAttention: boolean;
  caption: string;
  minSize: QSize;
  maxSize: QSize;
  wantsInput: boolean;
  transient: boolean;
  transientFor: KWindow;
  modal: boolean;
  /** @todo double check type */
  frameGeometry: QRect;
  move: boolean;
  resize: boolean;
  decorationHasAlpha: boolean;
  noBorder: boolean;
  providesContextHelp: boolean;
  maximizable: boolean;
  moveable: boolean;
  moveableAcrossScreens: boolean;
  resizeable: boolean;
  desktopFileName: string;
  hasApplicationMenu: boolean;
  applicationMenuActive: boolean;
  unresponsive: boolean;
  colorScheme: string;
  layer: number;
  hidden: boolean;
  /** @todo check if undefined or null */
  tile: Tile | null;
  inputMethod: boolean;

  /**@todo return signatures */
  closeWindow(): unknown;
  setReadyForPainting(): unknown;
  setMaximize(vertical: boolean, horizontal: boolean): unknown;

  /** @todo The following are documented as "signals". Are they direct methods as defined here? */
  stackingOrderChanged(): unknown;
  shadeChanged(): unknown;
  opacityChanged(window: KWindow, oldOpacity: number): unknown;
  damaged(): unknown;
  inputTransformationChanged(): unknown;
  closed(): unknown;
  windowShown(window: KWindow): unknown;
  windowHidden(window: KWindow): unknown;
  outputChanged(): unknown;
  skipCloseAnimationChanged(): unknown;
  windowRoleChanged(): unknown;
  windowClassChanged(): unknown;
  surfaceChanged(): unknown;
  shadowChanged(): unknown;
  bufferGeometryChanged(oldGeometry: QRect): unknown;
  frameGeometryChanged(oldGeometry: QRect): unknown;
  clientGeometryChanged(oldGeometry: QRect): unknown;
  frameGeometryAboutToChange(): unknown;
  visibleGeometryChanged(): unknown;
  tileChanged(tile: Tile): unknown;
  fullScreenChanged(): unknown;
  skipTaskbarChanged(): unknown;
  skipPagerChanged(): unknown;
  skipSwitcherChanged(): unknown;
  iconChanged(): unknown;
  activeChanged(): unknown;
  keepAboveChanged(keepAbove: boolean): unknown;
  keepBelowChanged(keepBelow: boolean): unknown;
  demandsAttentionChanged(): unknown;
  desktopsChanged(): unknown;
  activitiesChanged(): unknown;
  minimizedChanged(): unknown;
  paletteChanged(): unknown;
  colorSchemeChanged(): unknown;
  captionChanged(): unknown;
  captionNormalChanged(): unknown;
  maximizedAboutToChange(mode: number): unknown;
  maximizedChanged(): unknown;
  transientChanged(): unknown;
  modalChanged(): unknown;
  quickTileModeChanged(): unknown;
  moveResizedChanged(): unknown;
  moveResizeCursorChanged(): unknown;
  interactiveMoveResizeStarted(): unknown;
  interactiveMoveResizeStepped(oldGeometry: QRect): unknown;
  interactiveMoveResizeFinished(): unknown;
  closeableChanged(): unknown;
  minimizeableChanged(minimizeable: boolean): unknown;
  shadeableChanged(shadeable: boolean): unknown;
  maximizeableChanged(maximizeable: boolean): unknown;
  desktopFileNameChanged(): unknown;
  applicationMenuChanged(): unknown;
  hasApplicationMenuChanged(hasApplicationMenu: boolean): unknown;
  applicationMenuActiveChanged(active: boolean): unknown;
  unresponsiveChanged(unresponsive: boolean): unknown;
  decorationChanged(): unknown;
  hiddenChanged(): unknown;
  hiddenByShowDesktopChanged(): unknown;
  lockScreenOverlayChanged(): unknown;
  readyForPaintingChanged(): unknown;
}
