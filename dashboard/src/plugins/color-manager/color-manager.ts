import { IColorPaletteItem, ISingleColor } from '../../types/plugin';

export interface IColorManager {
  getStaticColors(): ISingleColor[];

  register<T extends IColorPaletteItem>(paletteItem: T): void;

  // todo: color interpolation
}
