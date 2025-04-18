import { Edge, QRect } from "../qt";
import { KWindow } from "./window";

export interface Tile {
  /** Geometry relative to rootTile */
  relativeGeometry: QRect;
  /** Geometry relative to workspace */
  absoluteGeometry: QRect;
  absoluteGeometryInScreen: QRect;
  padding: number;
  positionInLayout: number;
  /** @todo null or undefined? */
  parent: Tile | null;
  /** Children tiles */
  tiles: Tile[];
  windows: KWindow[];
  isLayout: boolean;
  canBeRemoved: boolean;
  layoutDirection: number;

  resizeByPixels(delta: number, edge: Edge): void;
  moveByPixels(delta: number): void;
  remove(): void;
  split(direction: number): void;

  /** @todo the below methods are documented as "signals". Are they direct methods as they are defined here? */
  /** @todo return signatures */
  relativeGeometryChanged(): unknown;
  absoluteGeometryChanged(): unknown;
  windowGeometryChanged(): unknown;
  paddingChanged(padding: number): unknown;
  rowChanged(): unknown;
  isLayoutChanged(isLayout: boolean): unknown;
  childTilesChanged(): unknown;
  windowAdded(window: KWindow): unknown;
  windowRemoved(window: KWindow): unknown;
  windowsChanged(): unknown;
  layoutDirectionChanged(): unknown;
  layoutModified(): unknown;
}
