import type { QPoint, QRect, QSize } from "../qt";
import type { Desktop } from "./desktop";
import type { Output } from "./output";
import type { TileManager } from "./tileManager";
import type { KWindow } from "./window";

/** @todo unknown enum (need source code) */
enum ClientAreaOption {}

export interface Workspace {
  desktops: Desktop[];
  currentDesktop: Desktop;
  /** @todo null or undefined */
  activeWindow: KWindow | null;
  desktopGridSize: QSize;
  desktopWidth: number;
  desktopHeight: number;
  workspaceSize: QSize;
  workspaceGridSize: QSize;
  workspaceWidth: number;
  workspaceHeight: number;
  activeScreen: Output;
  screens: Output[];
  currentActivity: string;
  activities: string[];
  virtualScreenSize: QSize;
  virtualScreenGeometry: QRect;
  stackingOrder: KWindow[];
  cursorPos: QPoint;
  windows: KWindow[];

  sendClientToScreen(client: KWindow, screen: Output): void;
  showOutline(): void;
  hideOutline(): void;
  screenAt(point: QPoint): Output;
  tilingForScreen(screen: Output): TileManager;
  clientArea(options: ClientAreaOption, screen: Output): QRect;
  clientArea(options: ClientAreaOption, client: KWindow): QRect;
  clientArea(options: ClientAreaOption, client: KWindow, screen: Output): QRect;
  createDesktop(position: number, name: string): void;
  removeDesktop(desktop: Desktop): void;
  supportInformation(): string;
  raiseWindow(window: KWindow): void;
  getClient(id: number): KWindow;
  windowAt(point: QPoint, count: number): KWindow[];
  isEffectActive(id: string): boolean;
  windowList(): KWindow[];

  /** @todo are "signals" below just normal methods? @todo return signatures */
  windowAdded(window: KWindow): unknown;
  windowRemoved(window: KWindow): unknown;
  windowActivated(window: KWindow): unknown;
  desktopsChanged(): unknown;
  desktopLayoutChanged(): unknown;
  screensChanged(): unknown;
  currentActivityChanged(id: string): unknown;
  activitiesChanged(id: string): unknown;
  activityAdded(id: string): unknown;
  activityRemoved(id: string): unknown;
  virtualScreenSizeChanged(): unknown;
  virtualScreenGeometryChanged(): unknown;
  currentDesktopChanged(oldDesktop: Desktop): unknown;
  cursorPosChanged(): unknown;
}

/*
workspaceSize
Workspace size (pixels probably)

workspaceGridSize: QSize

workspaceWidth/Height
Probably better to use the size one

workspaceWidth: number

workspaceHeight: number

activeScreen
Doxygen calls this activeOutput. Can't wait to update these docs in 2 months!

activeScreen: Output

screens
Again harder than it needs to be. I don't care about the monitor manufacturer, I just want to work with KWin

screens: Output[]

currentActivity
How are you making virtual desktops objects but not activities

currentActivity: string

activities
Can't really complain at this point I guess

activities: string[]

virtualScreenSize
I don't know why this exists when workspaceSize (probably) does the same thing

virtualScreenSize: QSize

virtualScreenGeometry
Yeah I have no clue

virtualScreenGeometry: QRect

stackingOrder
Order that windows are stacked in. Highly useful I expect

stackingOrder: KWindow[]

cursorPos
Cursor position <3

cursorPos: QPoint

windows
List of windows. Not available in JavaScript, use windowList instead

windows: KWindow[]

sendClientToScreen
Called sendWindowToOutput in doxygen, anyways sends the client to a screen

sendClientToScreen(client: KWindow, screen: Output)

showOutline
Outline of what, I don't know

showOutline()

hideOutline
Hmm

hideOutline()

screenAt
Gets the screen at a position

screenAt(point: QPoint): Output

tilingForScreen
All the things that say screen, just assume they mean output. This one is pretty important though in my opinion

tilingForScreen(screen: Output): TileManager

clientArea
Says how much area a client can take up (I think). Couple overloads, uses a ClientAreaOption enum that I don't know

clientArea(options: ClientAreaOption, screen: Output): QRect

clientArea(options: ClientAreaOption, client: KWindow): QRect

clientArea(options: ClientAreaOption, client: KWindow, screen: Output): QRect

clientArea(options: ClientAreaOption, client: KWindow, pos: QPoint): QRect

createDesktop
Creates a new virtual desktop at position I guess?

createDesktop(position: number, name: string)

removeDesktop
Removes virtual desktop

removeDesktop(desktop: VirtualDesktop)

supportInformation
Gets a large amount of support information about the system. Can be used to check if running X11 or Wayland

supportInformation(): string

raiseWindow
Raise a window above other windows

raiseWindow(window: KWindow)

getClient
No clue why you would use this, but gets a client based off of its ID

getClient(id: number): KWindow

windowAt
Gets windows at a position

windowAt(point: QPoint, count: number = 1): KWindow[]

isEffectActive
Checks if a certain plugin is enabled. Yet to see if works with general KWin scripts as well

isEffectActive(id: string): boolean

windowList
No doxygen, but I assume it lists all clients like the old getClients from 5.27. Not available in QML

windowList(): KWindow[]

windowAdded
Signal emitted when a window is added

windowAdded(window: KWindow)

windowRemoved
Signal emitted when a window is removed (usually closed)

windowRemoved(window: KWindow)

windowActivated
Signal emitted when a window is focused

windowActivated(window: KWindow)

desktopsChanged
Signal emitted when virtual desktops are added or removed

desktopsChanged()

desktopLayoutChanged
Emitted when the desktop layout is changed. I don't know what it means either

desktopLayoutChanged()

screensChanged
Emitted when screens are added or removed

screensChanged()

currentActivityChanged
Emitted when the current activity changes

currentActivityChanged(id: string)

activitiesChanged
Emitted when activities are modified (not when the current one changes). No clue what id is here exactly

activitiesChanged(id: string)

activityAdded
Emitted when an activity is added

activityAdded(id: string)

activityRemoved
Emitted when an activity is removed

activityRemoved(id: string)

virtualScreenSizeChanged
Emitted when the virtual screen size is changed

virtualScreenSizeChanged()

virtualScreenGeometryChanged
Emitted when the virtual screen geometry is changed. Seems more useful than size

virtualScreenGeometryChanged()

currentDesktopChanged
Emitted when the desktop is switched. Not to be confused with desktopsChanged

currentDesktopChanged(oldDesktop: Desktop)

cursorPosChanged
Emitted when the cursor position is changed. Probably best to not hook into this too much

cursorPosChanged()
*/
