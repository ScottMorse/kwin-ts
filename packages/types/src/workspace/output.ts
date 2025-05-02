import type { QRect } from "../qt";

/** Corresponds to an output device, such as a monitor */
export interface Output {
  geometry: QRect;
  devicePixelRatio: number;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  /** @todo return signature? */
  mapToGlobal(rect: QRect): unknown;
  /** @todo return signature? */
  mapFromGlobal(rect: QRect): unknown;
  /** @todo all unknown signatures? */
  geometryChanged(): unknown;
  enabledChanged(): unknown;
  scaleChanged(): unknown;
  aboutToTurnOff(): unknown;
  wakeUp(): unknown;
  aboutToChange(): unknown;
  changed(): unknown;
  currentModeChanged(): unknown;
  modesChanged(): unknown;
  /** Is this correct? "change" vs "changed" */
  outputChange(): unknown;
  transformChanged(): unknown;
  dpmsModeChanged(): unknown;
  capabilitiesChanged(): unknown;
  overscanChanged(): unknown;
  vrrPolicyChanged(): unknown;
  rgbRangeChanged(): unknown;
  wideColorGamutChanged(): unknown;
  sdrBrightnessChanged(): unknown;
  highDynamicRangeChanged(): unknown;
  autoRotationPolicyChanged(): unknown;
  iccProfileChanged(): unknown;
  iccProfilePathChanged(): unknown;
  brightnessMetadataChanged(): unknown;
  sdrGamutWidenessChanged(): unknown;
  colorDescriptionChanged(): unknown;
}
