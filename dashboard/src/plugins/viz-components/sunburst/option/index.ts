import { defaultsDeep, maxBy } from 'lodash';
import { formatAggregatedValue, getAggregatedValue, ITemplateVariable } from '~/utils/template';
import { ISunburstConf } from '../type';
import { buildSunburstData } from './data';

interface ILabelFormatter {
  treePathInfo: {
    name: string;
    dataIndex: number;
    value: number;
  }[];
  name: string;
  value: number;
}

const getLabelFormatter =
  (tolerance: number) =>
  ({ treePathInfo, name, value }: ILabelFormatter) => {
    if (treePathInfo.length === 1) {
      return name;
    }
    try {
      const p = treePathInfo[treePathInfo.length - 2].value;
      if (value / p < tolerance) {
        return ' ';
      }
    } catch (error) {
      return name;
    }
  };

const defaultOption = {
  tooltip: {
    show: true,
  },
  series: {
    type: 'sunburst',
    radius: [0, '90%'],
    emphasis: {
      focus: 'ancestor',
    },
    levels: [
      {},
      {
        r0: '15%',
        r: '35%',
        itemStyle: {
          borderWidth: 2,
        },
        label: {
          rotate: 'tangential',
          formatter: getLabelFormatter(0.1),
        },
      },
      {
        r0: '35%',
        r: '70%',
        label: {
          align: 'right',
          formatter: getLabelFormatter(0.05),
        },
      },
      {
        r0: '70%',
        r: '72%',
        label: {
          position: 'outside',
          padding: 3,
          silent: false,
          formatter: getLabelFormatter(0.01),
        },
        itemStyle: {
          borderWidth: 3,
        },
      },
    ],
  },
};

export function getOption(conf: ISunburstConf, data: $TSFixMe[], variables: ITemplateVariable[]) {
  const variableValueMap = variables.reduce((prev, variable) => {
    const value = getAggregatedValue(variable, data);
    prev[variable.name] = formatAggregatedValue(variable, value);
    return prev;
  }, {} as Record<string, string | number>);

  const chartData = buildSunburstData(conf, data);

  // const max = maxBy(data, (d) => d.value)?.value ?? 1;

  const customOptions = {
    series: {
      data: chartData,
    },
  };
  return defaultsDeep({}, customOptions, defaultOption);
}
