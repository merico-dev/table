import _ from 'lodash';
import { CombinedMetricCol, DimensionColDataType, MetricDetail, MetricSourceCol } from './metric-detail.types';

const isDerivedMetric = (data: MetricDetail) => 'cols' in data;

export function parseData(data: MetricDetail) {
  if (isDerivedMetric(data)) {
    return {
      filters: data.cols.filter((c) => c.type === 'filter').map((c) => c.metricSourceCol),
      groupBys: data.cols.filter((c) => c.type === 'group_by').map((c) => c.metricSourceCol),
      trendingDateCol: data.cols.find((c) => c.type === 'trending_date_col')?.metricSourceCol ?? null,
    };
  }

  return {
    filters: data.filters,
    groupBys: data.groupBys,
    trendingDateCol: null,
  };
}

const dimensionColDataTypeNames: Record<DimensionColDataType | 'dimension', string> = {
  string: '维度列',
  number: '数值列',
  date: '数值列',
  boolean: '维度列',
  dimension: '扩展维度',
};

function groupCols(cols: MetricSourceCol[] | CombinedMetricCol[]) {
  const grouped = _.groupBy(cols, (c) => {
    const { dataType } = c;
    if (dataType) {
      return dimensionColDataTypeNames[dataType];
    } else if (c.dimension !== null) {
      return dimensionColDataTypeNames.dimension;
    }
    return 'ERROR';
  });
  return grouped;
}

export function makeColOptions(cols: Array<CombinedMetricCol | MetricSourceCol>) {
  if (cols.length === 0) {
    return [];
  }
  const grouped = groupCols(cols);

  const ret = Object.entries(grouped).map(([k, items]) => ({
    group: `${k}(${items.length})`,
    items: items.map((col) => {
      const { dataType, dimension } = col;
      if (!dimension) {
        return {
          label: col.name,
          value: col.name,
          ...col,
        };
      }
      return {
        group: col.name,
        description: col.description,
        items: dimension.fields.map((f) => ({
          label: f.field,
          value: f.field,
          ...f,
        })),
      };
    }),
  }));
  return ret;
}

export function makeGroupByColOptions(cols: Array<CombinedMetricCol | MetricSourceCol>) {
  if (cols.length === 0) {
    return [];
  }
  const grouped = groupCols(cols);

  const ret = Object.entries(grouped).map(([k, items]) => ({
    group: `${k}(${items.length})`,
    items: items.map((col) => {
      return {
        label: col.name,
        value: col.name,
        ...col,
      };
    }),
  }));
  return ret;
}