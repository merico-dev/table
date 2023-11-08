import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts';
import { AnyObject } from '~/types';
import { IBoxplotChartConf, IBoxplotDataItem } from '../type';

export type BoxplotDataset = { source: IBoxplotDataItem[] };

function countData(data: number[]) {
  const group: AnyObject = {}; // value to count
  data.forEach((n) => {
    // const level = _.round(n, -1);
    const level = n;
    const count = group[level] ?? 0;
    group[level] = count + 1;
  });

  return group;
}

type Payload = {
  api: CustomSeriesRenderItemAPI;
  arr: [string, any][];
  source: IBoxplotDataItem;
  categoryIndex: number;
  outlierGroup: Record<string, number>;
};

function prepare({ boxplotDataset, api }: Props): Payload {
  const categoryIndex = api.value(0) as number;
  const source = boxplotDataset.source[categoryIndex];
  const { violinData, outliers } = source;

  const group = countData(violinData);
  const arr = Object.entries(group).sort((a, b) => Number(b[0]) - Number(a[0]));

  const outlierGroup = countData(outliers.map((o) => o[1]));
  return {
    api,
    arr,
    source,
    outlierGroup,
    categoryIndex,
  };
}

type Props = {
  boxplotDataset: { source: IBoxplotDataItem[] };
  params: CustomSeriesRenderItemParams;
  api: CustomSeriesRenderItemAPI;
};

type BoxplotSeries = {
  name: string;
  type: 'custom';
  boxWidth: [number, number];
  itemStyle: {
    color: string;
    borderColor: string;
    borderWidth: number;
  };

  [key: string]: any;
};

type RenderProps = {
  layout: AnyObject[];
  seriesConf: BoxplotSeries;
  payload: Payload;
};
function getBox({ layout, seriesConf, payload }: RenderProps) {
  const { categoryIndex, source, api } = payload;
  const { itemStyle } = seriesConf;
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
    stroke: itemStyle.borderColor,
    lineWidth: itemStyle.borderWidth,
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
      fill: itemStyle.color,
      stroke: itemStyle.borderColor,
      lineWidth: itemStyle.borderWidth,
    },
  });

  return box;
}

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

function getOutliers({ payload, layout }: RenderProps) {
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

// TODO:
// 1. tooltip on scatter
// 2. update on resize
function renderBoxScatterAndOutliers(props: Props, seriesConf: BoxplotSeries) {
  const payload = prepare(props);
  const { boxWidth } = seriesConf;

  // Leftside for scatter
  // Rightside for box
  const layout = payload.api.barLayout({
    barMinWidth: boxWidth[0],
    barMaxWidth: boxWidth[1],
    count: 2,
  });

  // Outliers

  const renderProps = { payload, layout, seriesConf };
  const box = getBox(renderProps);
  const scatter = getScatter(renderProps);
  const outliers = getOutliers(renderProps);
  return {
    type: 'group',
    children: [box, scatter, outliers],
  };
}

export function getCustomBoxplot(boxplotDataset: BoxplotDataset, conf: IBoxplotChartConf) {
  const { color } = conf;
  const series: BoxplotSeries = {
    name: 'Custom Box',
    type: 'custom',
    itemStyle: {
      color,
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
    return renderBoxScatterAndOutliers({ boxplotDataset, params, api }, series);
  };
  return series;
}
