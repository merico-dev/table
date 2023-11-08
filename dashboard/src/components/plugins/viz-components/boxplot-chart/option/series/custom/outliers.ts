import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts';
import { ScatterSeries } from './type';
import { getLayout } from './utils';

function render(api: CustomSeriesRenderItemAPI, seriesConf: ScatterSeries) {
  const layout = getLayout(api);
  const w = layout[0].width;

  const categoryIndex = api.value(0) as number;
  const value = api.value(1);
  const [x, y] = api.coord([categoryIndex, value]);
  const start = x + layout[0].offset;
  const cx = start + Math.random() * w;
  const cy = y;
  return {
    type: 'circle',
    transition: ['shape'],
    x: cx,
    y: cy,
    shape: {
      cx: 0,
      cy: 0,
      r: 3,
    },
    style: {
      fill: api.visual('color'),
    },
  };
}

export function getCustomOutliers() {
  const series: ScatterSeries = {
    name: 'Custom Outliers',
    type: 'custom',
    itemStyle: {
      color: '#ED6A45',
    },
    emphasis: {
      scale: 2,
    },
    datasetIndex: 1,
  };

  series.renderItem = (params: CustomSeriesRenderItemParams, api: CustomSeriesRenderItemAPI) => {
    return render(api, series);
  };
  return series;
}
