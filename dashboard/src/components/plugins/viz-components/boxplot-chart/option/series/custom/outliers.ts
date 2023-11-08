import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts';
import { AnyObject } from '~/types';
import { BoxplotDataset, BoxplotSeries, Props, RenderProps } from './type';
import { prepare } from './utils';

export function getOutliers({ payload, layout }: RenderProps) {
  const { categoryIndex, outlierGroup, api } = payload;
  const w = layout[0].width;

  const dots: AnyObject[] = [];
  Object.entries(outlierGroup).forEach(([value, count]) => {
    const [x, y] = api.coord([categoryIndex, value]);
    const start = x + layout[0].offset;
    for (let i = 0; i < count; i++) {
      const cx = start + Math.random() * w;
      dots.push({ cx, cy: y });
    }
  });

  const dotStyle = {
    fill: '#ED6A45',
  };
  const outliers = {
    type: 'group',
    children: dots.map((d) => ({
      type: 'circle',
      transition: ['shape'],
      shape: {
        ...d,
        r: 3,
      },
      style: dotStyle,
    })),
  };
  return outliers;
}

function render(props: Props, seriesConf: BoxplotSeries) {
  const payload = prepare(props);
  const { boxWidth } = seriesConf;

  // Leftside for scatter
  // Rightside for box
  const layout = payload.api.barLayout({
    barMinWidth: boxWidth[0],
    barMaxWidth: boxWidth[1],
    count: 2,
  });

  const renderProps = { payload, layout, seriesConf };
  const outliers = getOutliers(renderProps);
  return outliers;
}

export function getCustomOutliers(boxplotDataset: BoxplotDataset) {
  const series: BoxplotSeries = {
    name: 'Custom Outliers',
    type: 'custom',
    itemStyle: {
      color: '',
      borderColor: '#2F8CC0',
      borderWidth: 2,
    },
    emphasis: {
      disabled: true,
    },
    boxWidth: [10, 40],
    datasetIndex: 0,
  };

  series.renderItem = (params: CustomSeriesRenderItemParams, api: CustomSeriesRenderItemAPI) => {
    return render({ boxplotDataset, api }, series);
  };
  return series;
}
