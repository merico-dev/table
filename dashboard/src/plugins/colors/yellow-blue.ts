import { IColorInterpolation } from '~/types/plugin';
import chroma from 'chroma-js';

const yellow = chroma.bezier(['#8f531d', '#ffd347', '#e3efe3']);
const blue = chroma.bezier(['#eefaee', '#4ecbbf', '#003f94']);
export const YellowBlue: IColorInterpolation = {
  type: 'interpolation',
  displayName: 'Yellow / Blue',
  getColor: function (value: number): string {
    if (value < 50) {
      return yellow((value * 2) / 100).hex();
    }
    return blue(((value - 50) * 2) / 100).hex();
  },
  name: 'yellow-blue',
  category: 'basic',
};
