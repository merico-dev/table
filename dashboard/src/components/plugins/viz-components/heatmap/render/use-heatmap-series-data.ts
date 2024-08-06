import { useMemo } from 'react';
import { IHeatmapConf } from '../type';

export type SeriesDataItem = Record<string, any> & {
  value: [number, number, number];
};

export function useHeatmapSeriesData(
  groupedFullData: Record<string, SeriesDataItem[]>,
  conf: IHeatmapConf,
  page: number,
) {
  const seriesData = useMemo(() => {
    const start = (page - 1) * conf.pagination.page_size;
    const end = page * conf.pagination.page_size;
    const sliced = Object.values(groupedFullData).slice(start, end);
    return sliced.flat();
  }, [groupedFullData, page, conf.pagination.page_size]);

  return seriesData;
}
