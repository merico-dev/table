import numbro from 'numbro';
import { ICartesianChartConf, IYAxisConf } from '../../type';

export function getLabelFormatters(conf: ICartesianChartConf) {
  const ret = conf.y_axes.reduce(
    (ret: Record<string, (params: $TSFixMe) => string>, { label_formatter }: IYAxisConf, index: number) => {
      ret[index] = function formatter(payload: $TSFixMe) {
        let value = payload;
        if (typeof payload === 'object') {
          if (Array.isArray(payload.value) && payload.value.length === 2) {
            // when there's grouped entries in one seriesItem (use 'Group By' field in editor)
            value = payload.value[1];
          } else {
            value = payload.value;
          }
        }
        if (!label_formatter) {
          return value;
        }
        try {
          return numbro(value).format(label_formatter);
        } catch (error) {
          console.error(error);
          return value;
        }
      };
      return ret;
    },
    {
      default: ({ value }: $TSFixMe) => value,
    },
  );

  return ret;
}
