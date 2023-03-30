import { ITemplateVariable } from '~/utils/template';
import { getEchartsDataZoomOption } from '../../cartesian/editors/echarts-zooming-field/get-echarts-data-zoom-option';
import { IParetoChartConf } from '../type';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getFormatters } from './utils';
import { getXAxis } from './x-axis';
import { getYAxes } from './y-axes';

export function getOption(conf: IParetoChartConf, data: TVizData, _variables: ITemplateVariable[]) {
  const formatters = getFormatters(conf);

  const option = {
    dataZoom: getEchartsDataZoomOption(conf.dataZoom),
    tooltip: getTooltip(conf, formatters),
    xAxis: getXAxis(conf),
    yAxis: getYAxes(conf, formatters),
    series: getSeries(conf, data, formatters),
    grid: {
      top: 50,
      left: 30,
      right: 15,
      bottom: 5,
      containLabel: true,
    },
  };
  return option;
}
