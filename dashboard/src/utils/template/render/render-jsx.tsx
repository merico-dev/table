import { InterpolateColor } from '../../color-mapping';
import { ColorConfType } from '../types';

function getColorByColorConf(conf: ColorConfType, value: number | number[] | null | string) {
  if (conf.type === 'static') {
    return conf.staticColor;
  }
  if (conf.type === 'continuous') {
    try {
      const numValue = Number(value);
      if (Number.isNaN(numValue)) {
        throw new Error(`[getColorByColorConf] Invalid type of aggregated value: ${value}, parsed: ${numValue}`);
      }
      return new InterpolateColor(conf).getColor(numValue);
    } catch (error) {
      console.error(error);
      return 'black';
    }
  }
  return 'black';
}
export const getColorByVariableColorConf = getColorByColorConf;
