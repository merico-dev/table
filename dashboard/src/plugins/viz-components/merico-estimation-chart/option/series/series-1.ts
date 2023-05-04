import _ from 'lodash';
import numbro from 'numbro';
import { IMericoEstimationChartConf } from '../../type';

const formatAsPercentage = ({ value }: { value: [string, string, number] }) => {
  try {
    return numbro(value[2]).format({ output: 'percent', mantissa: 0 });
  } catch (error) {
    console.error(error);
    return value;
  }
};

export function getSeries1(
  conf: IMericoEstimationChartConf,
  xAxisData: string[],
  dataGroupedByX: Record<string, TVizData>,
) {
  const { actual, estimated } = conf.y_axis.data_keys;
  const chartData = xAxisData.map((x) => {
    const total = dataGroupedByX[x].length;
    const count = _.countBy(dataGroupedByX[x], (d) => d[actual] === d[estimated]);
    const y = count.true / total;
    return [x, '_y', y];
  });
  return {
    type: 'heatmap',
    name: '准确估算比例',
    xAxisIndex: 0,
    yAxisIndex: 0,
    data: chartData,
    label: {
      show: true,
      formatter: formatAsPercentage,
    },
    labelLayout: {
      hideOverlap: true,
    },
    visualMapIndex: 0,
  };
}
