import _ from 'lodash';
import {
  CombinedMetricCol,
  DerivedMetric,
  DimensionColDataType,
  DimensionInfo,
  IDerivedCalculationMetadata,
  MetricDetail,
  MetricSourceCol,
} from './metric-detail.types';

export function parseData(data: MetricDetail) {
  if ('cols' in data) {
    const { cols } = data as DerivedMetric;
    const trendingDateCol = cols.find((c) => c.type === 'trending_date_col')?.metricSourceCol ?? null;
    return {
      filters: cols.filter((c) => c.type === 'filter').map((c) => c.metricSourceCol),
      groupBys: cols.filter((c) => c.type === 'group_by').map((c) => c.metricSourceCol),
      trendingDateCol,
      supportTrending: !!trendingDateCol,
    };
  }

  return {
    filters: data.filters,
    groupBys: data.groupBys,
    trendingDateCol: null,
    supportTrending: data.supportTrending,
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
              value: `${col.name} -> ${f}`,
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

export const calculationOptionsMap = new Map<string, IDerivedCalculationMetadata>([
  [
    'accumulate',
    {
      name: '累计计算',
      description: '按指定的聚合方式，依次计算指标值的累计值。',
      requireWindowConfig: false,
      requireTrendingDateCol: false,
    },
  ],
  [
    'yoyRatio',
    {
      name: '年同比率（yoy）',
      description: '对比当前年份与上一个年份同期指标值的变化率。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'stepRatio',
    {
      name: '环比率',
      description: '对比当前步长与上一个步长指标值的变化率。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'stepSpansRatio',
    {
      name: '移动计算',
      description: '按设定的窗口沿时序对指标值进行滚动计算。',
      requireWindowConfig: true,
      requireTrendingDateCol: true,
    },
  ],
  [
    'percentage',
    {
      name: '总占比',
      description: '总占比 = 当前值 / 总值。',
      requireWindowConfig: false,
      requireTrendingDateCol: false,
    },
  ],
  [
    'percentage_accumulate',
    {
      name: '累计占比',
      description: '按聚合规则计算各项占比，再依次计算占比率的累计值，如帕累托的累计占比值。',
      requireWindowConfig: false,
      requireTrendingDateCol: false,
    },
  ],
  [
    'accumulate_yoyRatio',
    {
      name: '累计年同比',
      description: '按聚合规则累加数据，再与上一年同期累计值对比得出变化率。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'yoyRatio_accumulate',
    {
      name: '年同比累计',
      description: '先计算各步长指标相对上一年同期的同比率，再依次计算同比率的累计值。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'stepRatio_accumulate',
    {
      name: '环比累计',
      description: '先计算各步长指标相对上一步长的环比率，再依次计算环比率的累计值。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'percentage_yoyRatio',
    {
      name: '占比年同比',
      description: '按聚合规则计算各项占比，再与去年同期占比对比得出变化率。',
      requireWindowConfig: false,
      requireTrendingDateCol: true,
    },
  ],
  [
    'yoyRatio_stepSpansRatio',
    {
      name: '年同比移动计算',
      description: '先计算各步长指标相对上一年同期的同比率，再按移动设置沿时序滚动计算。',
      requireWindowConfig: true,
      requireTrendingDateCol: true,
    },
  ],
  [
    'stepRatio_stepSpansRatio',
    {
      name: '环比移动计算',
      description: '先计算各步长指标相对上一步长的环比率，再按移动设置沿时序滚动计算。',
      requireWindowConfig: true,
      requireTrendingDateCol: true,
    },
  ],
]);

/**
 * Remove trending-based calculations from the list when timeQuery is disabled
 * @param currentCalculations The current list of calculations
 * @param timeQueryEnabled Whether timeQuery is enabled
 * @returns Filtered list of calculations without trending-based ones if timeQuery is disabled
 */
export function removeTrendingBasedCalculations(currentCalculations: string[], timeQueryEnabled: boolean): string[] {
  // If timeQuery is enabled, return all calculations
  if (timeQueryEnabled) {
    return currentCalculations;
  }

  // Get trending-based calculations from calculationOptionsMap
  const trendingBasedCalculations = Array.from(calculationOptionsMap.entries())
    .filter(([_, data]) => data.requireTrendingDateCol)
    .map(([key]) => key);

  return currentCalculations.filter((calc) => !trendingBasedCalculations.includes(calc));
}
