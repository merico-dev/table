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
  // const heat_block = function formatter(payload: $TSFixMe) {
  //   let value = payload;
  //   if (typeof payload === 'object') {
  //     if (Array.isArray(payload.value) && payload.value.length === 2) {
  //       // when there's grouped entries in one seriesItem (use 'Group By' field in editor)
  //       value = payload.value[1];
  //     } else {
  //       value = payload.value;
  //     }
  //   }
  //   if (!conf.heat_block.label_formatter) {
  //     return value;
  //   }
  //   try {
  //     return numbro(value).format(conf.heat_block.label_formatter);
  //   } catch (error) {
  //     console.error(error);
  //     return value;
  //   }
  // };

  const x_axis = getEchartsXAxisLabel(conf.x_axis.axisLabel.formatter);
  const y_axis = getEchartsXAxisLabel(conf.y_axis.axisLabel.formatter);

  return {
    x_axis,
    y_axis,
    // heat_block,
  };
}
