export interface SeriesUnitType {
  text: string;
  show_in_tooltip: boolean;
  show_in_legend: boolean;
}

export function getDefaultSeriesUnit(): SeriesUnitType {
  return {
    text: '',
    show_in_tooltip: false,
    show_in_legend: false,
  };
}
