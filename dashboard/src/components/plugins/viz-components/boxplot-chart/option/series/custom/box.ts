import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts';
import { IBoxplotChartConf, IBoxplotDataItem } from '../../../type';
import { BoxplotDataset, BoxplotSeries } from './type';
import { BOX_WIDTH, getLayout } from './utils';

function render(
  boxplotDataset: { source: IBoxplotDataItem[] },
  api: CustomSeriesRenderItemAPI,
  seriesConf: BoxplotSeries,
) {
  const {
    itemStyle: { color, borderColor, borderWidth },
  } = seriesConf;
  const layout = getLayout(api);

  const categoryIndex = api.value(0) as number;
  const source = boxplotDataset.source[categoryIndex];
  const { min, q1, median, q3, max } = source;

  const centers = {
    min: api.coord([categoryIndex, min]),
    q1: api.coord([categoryIndex, q1]),
    median: api.coord([categoryIndex, median]),
    q3: api.coord([categoryIndex, q3]),
    max: api.coord([categoryIndex, max]),
  };

  const offsets = {
    left: layout[1].offset,
    center: (layout[1].offset + layout[1].width) / 2,
    right: layout[1].width,
  };

  const box: any = {
    type: 'group',
    children: [],
  };
  // Lines
  const lines: any[] = [
    // max
    {
      x1: centers.max[0] + offsets.left,
      x2: centers.max[0] + offsets.right,
      y1: centers.max[1],
      y2: centers.max[1],
    },
    // median
    {
      x1: centers.median[0] + offsets.left,
      x2: centers.median[0] + offsets.right,
      y1: centers.median[1],
      y2: centers.median[1],
    },
    // min
    {
      x1: centers.min[0] + offsets.left,
      x2: centers.min[0] + offsets.right,
      y1: centers.min[1],
      y2: centers.min[1],
    },
    // vertical center lines
    {
      x1: centers.min[0] + offsets.center,
      x2: centers.min[0] + offsets.center,
      y1: centers.min[1],
      y2: centers.q1[1],
    },
    {
      x1: centers.max[0] + offsets.center,
      x2: centers.max[0] + offsets.center,
      y1: centers.max[1],
      y2: centers.q3[1],
    },
  ];
  const lineStyle = {
    stroke: borderColor,
    lineWidth: borderWidth,
  };

  lines.forEach((l) => {
    box.children.push({
      type: 'line',
      shape: l,
      style: lineStyle,
    });
  });

  // Box
  box.children.push({
    type: 'rect',
    shape: {
      x: centers.q1[0] + offsets.left,
      y: centers.q1[1],
      width: offsets.right - offsets.left,
      height: centers.q3[1] - centers.q1[1],
    },
    style: {
      fill: color,
      stroke: borderColor,
      lineWidth: borderWidth,
    },
  });
  return box;
}

export function getCustomBox(boxplotDataset: BoxplotDataset, conf: IBoxplotChartConf) {
  const { color } = conf;
  const series: BoxplotSeries = {
    name: 'Box',
    type: 'custom',
    itemStyle: {
      color,
      borderColor: '#2F8CC0',
      borderWidth: 2,
    },
    emphasis: {
      disabled: true,
    },
    boxWidth: BOX_WIDTH,
    datasetIndex: 0,
  };

  series.renderItem = (params: CustomSeriesRenderItemParams, api: CustomSeriesRenderItemAPI) => {
    return render(boxplotDataset, api, series);
  };
  return series;
}
