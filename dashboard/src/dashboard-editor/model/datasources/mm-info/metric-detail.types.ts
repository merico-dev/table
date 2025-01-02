export type DimensionInfo = {
  id: string;
  name: string;
  fields: {
    id: string;
    description: string;
    field: string; // name
    dataType: DimensionColDataType;
  }[];
};

export type MetricSourceCol_Simple = {
  id: string;
  colType: 'value_col' | 'dimension_col' | 'dimension';
  name: string;
  description: string;
  dataType: DimensionColDataType;
  dimension: null;
};
export type MetricSourceCol_Dimension = {
  id: string;
  colType: 'dimension';
  name: string;
  description: string;
  dataType: null;
  dimension: DimensionInfo;
};

export type MetricSourceCol = MetricSourceCol_Simple | MetricSourceCol_Dimension;
export type DimensionColDataType = 'number' | 'string' | 'date' | 'boolean';
export type DimensionCol = {
  id: string;
  type: 'filter' | 'group_by' | 'default_filter' | 'trending_date_col';
  defaultFilterComparison: any | null;
  dimensionFieldId: string | null;
  metricSourceCol: MetricSourceCol;
};

export type DerivedMetric = {
  id: string;
  name: string;
  description: string;
  calculation: 'accumulate' | 'percentage_total' | 'yoy_ratio' | 'step_ratio' | 'span_steps_calculation';
  cols: DimensionCol[];
};

export type CombinedMetricCol = Omit<MetricSourceCol_Simple, 'id'> | Omit<MetricSourceCol_Dimension, 'id'>;
export type CombinedMetric = {
  id: string;
  name: string;
  description: string;
  filters: CombinedMetricCol[];
  groupBys: CombinedMetricCol[];
  derivedMetrics: DerivedMetric[];
  supportTrending: boolean;
};

export type MetricDetail = DerivedMetric | CombinedMetric;
