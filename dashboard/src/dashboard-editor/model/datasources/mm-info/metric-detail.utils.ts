import _ from 'lodash';
import {
  CombinedMetricCol,
  DerivedMetric,
  DimensionColDataType,
  DimensionInfo,
  MetricDetail,
  MetricSourceCol,
} from './metric-detail.types';

const TrendingCalculationTypeSet = new Set(['yoy_ratio', 'step_ratio', 'span_steps_calculation']);
const DerivedCalculationLabelMap = {
  accumulate: '累计计算',
  yoy_ratio: '年同比率（yoy）',
  step_ratio: '环比率',
  span_steps_calculation: '移动计算',
  percentage_total: '总占',
} as const;

export function parseData(data: MetricDetail) {
  if ('cols' in data) {
    const { cols } = data as DerivedMetric;
    const trendingDateCol = cols.find((c) => c.type === 'trending_date_col')?.metricSourceCol ?? null;
    const requireTrendingReason = TrendingCalculationTypeSet.has(data.calculation)
      ? `当前指标涉及 ${_.get(
          DerivedCalculationLabelMap,
          data.calculation!,
          data.calculation,
        )}，缺少时序则无法展示有效结果。
`
      : '';
    return {
      filters: cols.filter((c) => c.type === 'filter').map((c) => c.metricSourceCol),
      groupBys: cols.filter((c) => c.type === 'group_by').map((c) => c.metricSourceCol),
      trendingDateCol,
      supportTrending: !!trendingDateCol,
      requireTrendingReason,
    };
  }

  const calcs = _.uniq(data.derivedMetrics.map((it) => it.calculation)).filter((calc) =>
    TrendingCalculationTypeSet.has(calc),
  );
  const requireTrendingReason =
    data.supportTrending && calcs.length > 0
      ? `当前指标涉及 ${calcs
          .map((it) => _.get(DerivedCalculationLabelMap, it, it))
          .join('、')}，缺少时序则无法展示有效结果。`
      : '';

  return {
    filters: data.filters,
    groupBys: data.groupBys,
    trendingDateCol: null,
    supportTrending: data.supportTrending,
    requireTrendingReason, // supportTrending, then requireTrending
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

export function makeFilterColOptions(cols: Array<CombinedMetricCol | MetricSourceCol>) {
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
        items: dimension.fields.map((f) => {
          if (typeof f === 'string') {
            return {
              label: f,
              value: f,
            };
          }
          return {
            label: f.field,
            value: `${col.name} -> ${f.field}`,
            ...f,
          };
        }),
      };
    }),
  }));
  return ret;
}

export type MetricGroupByColOption = {
  group: string;
  items: {
    label: string;
    value: string;
    description: string;
    dataType: DimensionColDataType | 'dimension';
    dimension: DimensionInfo | null;
  }[];
};
export function makeGroupByColOptions(cols: Array<CombinedMetricCol | MetricSourceCol>) {
  if (cols.length === 0) {
    return [];
  }
  const grouped = groupCols(cols);

  const ret: MetricGroupByColOption[] = Object.entries(grouped).map(([k, items]) => ({
    group: `${k}(${items.length})`,
    items: items.map((col) => {
      return {
        label: col.name,
        value: col.name,
        description: col.description,
        dataType: col.dataType ?? 'dimension',
        dimension: col.dimension,
      };
    }),
  }));
  return ret;
}
