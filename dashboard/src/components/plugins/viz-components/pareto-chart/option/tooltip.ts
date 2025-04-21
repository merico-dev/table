import { CallbackDataParams } from 'echarts/types/dist/shared';
import { getLabelOverflowStyleInTooltip } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { IParetoChartConf } from '../type';
import { TParetoFormatters } from './utils';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';

function getBarUnit(conf: IParetoChartConf) {
  const unit = conf.bar.unit;
  if (!unit.show_in_tooltip) {
    return '';
  }
  return unit.text;
}

const getTooltipFormatter = (conf: IParetoChartConf, formatters: TParetoFormatters) => (params: CallbackDataParams) => {
  const arr = Array.isArray(params) ? params : [params];
  if (arr.length === 0) {
    return '';
  }
  const barUnit = getBarUnit(conf);
  const lines = arr.map((row) => {
    const { seriesName, componentSubType } = row;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_x, value] = row.value as [string, number];
    if (!seriesName) {
      return value;
    }
    const isBarSeries = componentSubType === 'bar';
    if (isBarSeries) {
      return `
      <tr>
        <th style="text-align: right; padding: 0 1em;">${seriesName}</th>
        <td style="text-align: left; padding: 0 2px 0 1em;">${formatters.bar(value as number)}</td>
        <td style="text-align: left; padding: 0;">${componentSubType === 'bar' ? barUnit : ''}</td>
      </tr>
      `;
    }
    return `
    <tr>
      <th style="text-align: right; padding: 0 1em;">${seriesName}</th>
      <td colspan="2" style="text-align: left; padding: 0 2px 0 1em;">${formatters.lineValue(value as number)}</td>
    </tr>
  `;
  });
  const xAxisLabelStyle = getLabelOverflowStyleInTooltip(conf.x_axis.axisLabel.overflow.in_tooltip);
  const xAxisLabel = arr[0].name;
  return `
    <div style="text-align: left; margin-bottom: .5em; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd;">
      <div style="${xAxisLabelStyle}">${xAxisLabel}</div>
    </div>
    <table style="width: auto">
      <tbody>
        ${lines.join('')}
      </tbody>
    </table>
  `;
};

export function getTooltip(conf: IParetoChartConf, formatters: TParetoFormatters) {
  return defaultEchartsOptions.getTooltip({
    trigger: 'axis',
    formatter: getTooltipFormatter(conf, formatters),
  });
}
