import type { QPoint } from "../qml";
import type { Tile } from "./tile";

/** @todo unknown type */
export interface TileModel {
  _?: unknown;
}
export interface TileManager {
  rootTile: Tile;
  model: TileModel;

  bestTileForPosition(pos: QPoint): Tile;
  bestTileForPosition(x: number, y: number): Tile;

  /** @todo signals are just methods? */
  tileRemoved(tile: Tile): unknown;
}
