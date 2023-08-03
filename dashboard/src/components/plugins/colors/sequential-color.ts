import chroma from 'chroma-js';
import { IColorInterpolation } from '~/types/plugin';

export const createSequentialColorPalette = (colors: string[]): IColorInterpolation['getColor'] => {
  const fn = chroma.bezier(colors);
  return function (value: number): string {
    return fn(value / 100).hex();
  };
};
