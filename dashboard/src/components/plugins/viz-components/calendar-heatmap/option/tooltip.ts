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
  metricUnitMap: Record<string, string>;
}

function getRows({ conf, valueFormatters, dataDict, params, metricUnitMap }: IGetRows) {
  const { value } = params;
  const [date, v] = value as [string, number];

  const valueRow = {
    label: conf.heat_block.name,
    value: valueFormatters.heat_block(v),
    unit: '',
  };
  const ret = [valueRow];

  const rowData = dataDict[date];
  if (rowData) {
    conf.tooltip.metrics.forEach((m) => {
      const k = parseDataKey(m.data_key);
      const unit = metricUnitMap[m.name] ?? '';
      ret.push({
        label: m.name,
        value: formatAdditionalMetric(_.get(rowData, k.columnKey, '')),
        unit,
      });
    });
  }

  return ret;
}

export function getTooltip(conf: ICalendarHeatmapConf, data: TPanelData, valueFormatters: ValueFormattersType) {
  const c = parseDataKey(conf.calendar.data_key);
  const dataDict = _.keyBy(data[c.queryID], c.columnKey);
  const metricUnitMap = conf.tooltip.metrics.reduce((ret, { unit, name }) => {
    if (unit.show_in_tooltip) {
      ret[name] = unit.text;
    }
    return ret;
  }, {} as Record<string, string>);

  return defaultEchartsOptions.getTooltip({
    formatter: function (params: CallbackDataParams) {
      const rows = getRows({ conf, valueFormatters, dataDict, params, metricUnitMap });
      const trs = rows.map((r) => {
        return `
          <tr>
            <th style="text-align: right; padding: 0 1em;">
              ${r.label}
            </th>
            <td style="text-align: left; padding: 0 2px 0 1em;">
              ${r.value}
            </td>
            <th style="text-align: left; padding: 0;">
              ${r.unit ?? ''}
            </th>
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
