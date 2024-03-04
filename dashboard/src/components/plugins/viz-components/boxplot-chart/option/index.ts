import { getLabelOverflowOptionOnAxis } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { ITemplateVariable, formatNumber } from '~/utils';
import { getEchartsXAxisLabel } from '../../cartesian/editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IBoxplotChartConf } from '../type';
import { getDataset } from './dataset';
import { getGrid } from './grid';
import { getLegend } from './legend';
import { getReferenceLines } from './reference-line';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getEchartsDataZoomOption } from '../../cartesian/editors/echarts-zooming-field/get-echarts-data-zoom-option';
import _ from 'lodash';
import * as math from 'mathjs';

function autoYAxisMin({ min, max }: { min: number; max: number }) {
  if (min <= 110) {
    return Math.min(0, min);
  }
  if (min <= 200) {
    return 100;
  }
  const l = math.floor(math.log10(min));
  const unit = Math.pow(10, l);
  const prevUnit = Math.pow(10, l - 1);

  if (min / unit <= 2) {
    const base = _.round(min, -1 * (l - 1));
    return base - prevUnit;
  }
  return _.round(min, -1 * l) - unit;
}

interface IGetOption {
  config: IBoxplotChartConf;
  data: TPanelData;
  variables: ITemplateVariable[];
}
export function getOption({ config, data, variables }: IGetOption) {
  const { x_axis, y_axis, reference_lines } = config;
  const dataset = getDataset(config, data);

  const overflowOption = getLabelOverflowOptionOnAxis(x_axis.axisLabel.overflow.on_axis);
  const series = getSeries(config, dataset);
  return {
    dataZoom: getEchartsDataZoomOption(config.dataZoom, 'filter'),
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
            return formatNumber(value, y_axis.label_formatter);
          },
        },
        min: autoYAxisMin,
      }),
    ],
    series: [...series, ...getReferenceLines(reference_lines, variables, data)],
  };
}
