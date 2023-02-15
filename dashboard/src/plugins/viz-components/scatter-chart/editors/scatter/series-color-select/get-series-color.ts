import lodash from 'lodash';
import { interpolate } from 'popmotion';
import { AnyObject } from '~/types';
import { DEFAULT_SERIES_COLOR, TSeriesColor, TSeriesColor_Dynamic, TSeriesColor_Static } from './types';

export function getSeriesColor({ type, ...rest }: TSeriesColor, variableValueMap: Record<string, string | number>) {
  if (!type) {
    return DEFAULT_SERIES_COLOR.static.color;
  }
  if (type === 'static') {
    const { color } = rest as TSeriesColor_Static;
    return color;
  }
  const { func_content } = rest as TSeriesColor_Dynamic;
  return ({ value: rowData }: AnyObject) => {
    try {
      return new Function(`return ${func_content}`)()(
        { rowData, variables: variableValueMap },
        { lodash, interpolate },
      );
    } catch (error) {
      // @ts-expect-error Object is of type 'unknown'.
      console.error(`[getSeriesColor] failed parsing custom function, error: ${error.message}`);
      return 10;
    }
  };
}
