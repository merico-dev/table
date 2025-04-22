import { defaultsDeep, maxBy } from 'lodash';
import { formatAggregatedValue, getAggregatedValue, ITemplateVariable } from '~/utils';
import { ISunburstConf } from '../type';
import { buildSunburstData } from './data';
import { getLevels } from './levels';
import { getTooltip } from './tooltip';

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

export function getOption(conf: ISunburstConf, data: TPanelData, variables: ITemplateVariable[]) {
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
      levels: getLevels(conf),
    },
    tooltip: getTooltip(conf),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}
