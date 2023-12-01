import { formatNumber } from '~/utils';
import {
  FormatterFuncType,
  getEchartsXAxisLabel,
} from '../editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IHeatmapConf } from '../type';

export type LabelFormattersType = {
  x_axis: FormatterFuncType;
  y_axis: FormatterFuncType;
};

export function getLabelFormatters(conf: IHeatmapConf): LabelFormattersType {
  const x_axis = getEchartsXAxisLabel(conf.x_axis.axisLabel.formatter);
  const y_axis = getEchartsXAxisLabel(conf.y_axis.axisLabel.formatter);

  return {
    x_axis,
    y_axis,
  };
}

export type ValueFormattersType = {
  heat_block: FormatterFuncType;
};

export function getValueFormatters(conf: IHeatmapConf): ValueFormattersType {
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
