import { defaultsDeep, maxBy } from 'lodash';
import { formatAggregatedValue, getAggregatedValue, ITemplateVariable } from '~/utils/template';
import { ISunburstConf } from '../type';
import { buildSunburstData } from './data';

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
  },
};

export function getOption(conf: ISunburstConf, data: $TSFixMe[], variables: ITemplateVariable[]) {
  const variableValueMap = variables.reduce((prev, variable) => {
    const value = getAggregatedValue(variable, data);
    prev[variable.name] = formatAggregatedValue(variable, value);
    return prev;
  }, {} as Record<string, string | number>);

  const chartData = buildSunburstData(conf, data);

  const max = maxBy(chartData, (d) => d.value)?.value ?? 1;

  const customOptions = {
    series: {
      data: chartData,
      label: {
        formatter: ({ name, value }: $TSFixMe) => {
          if (value / max < 0.2) {
            return ' ';
          }
          return name;
        },
      },
    },
  };
  return defaultsDeep({}, customOptions, defaultOption);
}
