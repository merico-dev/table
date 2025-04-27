import { set } from 'lodash';
import { IPieChartConf } from '../type';
import { TDataItem } from './types';

export type OthersSectorItem = Required<TDataItem>;

export function getSeries(conf: IPieChartConf, data: TPanelData, width: number) {
  return {
    type: 'pie',
    name: 'pie',
    radius: conf.radius,
    itemStyle: {
      color: ({ data }: { data: TDataItem }) => data.color,
    },
    label: {
      position: 'outer',
      alignTo: 'edge',
      formatter: '{name|{b}}\n{p|{@percentage}}',
      minMargin: 5,
      edgeDistance: 10,
      lineHeight: 15,
      rich: {
        p: {
          color: '#999',
        },
      },
      margin: 20,
    },
    labelLine: {
      length: 15,
      length2: 0,
      maxSurfaceAngle: 80,
      showAbove: true,
    },
    labelLayout: function (params: $TSFixMe) {
      const isLeft = params.labelRect.x < width / 2;
      const points = params.labelLinePoints;
      set(points, [2, 0], isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width);
      return {
        labelLinePoints: points,
      };
    },
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };
}
