import { useMemo } from 'react';
import { IHeatmapConf } from '../type';
import { parseDataKey } from '~/utils';
import _ from 'lodash';
import { SeriesDataItem } from './use-heatmap-series-data';

export function useHeatmapGroupedData(panelData: TPanelData, conf: IHeatmapConf) {
  const x = useMemo(() => parseDataKey(conf.x_axis.data_key), [conf.x_axis.data_key]);
  const y = useMemo(() => parseDataKey(conf.y_axis.data_key), [conf.y_axis.data_key]);
  const h = useMemo(() => parseDataKey(conf.heat_block.data_key), [conf.heat_block.data_key]);
  const groupedFullData = useMemo(() => {
    const queryData = panelData[x.queryID];
    if (!queryData) {
      return {};
    }

    const full = queryData.map((d) => {
      const vx = _.get(d, x.columnKey);
      const vy = _.get(d, y.columnKey);
      const vh = _.get(d, h.columnKey);
      return {
        value: [vx, vy, vh],
      } as SeriesDataItem;
    });

    return _.groupBy(full, 'value.1');
  }, [panelData, x, y, h]);

  const totalPages = useMemo(() => {
    const rows = Object.keys(groupedFullData).length;
    return _.floor(rows / conf.pagination.page_size + 1);
  }, [groupedFullData, conf.pagination.page_size]);

  return { totalPages, groupedFullData };
}
