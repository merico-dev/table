import _ from 'lodash';
import numbro from 'numbro';
import { getLabelOverflowStyleInTooltip } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { IBoxplotChartConf, IBoxplotDataItem, TOutlierDataItem } from '../type';
import { BOXPLOT_DATA_ITEM_KEYS } from './common';

const formatAdditionalMetric = (v: number) => {
  try {
    return numbro(v).format({
      trimMantissa: true,
      mantissa: 2,
    });
  } catch (error) {
    return v;
  }
};

function getScatterTooltipContent(config: IBoxplotChartConf, value: TOutlierDataItem) {
  const xAxisLabelStyle = getLabelOverflowStyleInTooltip(config.x_axis.axisLabel.overflow.in_tooltip);
  const metrics = [
    `<tr>
      <th style="text-align: right; padding: 0 1em;">Outlier</th>
      <td style="text-align: left; padding: 0 1em;">${value[1]}</td>
    </tr>
    `,
  ];

  const additionalMetrics = config.tooltip.metrics.map((m) => {
    return `
    <tr>
      <th style="text-align: right; padding: 0 1em;">${m.name}</th>
      <td style="text-align: left; padding: 0 1em;">${formatAdditionalMetric(value[2][m.data_key])}</td>
    </tr>`;
  });

  metrics.push(...additionalMetrics);

  const template = `
    <div style="text-align: left; margin-bottom: .5em; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd;">
      <div style="${xAxisLabelStyle}">${value[0]}</div>
    </div>
    <table>
      <tbody>
        ${metrics.join('')}
      </tbody>
    </table>
  `;

  return template;
}

function getOutliersInfo(value: IBoxplotDataItem) {
  const { outliers, min, max } = value;
  const less = outliers.filter((v) => v[1] < min).length;
  const greater = outliers.filter((v) => v[1] > max).length;

  const content = (text: string, v: number) => `
    <tr>
      <th style="text-align: right; padding: 0 1em;">${text}</th>
      <td style="text-align: left; padding: 0 1em;">
        ${v}
      </td>
    </tr>
  `;
  return {
    greater: content('Outliers ⬆', greater),
    less: content('Outliers ⬇', less),
  };
}

type TTooltipFormatterParams =
  | {
      componentSubType: 'scatter';
      value: TOutlierDataItem;
    }
  | {
      componentSubType: 'boxplot';
      value: IBoxplotDataItem;
    };

const getFormatter = (config: IBoxplotChartConf) => (params: TTooltipFormatterParams) => {
  const { componentSubType, value } = params;

  if (componentSubType === 'scatter') {
    return getScatterTooltipContent(config, value);
  }

  const lines = BOXPLOT_DATA_ITEM_KEYS.map((key) => {
    return `
    <tr>
      <th style="text-align: right; padding: 0 1em;">${_.capitalize(key)}</th>
      <td style="text-align: left; padding: 0 1em;">
        ${numbro(value[key]).format(config.y_axis.label_formatter)}
      </td>
    </tr>`;
  });

  const outliers = getOutliersInfo(value);
  lines.unshift(outliers.greater);
  lines.push(outliers.less);

  const xAxisLabelStyle = getLabelOverflowStyleInTooltip(config.x_axis.axisLabel.overflow.in_tooltip);
  const template = `
    <div style="text-align: left; margin-bottom: .5em; padding: 0 1em .5em; font-weight: bold; border-bottom: 1px dashed #ddd;">
      <div style="${xAxisLabelStyle}">${value.name}</div>
    </div>
    <table style="width: auto">
      <tbody>
        ${lines.join('')}
      </tbody>
    </table>
  `;
  return template;
};

export function getTooltip({ config }: { config: IBoxplotChartConf }) {
  return {
    trigger: 'item',
    confine: true,
    formatter: getFormatter(config),
  };
}
