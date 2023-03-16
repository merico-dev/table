import { getLabelOverflowOptionOnAxis } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { AnyObject } from '~/types';
import { ITemplateVariable, templateToString } from '~/utils/template';
import { ICartesianReferenceArea, ICartesianReferenceLine } from '../../cartesian/type';
import { getEchartsSymbolSize } from '../editors/scatter/scatter-size-select/get-echarts-symbol-size';
import { getSeriesColor } from '../editors/scatter/series-color-select/get-series-color';
import { IScatterChartConf } from '../type';

function getReferenceLines(
  reference_lines: ICartesianReferenceLine[],
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
  data: TVizData,
) {
  return reference_lines.map((r) => {
    const isHorizontal = r.orientation === 'horizontal';
    const keyOfAxis = isHorizontal ? 'yAxis' : 'xAxis';
    const position = isHorizontal ? 'insideEndTop' : 'end';
    return {
      name: r.name,
      type: 'line',
      hide_in_legend: !r.show_in_legend,
      yAxisIndex: r.yAxisIndex,
      data: [],
      lineStyle: r.lineStyle,
      markLine: {
        data: [
          {
            name: r.name,
            [keyOfAxis]: Number(variableValueMap[r.variable_key]),
          },
        ],
        silent: true,
        symbol: ['none', 'none'],
        lineStyle: r.lineStyle,
        label: {
          formatter: function () {
            if (!r.template) {
              return '';
            }
            return templateToString(r.template, variables, data);
          },
          position,
        },
      },
    };
  });
}

function getReferenceAreas(
  reference_areas: ICartesianReferenceArea[],
  variableValueMap: Record<string, string | number>,
) {
  return reference_areas.map((r) => ({
    name: '',
    type: 'line',
    data: [],
    markArea: {
      itemStyle: {
        color: r.color,
      },
      data: [
        [
          {
            yAxis: variableValueMap[r.y_keys.upper],
          },
          {
            yAxis: variableValueMap[r.y_keys.lower],
          },
        ],
      ],
      silent: true,
    },
  }));
}

function getSeriesItemOrItems(
  { x_axis, scatter }: IScatterChartConf,
  data: TVizData,
  variableValueMap: Record<string, string | number>,
  labelFormatters: Record<string, $TSFixMe>,
) {
  return {
    label: {
      show: !!scatter.label_position,
      position: scatter.label_position,
      ...getLabelOverflowOptionOnAxis(scatter.label_overflow.label),
      formatter: ({ value }: { value: AnyObject }) => {
        return value[scatter.name_data_key]; // [x, y, name]
      },
    },
    type: 'scatter',
    name: '',
    xAxisId: 'main-x-axis',
    yAxisIndex: 0,
    datasetIndex: 0,
    itemStyle: {
      color: getSeriesColor(scatter.color, variableValueMap),
    },
    symbolSize: getEchartsSymbolSize(scatter.symbolSize, data, x_axis.data_key, variableValueMap),
    encode: { x: x_axis.data_key, y: scatter.y_data_key },
  };
}

export function getSeries(
  conf: IScatterChartConf,
  xAxisData: AnyObject[],
  valueTypedXAxis: boolean,
  data: TVizData,
  labelFormatters: Record<string, $TSFixMe>,
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
) {
  const ret: Array<AnyObject> = [getSeriesItemOrItems(conf, data, variableValueMap, labelFormatters)];
  return ret
    .concat(getReferenceLines(conf.reference_lines, variables, variableValueMap, data))
    .concat(getReferenceAreas(conf.reference_areas, variableValueMap));
}
