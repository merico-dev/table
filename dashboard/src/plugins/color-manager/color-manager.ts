import { IColorInterpolation, IColorPaletteItem, ISingleColor } from '~/types/plugin';

export interface IColorManager {
  getStaticColors(): ISingleColor[];
  getColorInterpolations(): IColorInterpolation[];

  register<T extends IColorPaletteItem>(paletteItem: T): void;

  decodeStaticColor(key: string): ISingleColor | undefined;

  encodeColor(color: IColorPaletteItem): string;
  decodeInterpolation(key: string): IColorInterpolation | undefined;

  // todo: color interpolation
}
