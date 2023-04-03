import type { EChartsInstance } from 'echarts-for-react';
import { AnyObject } from '~/types';

export function updateRegressionLinesColor(instance: EChartsInstance) {
  const model = instance.getModel();

  const newSeries = model.getSeries().map((s: AnyObject) => {
    if (!s.option.custom) {
      return s.option;
    }
    const color = model.getColorFromPalette(s.option.custom.targetSeries, null);
    s.option.color = color;
    return s.option;
  });

  instance.setOption({
    ...instance.getOption(),
    series: newSeries,
  });
}
