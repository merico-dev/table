import { CallbackDataParams } from 'echarts/types/dist/shared';
import _ from 'lodash';
import numbro from 'numbro';
import { AnyObject } from '~/types';
import { TMericoHeatmapConf } from '../../type';
import { LabelFormattersType, ValueFormattersType } from './formatters';
import { getLabelOverflowStyleInTooltip } from '../../../../common-echarts-fields/axis-label-overflow';
import { parseDataKey } from '~/utils/data';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';

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

interface IGetRows {
  conf: TMericoHeatmapConf;
  labelFormatters: LabelFormattersType;
  valueFormatters: ValueFormattersType;
  dataDict: _.Dictionary<AnyObject>;
  params: CallbackDataParams;
}

function getRows({ conf, labelFormatters, valueFormatters, dataDict, params }: IGetRows) {
  const { value, dataIndex } = params;
  const [x, y, v] = value as [string, string, string];

  const xRow = {
    label: conf.x_axis.name ? conf.x_axis.name : 'X Axis',
    value: labelFormatters.x_axis(x, dataIndex),
    style: {
      label: '',
      value: getLabelOverflowStyleInTooltip(conf.x_axis.axisLabel.overflow.in_tooltip),
    },
  };

  const yRow = {
    label: conf.y_axis.name ? conf.y_axis.name : 'Y Axis',
    value: labelFormatters.y_axis(y, dataIndex),
    style: {
      label: '',
      value: getLabelOverflowStyleInTooltip(conf.y_axis.axisLabel.overflow.in_tooltip),
    },
  };

  const valueRow = {
    label: conf.heat_block.name,
    value: valueFormatters.heat_block(v),
    style: {
      label: '',
      value: '',
    },
  };
  const ret = [xRow, yRow, valueRow];

  const rowData = dataDict[`${x}---${y}`];
  if (rowData) {
    conf.tooltip.metrics.forEach((m) => {
      const k = parseDataKey(m.data_key);
      ret.push({
        label: m.name,
        value: formatAdditionalMetric(_.get(rowData, k.columnKey, '')),
        style: {
          label: '',
          value: '',
        },
      });
    });
  }

  return ret;
}

export function getTooltip(
  conf: TMericoHeatmapConf,
  data: TPanelData,
  labelFormatters: LabelFormattersType,
  valueFormatters: ValueFormattersType,
) {
  const { x_axis, y_axis, heat_block } = conf;
  const x = parseDataKey(x_axis.data_key);
  const y = parseDataKey(y_axis.data_key);
  const h = parseDataKey(heat_block.data_key);

  const dataDict = _.keyBy(data[x.queryID], (d) => `${d[x.columnKey]}---${d[y.columnKey]}`);
  return defaultEchartsOptions.getTooltip({
    formatter: function (params: CallbackDataParams) {
      const rows = getRows({ conf, labelFormatters, valueFormatters, dataDict, params });
      const trs = rows.map((r) => {
        return `
          <tr>
            <th style="text-align: right;">
              <div style="${r.style.label}">${r.label}</div>
            </th>
            <td style="text-align: right; padding: 0 1em;">
            <div style="${r.style.value}">${r.value}
            </td>
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
