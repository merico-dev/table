import { AnyObject } from '~/types';
import { IBoxplotChartConf, IBoxplotDataItem } from '../type';
import { BOXPLOT_DATA_ITEM_KEYS } from './common';
import { CustomSeriesRenderItemAPI, CustomSeriesRenderItemParams } from 'echarts';
import _ from 'lodash';

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

const getRenderItem =
  (boxplotDataset: { source: IBoxplotDataItem[] }) =>
  (params: CustomSeriesRenderItemParams, api: CustomSeriesRenderItemAPI) => {
    const categoryIndex = api.value(0) as number;
    const { min, max, violinData } = boxplotDataset.source[categoryIndex];

    const { group, maxCount } = countData(violinData);
    const arr = Object.entries(group).sort((a, b) => Number(b[0]) - Number(a[0]));

    // Make points
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
      x: 0,
      y: 0,
      children: [
        // {
        //   type: 'polyline',
        //   transition: ['shape'],
        //   shape: {
        //     points: points.l,
        //     // smooth: 0.2,
        //   },
        //   style: api.style({
        //     fill: 'transparent',
        //     stroke: api.visual('color'),
        //     lineWidth: 1,
        //     opacity: 0.5,
        //   }),
        // },
        // {
        //   type: 'polyline',
        //   transition: ['shape'],
        //   shape: {
        //     points: points.r,
        //   },
        //   style: api.style({
        //     fill: 'transparent',
        //     stroke: api.visual('color'),
        //     lineWidth: 1,
        //     opacity: 0.5,
        //   }),
        // },
        {
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
        },
      ],
    };
  };

export function getSeries(conf: IBoxplotChartConf, dataset: any[]) {
  const { color } = conf;
  return [
    {
      name: 'Box',
      type: 'boxplot',
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
      encode: {
        y: BOXPLOT_DATA_ITEM_KEYS,
        x: 'name',
        itemName: ['name'],
        tooltip: BOXPLOT_DATA_ITEM_KEYS,
      },
    },
    {
      name: 'Outlier',
      type: 'scatter',
      symbolSize: 7,
      itemStyle: {
        color: '#ED6A45',
      },
      emphasis: {
        scale: 2,
      },
      datasetIndex: 1,
    },
    {
      name: 'Scatter',
      type: 'custom',
      renderItem: getRenderItem(dataset[0]),
      symbolSize: 3,
      itemStyle: {
        color: '#ED6A45',
      },
      emphasis: {
        scale: 2,
      },
      xAxisIndex: 0,
      datasetIndex: 0,
    },
  ];
}
