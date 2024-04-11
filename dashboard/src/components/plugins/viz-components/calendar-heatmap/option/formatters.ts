import { formatNumber } from '~/utils';
import { ICalendarHeatmapConf } from '../type';
import { FormatterFuncType } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';

export type ValueFormattersType = {
  heat_block: FormatterFuncType;
};

export function getValueFormatters(conf: ICalendarHeatmapConf): ValueFormattersType {
  const heat_block = function formatter(value: string | number) {
    if (!conf.heat_block.value_formatter) {
      return value;
    }
    try {
      return formatNumber(value, conf.heat_block.value_formatter);
    } catch (error) {
      console.error(error);
      return value;
    }
  };

  return {
    heat_block,
  };
}
