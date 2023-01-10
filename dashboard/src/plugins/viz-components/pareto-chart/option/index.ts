import { ITemplateVariable } from '~/utils/template';
import { getEchartsDataZoomOption } from '../../cartesian/panel/echarts-zooming-field/get-echarts-data-zoom-option';
import { IParetoChartConf } from '../type';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getXAxis } from './x-axis';
import { getYAxes } from './y-axes';

export function getOption(conf: IParetoChartConf, data: $TSFixMe[], _variables: ITemplateVariable[]) {
  const option = {
    dataZoom: getEchartsDataZoomOption(conf.dataZoom),
    tooltip: getTooltip(conf),
    xAxis: getXAxis(conf),
    yAxis: getYAxes(conf),
    series: getSeries(conf, data),
    grid: {
      top: 50,
      left: 30,
      right: 15,
      bottom: 25,
      containLabel: true,
    },
  };
  return option;
}
