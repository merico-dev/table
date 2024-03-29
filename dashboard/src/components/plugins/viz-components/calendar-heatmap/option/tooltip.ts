import { CallbackDataParams } from 'echarts/types/dist/shared';
import _ from 'lodash';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { AnyObject } from '~/types';
import { formatNumber, parseDataKey } from '~/utils';
import { ICalendarHeatmapConf } from '../type';
import { ValueFormattersType } from './formatters';

const formatAdditionalMetric = (v: number) => {
  return formatNumber(v, {
    output: 'number',
    trimMantissa: true,
    mantissa: 2,
    absolute: false,
  });
};

interface IGetRows {
  conf: ICalendarHeatmapConf;
  valueFormatters: ValueFormattersType;
  dataDict: _.Dictionary<AnyObject>;
  params: CallbackDataParams;
}

function getRows({ conf, valueFormatters, dataDict, params }: IGetRows) {
  const { value } = params;
  const [date, v] = value as [string, number];

  const valueRow = {
    label: conf.heat_block.name,
    value: valueFormatters.heat_block(v),
    style: {
      label: '',
      value: '',
    },
  };
  const ret = [valueRow];

  const rowData = dataDict[date];
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

export function getTooltip(conf: ICalendarHeatmapConf, data: TPanelData, valueFormatters: ValueFormattersType) {
  const c = parseDataKey(conf.calendar.data_key);
  const dataDict = _.keyBy(data[c.queryID], c.columnKey);
  return defaultEchartsOptions.getTooltip({
    formatter: function (params: CallbackDataParams) {
      const rows = getRows({ conf, valueFormatters, dataDict, params });
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

      const date = _.get(params.value, 0);
      const template = `
        <table style="width: auto">
          <thead>
            <tr colspan="2">
              <div style="
                width: 100%; height: 4px; border-radius: 2px; margin-bottom: 6px;
                background-color: ${params.color};"
              />
            </tr>
            <tr>
              <th colspan="2" style="text-align: center;">
                <div>${date}</div>
              </th>
            </tr>
          </thead>
          <tbody>${trs.join('')}</tbody>
        </table>
      `;

      return template;
    },
  });
}
