import lodash, { keyBy } from 'lodash';
import { interpolate } from 'popmotion';
import { AnyObject } from '~/types';
import { TSeriesColor, TSeriesColor_Dynamic, TSeriesColor_Static } from './types';

export function getSeriesColor(
  { type, ...rest }: TSeriesColor,
  data: AnyObject[],
  x_axis_data_key: string,
  variableValueMap: Record<string, string | number>,
) {
  if (!type) {
    return 10;
  }
  if (type === 'static') {
    const { color } = rest as TSeriesColor_Static;
    return color;
  }
  const { func_content } = rest as TSeriesColor_Dynamic;
  const rows = keyBy(data, x_axis_data_key);
  return (_value: number, params: $TSFixMe) => {
    let rowData;
    if (params.name) {
      // xAxis's type is category
      rowData = rows[params.name];
    } else {
      // xAxis's type is value
      rowData = data[params.dataIndex];
    }
    try {
      return new Function(`return ${func_content}`)()(
        { rowData, params, variables: variableValueMap },
        { lodash, interpolate },
      );
    } catch (error) {
      // @ts-expect-error Object is of type 'unknown'.
      console.error(`[getSeriesColor] failed parsing custom function, error: ${error.message}`);
      return 10;
    }
  };
}
