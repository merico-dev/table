import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts';
import { AnyObject } from '~/types';
import { IBoxplotChartConf, IBoxplotDataItem } from '../type';

type Point = any[];
export type BoxplotDataset = { source: IBoxplotDataItem[] };

function countData(data: number[]) {
  const group: AnyObject = {}; // value to count
  data.forEach((n) => {
    // const level = _.round(n, -1);
    const level = n;
    const count = group[level] ?? 0;
    group[level] = count + 1;
  });

  const maxCount = Math.max(...Object.values(group));
  return { group, maxCount };
}

function prepare({ boxplotDataset, api }: Props) {
  const categoryIndex = api.value(0) as number;
  const source = boxplotDataset.source[categoryIndex];
  const { min, max, violinData, outliers } = source;

  const { group, maxCount } = countData(violinData);
  const arr = Object.entries(group).sort((a, b) => Number(b[0]) - Number(a[0]));

  const outlierGroup = countData(outliers.map((o) => o[1]));
  return {
    group,
    maxCount,
    min,
    max,
    source,
    categoryIndex,
    arr,
    outlierGroup,
  };
}

type Props = {
  boxplotDataset: { source: IBoxplotDataItem[] };
  params: CustomSeriesRenderItemParams;
  api: CustomSeriesRenderItemAPI;
};

export function getViolin(props: Props) {
  const { api } = props;
  const { categoryIndex, min, max, maxCount, arr } = prepare(props);

  const barLayout = api.barLayout({
    barGap: '0%',
    barCategoryGap: '0%',
    count: maxCount * 2,
  });
  const points: { l: Point[]; r: Point[] } = {
    l: [],
    r: [],
  };
  const highest = api.coord([categoryIndex, max]);
  const lowest = api.coord([categoryIndex, min]);

  // Right part
  points.r.push(highest);
  arr.forEach(([value, count]) => {
    const [x, y] = api.coord([categoryIndex, Number(value)]);
    const index = maxCount - 1 + count; // center to right
    const shift = barLayout[index].offsetCenter;
    points.r.push([x + shift, y, value]);
  });
  points.r.push(lowest);

  // Left part
  points.l.push(highest);
  arr.forEach(([value, count]) => {
    const [x, y] = api.coord([categoryIndex, value]);
    const index = maxCount - 1 - (count - 1); // center to left
    const shift = barLayout[index].offsetCenter;
    points.l.push([x + shift, y, value]);
  });
  points.l.push(lowest);
  return {
    type: 'group',
    children: [
      {
        type: 'polyline',
        transition: ['shape'],
        shape: {
          points: points.l,
          // smooth: 0.2,
        },
        style: api.style({
          fill: 'transparent',
          stroke: api.visual('color'),
          lineWidth: 1,
          opacity: 0.5,
        }),
      },
      {
        type: 'polyline',
        transition: ['shape'],
        shape: {
          points: points.r,
        },
        style: api.style({
          fill: 'transparent',
          stroke: api.visual('color'),
          lineWidth: 1,
          opacity: 0.5,
        }),
      },
    ],
  };
}

export function getLines(props: Props) {
  const { api } = props;
  const { categoryIndex, maxCount, arr } = prepare(props);
  const barLayout = api.barLayout({
    barGap: '0%',
    barCategoryGap: '0%',
    count: maxCount * 2,
  });

  // Horizontal lines
  const lines: AnyObject[] = [];
  arr.forEach(([value, count]) => {
    const [x, y] = api.coord([categoryIndex, value]);
    const li = maxCount - 1 - (count - 1); // center to left
    const ri = maxCount - 1 + count; // center to right
    const shiftL = barLayout[li].offsetCenter;
    const shiftR = barLayout[ri].offsetCenter;
    lines.push({
      x1: x + shiftL,
      y1: y,
      x2: x + shiftR,
      y2: y,
    });
  });
  return {
    type: 'group',
    children: lines.map((l) => ({
      type: 'line',
      transition: ['shape'],
      shape: l,
      style: api.style({
        fill: 'transparent',
        stroke: api.visual('color'),
        lineWidth: 1,
        opacity: 0.5,
        lineDash: 'dotted',
      }),
    })),
  };
}
export function getDots(props: Props) {
  const { api } = props;
  const { categoryIndex, arr } = prepare(props);

  // Dots
  const dots: AnyObject[] = [];
  arr.forEach(([value, count]) => {
    const dotsLayout = api.barLayout({
      barGap: '0%',
      barCategoryGap: '90%',
      count,
    });
    const [x, y] = api.coord([categoryIndex, value]);
    for (let i = 0; i < count; i++) {
      const shift = dotsLayout[i].offsetCenter;
      dots.push({ cx: x + shift, cy: y });
    }
  });
  return {
    type: 'group',
    children: dots.map((d) => ({
      type: 'circle',
      transition: ['shape'],
      shape: {
        ...d,
        r: 1,
      },
      style: api.style({
        // fill: 'transparent',
        fill: api.visual('color'),
        stroke: 'transparent',
        opacity: 0.8,
        lineDash: 'dotted',
      }),
    })),
  };
}

type BoxplotSeries = {
  name: string;
  type: 'custom';
  boxWidth: [number, number];

  [key: string]: any;
};

function getBox(props: Props, seriesConf: BoxplotSeries) {
  const { api } = props;
  const { categoryIndex, arr, maxCount, source, outlierGroup } = prepare(props);

  const { boxWidth, itemStyle } = seriesConf;
  const layout = api.barLayout({
    barMinWidth: boxWidth[0],
    barMaxWidth: boxWidth[1],
    count: 2,
  });

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

  // Dots
  const unit = layout[0].width / maxCount;
  const generalShift = layout[0].offset - layout[1].offset;

  const dots: AnyObject[] = [];
  arr.forEach(([value, count]) => {
    const [x, y] = api.coord([categoryIndex, value]);
    const start = Math.floor((maxCount - count) / 2) * unit;
    for (let i = 0; i < count; i++) {
      const shift = start + i * unit + generalShift;
      dots.push({ cx: x + shift, cy: y });
    }
  });

  const dotStyle = {
    fill: '#ED6A45',
    stroke: 'transparent',
    opacity: 0.3,
    lineDash: 'dotted',
  };

  const scatter = {
    type: 'group',
    children: dots.map((d) => ({
      type: 'circle',
      transition: ['shape'],
      shape: {
        ...d,
        r: 1,
      },
      style: dotStyle,
    })),
  };

  // Outliers
  const outlierDots: AnyObject[] = [];
  Object.entries(outlierGroup.group).forEach(([value, count]) => {
    const [x, y] = api.coord([categoryIndex, value]);
    const start = Math.floor((maxCount - count) / 2) * unit;
    for (let i = 0; i < count; i++) {
      const shift = start + i * unit + generalShift;
      outlierDots.push({ cx: x + shift, cy: y });
    }
  });

  const outlierDotStyle = {
    fill: '#ED6A45',
    stroke: 'transparent',
    lineDash: 'dotted',
  };
  const outliers = {
    type: 'group',
    children: outlierDots.map((d) => ({
      type: 'circle',
      transition: ['shape'],
      shape: {
        ...d,
        r: 3,
      },
      style: outlierDotStyle,
    })),
  };
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
    return getBox({ boxplotDataset, params, api }, series);
  };
  return series;
}
