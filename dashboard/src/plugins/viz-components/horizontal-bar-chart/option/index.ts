import _, { defaultsDeep } from 'lodash';
import { ITemplateVariable } from '~/utils/template';
import { IHorizontalBarChartConf } from '../type';
import { getGrid } from './grid';
import { getLegend } from './legend';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getLabelFormatters } from './utils/label-formatter';
import { getVariableValueMap } from './utils/variables';
import { getXAxes } from './x-axis';
import { getYAxes } from './y-axis';

const defaultOption = {
  tooltip: {
    trigger: 'axis',
    confine: true,
  },
  xAxis: [
    {
      type: 'category',
      nameGap: 25,
      nameLocation: 'center',
      nameTextStyle: {
        fontWeight: 'bold',
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
      },
    },
  ],
  grid: {
    top: 10,
    left: 20,
    right: 15,
    bottom: 25,
    containLabel: true,
  },
};

export function getOption(conf: IHorizontalBarChartConf, data: $TSFixMe[], variables: ITemplateVariable[]) {
  // preparation
  const variableValueMap = getVariableValueMap(data, variables);
  const labelFormatters = getLabelFormatters(conf);
  const yAxisData = _.uniq(data.map((d) => d[conf.y_axis.data_key]));
  const valueTypedXAxis = yAxisData.every((d) => !Number.isNaN(Number(d)));

  // options
  const series = getSeries(conf, yAxisData, valueTypedXAxis, data, labelFormatters, variables, variableValueMap);

  const customOptions = {
    xAxis: getXAxes(conf, labelFormatters),
    yAxis: getYAxes(conf, yAxisData),
    series,
    tooltip: getTooltip(conf, series, labelFormatters),
    grid: getGrid(conf),
    legend: getLegend(series),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}
