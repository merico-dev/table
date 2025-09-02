import _ from 'lodash';
import { ChartTheme } from '~/styles/register-themes';

export type PieChartPaletteOption = {
  name: string;
  colors: string[];
};
export const PieChartPalettes = Object.entries(
  _.pick(ChartTheme.graphics, ['compared', 'level', 'depth', 'multiple']),
).map(([name, record]) => {
  return {
    name,
    colors: Object.values(record),
  } as PieChartPaletteOption;
});
