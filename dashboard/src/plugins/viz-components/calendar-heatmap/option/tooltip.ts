import { CallbackDataParams } from 'echarts/types/dist/shared';
import _ from 'lodash';
import numbro from 'numbro';
import { AnyObject } from '~/types';
import { ICalendarHeatmapConf } from '../type';
import { ValueFormattersType } from './formatters';

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
  conf: ICalendarHeatmapConf;
  valueFormatters: ValueFormattersType;
  dataDict: _.Dictionary<AnyObject>;
  params: CallbackDataParams;
}

function getRows({ conf, valueFormatters, dataDict, params }: IGetRows) {
  const { value } = params;
  const [date, v] = value as [string, number];

  const dateRow = {
    label: date,
    value: '',
    style: {
      label: '',
      value: '',
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
  const ret = [dateRow, valueRow];

  const rowData = dataDict[date];
  if (rowData) {
    conf.tooltip.metrics.forEach((m) => {
      ret.push({
        label: m.name,
        value: formatAdditionalMetric(_.get(rowData, m.data_key, '')),
        style: {
          label: '',
          value: '',
        },
      });
    });
  }

  return ret;
}

export function getTooltip(conf: ICalendarHeatmapConf, data: AnyObject[], valueFormatters: ValueFormattersType) {
  const dataDict = _.keyBy(data, conf.calendar.data_key);
  return {
    confine: true,
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
  };
}
