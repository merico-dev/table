import _, { defaultsDeep } from 'lodash';
import { ITemplateVariable } from '~/utils/template';
import { getEchartsDataZoomOption } from '../editors/echarts-zooming-field/get-echarts-data-zoom-option';
import { ICartesianChartConf } from '../type';
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

export function getOption(conf: ICartesianChartConf, data: TVizData, variables: ITemplateVariable[]) {
  // preparation
  const variableValueMap = getVariableValueMap(data, variables);
  const labelFormatters = getLabelFormatters(conf);
  const xAxisData = _.uniq(data.map((d) => d[conf.x_axis_data_key]));
  const valueTypedXAxis = xAxisData.every((d) => !Number.isNaN(Number(d)));

  // options
  const series = getSeries(conf, xAxisData, valueTypedXAxis, data, labelFormatters, variables, variableValueMap);
  const { regressionDataSets, regressionSeries, regressionXAxes } = getRegressionConfs(conf, data);

  const customOptions = {
    xAxis: getXAxes(conf, xAxisData, regressionXAxes),
    yAxis: getYAxes(conf, labelFormatters),
    dataset: [...regressionDataSets],
    series: [...series, ...regressionSeries],
    tooltip: getTooltip(conf, series, labelFormatters),
    grid: getGrid(conf),
    legend: getLegend(series),
    dataZoom: getEchartsDataZoomOption(conf.dataZoom),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}
