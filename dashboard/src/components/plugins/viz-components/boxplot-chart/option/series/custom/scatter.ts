import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts';
import { AnyObject } from '~/types';
import { BoxplotDataset, BoxplotSeries, Props, RenderProps } from './type';
import { prepare } from './utils';

function getScatter({ layout, payload }: RenderProps) {
  const { categoryIndex, arr, api } = payload;
  const w = layout[0].width;

  const dots: AnyObject[] = [];
  arr.forEach(([value, count]) => {
    const [x, y] = api.coord([categoryIndex, value]);
    const start = x + layout[0].offset;
    for (let i = 0; i < count; i++) {
      const cx = start + Math.random() * w;
      dots.push({ cx, cy: y });
    }
  });

  const dotStyle = {
    fill: '#ED6A45',
    opacity: 0.5,
  };

  const scatter = {
    type: 'group',
    children: dots.map((d) => ({
      type: 'circle',
      transition: ['shape'],
      shape: {
        ...d,
        r: 2,
      },
      style: dotStyle,
    })),
  };

  return scatter;
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
  const scatter = getScatter(renderProps);
  return scatter;
}

export function getCustomScatter(boxplotDataset: BoxplotDataset) {
  const series: BoxplotSeries = {
    name: 'Custom Scatter',
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
