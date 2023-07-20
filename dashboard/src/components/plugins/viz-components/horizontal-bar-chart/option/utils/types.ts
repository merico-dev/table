export type TEchartsSeriesType = 'bar' | 'scatter';

export interface IEchartsSeriesItem {
  name: string;
  color?: string;
  type: TEchartsSeriesType;
  hide_in_legend: boolean;
  xAxisIndex: number;
  yAxisIndex: number;
}
