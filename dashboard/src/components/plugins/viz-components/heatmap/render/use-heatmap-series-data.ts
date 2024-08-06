import { useMemo } from 'react';
import { IHeatmapConf } from '../type';
import { parseDataKey } from '~/utils';
import _ from 'lodash';

export type SeriesDataItem = Record<string, any> & {
  value: [number, number, number];
};
export function useHeatmapSeriesData(panelData: TPanelData, conf: IHeatmapConf) {
  const x = useMemo(() => parseDataKey(conf.x_axis.data_key), [conf.x_axis.data_key]);
  const y = useMemo(() => parseDataKey(conf.y_axis.data_key), [conf.y_axis.data_key]);
  const h = useMemo(() => parseDataKey(conf.heat_block.data_key), [conf.heat_block.data_key]);
  return useMemo(() => {
    const queryData = panelData[x.queryID];
    if (!queryData) {
      return [];
    }

    const full = queryData.map((d) => {
      const vx = _.get(d, x.columnKey);
      const vy = _.get(d, y.columnKey);
      const vh = _.get(d, h.columnKey);
      return {
        value: [vx, vy, vh],
      } as SeriesDataItem;
    });

    const grouped = _.groupBy(full, 'value.1');
    console.log({ grouped });

    const sliced = Object.values(grouped).flat();
    return sliced;
  }, [panelData, x, y, h]);
}
