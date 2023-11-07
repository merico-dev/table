import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts';
import { AnyObject } from '~/types';
import { IBoxplotDataItem } from '../type';

type Point = any[];

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
  const { min, max, violinData } = boxplotDataset.source[categoryIndex];

  const { group, maxCount } = countData(violinData);
  const arr = Object.entries(group).sort((a, b) => Number(b[0]) - Number(a[0]));

  return {
    group,
    maxCount,
    min,
    max,
    categoryIndex,
    arr,
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
