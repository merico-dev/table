import { IRadarChartConf } from '../type';
import { getFormatter } from './formatter';

export function getSeriesLabel(conf: IRadarChartConf) {
  return {
    show: true,
    formatter: ({ dimensionIndex, value }: { dimensionIndex: number; value: number }) => {
      const formatter = getFormatter(conf.dimensions[dimensionIndex].formatter);
      return formatter(value);
    },
  };
}
