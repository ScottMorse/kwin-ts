export interface Desktop {
  id: string;
  name: string;
  x11DesktopNumber: number;
  /** @todo signature? */
  nameChanged(): unknown;
  /** @todo signature? */
  x11DesktopNumberChanged(): unknown;
  /** @todo signature? */
  aboutToBeDestroyed(): unknown;
}
