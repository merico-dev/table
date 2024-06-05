import { ITemplateVariable } from '~/utils';
import { getEchartsDataZoomOption } from '../../cartesian/editors/echarts-zooming-field/get-echarts-data-zoom-option';
import { IParetoChartConf } from '../type';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getFormatters } from './utils';
import { getXAxis } from './x-axis';
import { getYAxes } from './y-axes';
import { getReferenceLines } from './reference_lines';
import { getVariableValueMap } from '../../cartesian/option/utils/variables';

export function getOption(conf: IParetoChartConf, data: TPanelData, variables: ITemplateVariable[]) {
  const variableValueMap = getVariableValueMap(data, variables);
  const formatters = getFormatters(conf);

  const option = {
    dataZoom: getEchartsDataZoomOption(conf.dataZoom),
    tooltip: getTooltip(conf, formatters),
    xAxis: getXAxis(conf),
    yAxis: getYAxes(conf, formatters),
    series: [
      ...getSeries(conf, data, formatters),
      ...getReferenceLines(conf.reference_lines, variables, variableValueMap, data),
    ],
    grid: {
      top: 50,
      left: 30,
      right: 15,
      bottom: 5,
      containLabel: true,
    },
  };
  console.log(option);
  return option;
}
