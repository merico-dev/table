import { defaultsDeep } from 'lodash';
import { ITemplateVariable } from '~/utils';
import { getEchartsDataZoomOption } from '../editors/echarts-zooming-field/get-echarts-data-zoom-option';
import { ICartesianChartConf } from '../type';
import { IAxisLabels } from './get-axis-labels';
import { getGrid } from './grid';
import { getLegend } from './legend';
import { getRegressionConfs } from './regression';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getLabelFormatters } from './utils/label-formatter';
import { getVariableValueMap } from './utils/variables';
import { getXAxes } from './x-axis';
import { getYAxes } from './y-axis';

const defaultOption = {
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
};

export function getOption(
  conf: ICartesianChartConf,
  data: TPanelData,
  variables: ITemplateVariable[],
  xAxisLabels: IAxisLabels,
) {
  // preparation
  const variableValueMap = getVariableValueMap(data, variables);
  const labelFormatters = getLabelFormatters(conf);

  // options
  const series = getSeries(conf, xAxisLabels, data, labelFormatters, variables, variableValueMap);
  const regressionSeries = getRegressionConfs(conf, data, xAxisLabels);

  const customOptions = {
    xAxis: getXAxes(conf, xAxisLabels),
    yAxis: getYAxes(conf, labelFormatters, series),
    series: [...series, ...regressionSeries],
    tooltip: getTooltip(conf, data, series, xAxisLabels, labelFormatters),
    grid: getGrid(conf),
    legend: getLegend(conf, series),
    dataZoom: getEchartsDataZoomOption(conf.dataZoom),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}
