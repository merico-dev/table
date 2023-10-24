import numbro from 'numbro';
import { getLabelOverflowOptionOnAxis } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { AnyObject } from '~/types';
import { ITemplateVariable } from '~/utils/template';
import { getEchartsXAxisLabel } from '../../cartesian/editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IBoxplotChartConf } from '../type';
import { getDataset } from './dataset';
import { getLegend } from './legend';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getReferenceLines } from './reference-line';
import { getGrid } from './grid';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';

interface IGetOption {
  config: IBoxplotChartConf;
  data: TPanelData;
  variables: ITemplateVariable[];
}
export function getOption({ config, data, variables }: IGetOption) {
  const { x_axis, y_axis, reference_lines } = config;
  const dataset = getDataset(config, data);

  const overflowOption = getLabelOverflowOptionOnAxis(x_axis.axisLabel.overflow.on_axis);
  const series = getSeries(config);
  return {
    grid: getGrid(config),
    dataset,
    legend: getLegend({ config }),
    tooltip: getTooltip({ config }),
    xAxis: [
      defaultEchartsOptions.getXAxis({
        type: 'category',
        name: x_axis.name,
        nameGap: 25,
        nameLocation: 'center',
        nameTextStyle: {
          align: 'center',
        },
        axisLabel: {
          ...x_axis.axisLabel,
          ...overflowOption,
          formatter: getEchartsXAxisLabel(x_axis.axisLabel.formatter),
        },
      }),
    ],
    yAxis: [
      defaultEchartsOptions.getYAxis({
        name: y_axis.name,
        minInterval: 1,
        axisLabel: {
          formatter: function (value: number) {
            return numbro(value).format(y_axis.label_formatter);
          },
        },
      }),
    ],
    series: [...series, ...getReferenceLines(reference_lines, variables, data)],
  };
}
