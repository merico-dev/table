import { IColorInterpolation } from '~/types/plugin';
import chroma from 'chroma-js';

const red = chroma.bezier(['darkred', 'deeppink', 'lightyellow']);
const green = chroma.bezier(['lightyellow', 'lightgreen', 'teal']);
export const RedGreen: IColorInterpolation = {
  type: 'interpolation',
  displayName: 'Red / Green',
  getColor: function (value: number): string {
    if (value < 50) {
      return red((value * 2) / 100).hex();
    }
    return green(((value - 50) * 2) / 100).hex();
  },
  name: 'red-green',
  category: 'basic',
};
