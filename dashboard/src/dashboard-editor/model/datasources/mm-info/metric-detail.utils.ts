import _ from 'lodash';
import { CombinedMetricCol, DimensionColDataType, MetricDetail, MetricSourceCol } from './metric-detail.types';

const isDerivedMetric = (data: MetricDetail) => 'cols' in data;

export function parseData(data: MetricDetail) {
  if (isDerivedMetric(data)) {
    return {
      filters: data.cols.filter((c) => c.type === 'filter').map((c) => c.metricSourceCol),
      groupBys: data.cols.filter((c) => c.type === 'group_by').map((c) => c.metricSourceCol),
      trendingDateCols: data.cols.filter((c) => c.type === 'trending_date_col').map((c) => c.metricSourceCol),
    };
  }

  return {
    filters: data.filters,
    groupBys: data.groupBys,
    trendingDateCols: [],
  };
}

const dimensionColDataTypeNames: Record<DimensionColDataType | 'dimension', string> = {
  string: '维度列',
  number: '数值列',
  date: '数值列',
  boolean: '维度列',
  dimension: '扩展维度',
};

function makeColsOptionsForDerivedMetric(cols: MetricSourceCol[]) {
  const grouped = _.groupBy(cols, (c) => {
    const { dataType } = c;
    if (dataType) {
      return dimensionColDataTypeNames[dataType];
    } else if ('dimension' in c) {
      return dimensionColDataTypeNames.dimension;
    }
    return 'ERROR';
  });

  const ret = Object.entries(grouped).map(([k, items]) => ({
    group: `${k}(${items.length})`,
    items: items.map((item) => {
      const col = item;
      const dataType = _.get(item, 'dataType', null);
      if (dataType) {
        return {
          label: col.name,
          value: item.id,
          ...col,
        };
      }
      return {
        group: col.name,
        description: col.description,
        items: col.dimension?.fields.map((f) => ({
          label: f.field,
          value: f.id,
          ...f,
        })),
      };
    }),
  }));
  return ret;
}

function makeColsOptionsForCombinedMetric(cols: CombinedMetricCol[]) {
  const grouped = {
    [dimensionColDataTypeNames.dimension]: cols,
  };

  const ret = Object.entries(grouped).map(([k, items]) => ({
    group: `${k}(${items.length})`,
    items: items.map((item) => {
      const col = item;
      return {
        group: col.name,
        description: '',
        items: col.dimension?.fields.map((f) => ({
          label: f.field,
          value: f.id,
          ...f,
        })),
      };
    }),
  }));
  return ret;
}

export function makeColOptions(cols: Array<CombinedMetricCol | MetricSourceCol>) {
  if (cols.length === 0) {
    return [];
  }
  if ('dataType' in cols[0]) {
    return makeColsOptionsForDerivedMetric(cols as MetricSourceCol[]);
  }
  return makeColsOptionsForCombinedMetric(cols as CombinedMetricCol[]);
}
