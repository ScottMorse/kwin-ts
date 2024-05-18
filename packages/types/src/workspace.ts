import { KWindow } from './window';

export interface Workspace {
  windowList(): KWindow[];
}
