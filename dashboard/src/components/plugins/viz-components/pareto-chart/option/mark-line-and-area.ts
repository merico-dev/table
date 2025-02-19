import numbro from 'numbro';
import { IParetoChartConf } from '../type';
import { TLineDataItem } from './types';
import { formatPercentage } from './utils';

interface IPercentage {
  x: string;
  y: string;
}
interface Icount {
  left: number;
  right: number;
}

function getMarkLineLabel(conf: IParetoChartConf, percentage: IPercentage, count: Icount) {
  const { label_template } = conf.markLine;
  if (!label_template) {
    return '';
  }

  const params = {
    ...conf,
    percentage,
    count,
  };

  const names = Object.keys(params);
  const vals = Object.values(params);

  return new Function(...names, `return \`${label_template}\`;`)(...vals);
}

function getAlignByX(indexPoistion: number) {
  const v = Number(numbro(indexPoistion).format({ output: 'number', mantissa: 2 }));
  if (v < 0.33) {
    return 'left';
  }
  if (v > 0.66) {
    return 'right';
  }
  return 'center';
}
export function getMarkLineAndArea(conf: IParetoChartConf, lineData: TLineDataItem[]) {
  if (lineData.length === 0) {
    return {};
  }

  const i = lineData.findIndex((row) => row[1] >= 0.8);
  if (i === -1) {
    return {};
  }

  const match = lineData[i];
  const indexPosition = (i + 1) / lineData.length;
  const percentage = {
    x: formatPercentage(indexPosition),
    y: formatPercentage(match[1]),
  };
  const count = {
    left: i + 1,
    right: lineData.length - i - 1,
  };

  const xAxis = match[0];
  if (!xAxis) {
    return {};
  }

  return {
    markLine: {
      name: '',
      silent: true,
      symbol: 'triangle',
      symbolRotate: 180,
      symbolSize: [10, 8],
      data: [
        {
          name: '',
          symbol: 'none',
          xAxis,
          lineStyle: {
            color: conf.markLine.color,
          },
          label: {
            formatter: getMarkLineLabel(conf, percentage, count),
            position: 'end',
            align: getAlignByX(indexPosition),
          },
        },
      ],
    },
    markArea: {
      name: '',
      silent: true,
      itemStyle: {
        color: 'rgba(47, 140, 192, 0.05)',
      },
      data: [
        [
          {
            coord: ['min', 0],
          },
          {
            xAxis,
          },
        ],
      ],
    },
  };
}
