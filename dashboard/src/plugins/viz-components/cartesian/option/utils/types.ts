export type TEchartsSeriesType = 'line' | 'bar' | 'scatter';

export interface IEchartsSeriesItem {
  name: string;
  color?: string;
  type: TEchartsSeriesType;
  hide_in_legend: boolean;
  yAxisIndex: number;
}
