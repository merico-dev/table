import { CallbackDataParams } from 'echarts/types/dist/shared';
import _ from 'lodash';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { AnyObject } from '~/types';
import { formatNumber, parseDataKey } from '~/utils';
import { getLabelOverflowStyleInTooltip } from '../../../common-echarts-fields/axis-label-overflow';
import { IHeatmapConf } from '../type';
import { LabelFormattersType, ValueFormattersType } from './formatters';

const formatAdditionalMetric = (v: number) => {
  return formatNumber(v, {
    output: 'number',
    trimMantissa: true,
    mantissa: 2,
    absolute: false,
  });
};

interface IGetRows {
  conf: IHeatmapConf;
  labelFormatters: LabelFormattersType;
  valueFormatters: ValueFormattersType;
  dataDict: _.Dictionary<AnyObject>;
  params: CallbackDataParams;
  metricUnitMap: Record<string, string>;
}

function getRows({ conf, labelFormatters, valueFormatters, dataDict, params, metricUnitMap }: IGetRows) {
  const { value, dataIndex } = params;
  const [x, y, v] = value as [string, string, string];

  const xRow = {
    label: conf.x_axis.name ? conf.x_axis.name : 'X Axis',
    value: labelFormatters.x_axis(x, dataIndex),
    style: {
      label: '',
      value: getLabelOverflowStyleInTooltip(conf.x_axis.axisLabel.overflow.in_tooltip),
    },
    unit: '',
  };

  const yRow = {
    label: conf.y_axis.name ? conf.y_axis.name : 'Y Axis',
    value: labelFormatters.y_axis(y, dataIndex),
    style: {
      label: '',
      value: getLabelOverflowStyleInTooltip(conf.y_axis.axisLabel.overflow.in_tooltip),
    },
    unit: '',
  };

  const valueRow = {
    label: conf.heat_block.name,
    value: valueFormatters.heat_block(v),
    style: {
      label: '',
      value: '',
    },
    unit: conf.heat_block.unit.show_in_tooltip ? conf.heat_block.unit.text : '',
  };
  const ret = [xRow, yRow, valueRow];

  const rowData = dataDict[`${x}---${y}`];
  if (rowData) {
    conf.tooltip.metrics.forEach((m) => {
      const k = parseDataKey(m.data_key);
      const unit = metricUnitMap[m.name];
      ret.push({
        label: m.name,
        value: formatAdditionalMetric(_.get(rowData, k.columnKey, '')),
        style: {
          label: '',
          value: '',
        },
        unit,
      });
    });
  }

  return ret;
}

export function getTooltip(
  conf: IHeatmapConf,
  data: TPanelData,
  labelFormatters: LabelFormattersType,
  valueFormatters: ValueFormattersType,
) {
  const { x_axis, y_axis, heat_block } = conf;
  const x = parseDataKey(x_axis.data_key);
  const y = parseDataKey(y_axis.data_key);
  const h = parseDataKey(heat_block.data_key);

  const dataDict = _.keyBy(data[x.queryID], (d) => `${d[x.columnKey]}---${d[y.columnKey]}`);

  const metricUnitMap = conf.tooltip.metrics.reduce((ret, { unit, name }) => {
    if (unit.show_in_tooltip) {
      ret[name] = unit.text;
    }
    return ret;
  }, {} as Record<string, string>);
  return defaultEchartsOptions.getTooltip({
    formatter: function (params: CallbackDataParams) {
      const rows = getRows({ conf, labelFormatters, valueFormatters, dataDict, params, metricUnitMap });
      const trs = rows.map((r) => {
        return `
          <tr>
            <th style="text-align: right; padding: 0 1em;">
              <div style="${r.style.label}">${r.label}</div>
            </th>
            <td style="text-align: left; padding: 0 2px 0 1em;">
              <div style="${r.style.value}">${r.value}</div>
            </td>
            <th style="text-align: left; padding: 0;">
              ${r.unit ?? ''}
            </th>
          </tr>
        `;
      });

      const template = `
        <table style="width: auto">
          <thead>
            <tr colspan="2">
              <div style="
                width: 100%; height: 4px; border-radius: 2px; margin-bottom: 6px;
                background-color: ${params.color};"
              />
            </tr>
          </thead>
          <tbody>${trs.join('')}</tbody>
        </table>
      `;

      return template;
    },
  });
}
