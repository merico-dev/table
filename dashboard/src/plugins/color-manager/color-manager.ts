import { IColorPaletteItem, ISingleColor } from '../../types/plugin';

export interface IColorManager {
  getStaticColors(): ISingleColor[];

  register<T extends IColorPaletteItem>(paletteItem: T): void;

  decodeStaticColor(key: string): ISingleColor | undefined;

  encodeColor(color: ISingleColor): string;

  // todo: color interpolation
}
