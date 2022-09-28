import chroma from 'chroma-js';
import { IColorInterpolation } from '~/types/plugin';

export const createDivergingColorPalette = (left: string[], right: string[]): IColorInterpolation['getColor'] => {
  const leftColor = chroma.bezier(left);
  const rightColor = chroma.bezier(right);
  return function (value: number): string {
    if (value < 50) {
      return leftColor((value * 2) / 100).hex();
    }
    return rightColor(((value - 50) * 2) / 100).hex();
  };
};
