import { parseDataKey } from '~/utils/data';
import { IScatterChartConf } from '../type';

export function getDataset(conf: IScatterChartConf, data: TPanelData) {
  if (!conf.x_axis.data_key) {
    return [];
  }
  const x = parseDataKey(conf.x_axis.data_key);
  const source = data[x.queryID];
  return [
    {
      source,
    },
  ];
}
