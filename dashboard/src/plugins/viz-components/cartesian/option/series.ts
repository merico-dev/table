import _, { cloneDeep, groupBy } from 'lodash';
import { aggregateValue, AggregationType } from '~/utils/aggregation';
import { ITemplateVariable, templateToString } from '~/utils/template';
import { getEchartsSymbolSize } from '../panel/scatter-size-select/get-echarts-symbol-size';
import {
  ICartesianChartConf,
  ICartesianChartSeriesItem,
  ICartesianReferenceArea,
  ICartesianReferenceLine,
} from '../type';

function getFullSeriesItemData(
  dataTemplate: $TSFixMe[][],
  seriesItemData: $TSFixMe[],
  x_axis_data_key: string,
  y_axis_data_key: string,
) {
  const effectiveData = seriesItemData.map((d) => [d[x_axis_data_key], d[y_axis_data_key]]);
  return _.unionBy(effectiveData, dataTemplate, 0);
}

function getReferenceLines(
  reference_lines: ICartesianReferenceLine[],
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
  data: $TSFixMe[],
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
    hide_in_legend: true,
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
  { x_axis_data_key }: ICartesianChartConf,
  {
    y_axis_data_key,
    yAxisIndex,
    label_position,
    name,
    group_by_key,
    aggregation_on_group,
    stack,
    color,
    display_name_on_line,
    symbolSize,
    hide_in_legend,
    ...rest
  }: ICartesianChartSeriesItem,
  dataTemplate: $TSFixMe[][],
  valueTypedXAxis: boolean,
  data: $TSFixMe[],
  variableValueMap: Record<string, string | number>,
  labelFormatters: Record<string, $TSFixMe>,
) {
  const seriesItem: $TSFixMe = {
    label: {
      show: !!label_position,
      position: label_position,
      formatter: labelFormatters[yAxisIndex ?? 'default'],
    },
    name,
    xAxisId: 'main-x-axis',
    yAxisIndex,
    stack,
    color,
    symbolSize: getEchartsSymbolSize(symbolSize, data, x_axis_data_key, variableValueMap),
    hide_in_legend,
    ...rest,
  };
  if (display_name_on_line) {
    seriesItem.endLabel = {
      show: true,
      formatter: name,
      offset: [-12, 12],
      align: 'right',
    };
  }
  if (!group_by_key || group_by_key === x_axis_data_key) {
    if (valueTypedXAxis) {
      seriesItem.data = getFullSeriesItemData(dataTemplate, data, x_axis_data_key, y_axis_data_key);
    } else {
      seriesItem.data = data.map((d) => d[y_axis_data_key]);
    }
    return seriesItem;
  }

  const keyedData = groupBy(data, group_by_key);
  return Object.entries(keyedData).map(([groupName, _data]) => {
    const ret = cloneDeep(seriesItem);
    ret.name = groupName;
    ret.color = undefined;

    if (!aggregation_on_group) {
      ret.data = _data.map((d) => [d[x_axis_data_key], d[y_axis_data_key]]);
      return ret;
    }

    const grouped_by_x = groupBy(_data, x_axis_data_key);
    ret.data = Object.entries(grouped_by_x).map(([x, records]) => {
      const y = aggregateValue(records, y_axis_data_key, aggregation_on_group);
      return [x, y];
    });
    return ret;
  });
}

export function getSeries(
  conf: ICartesianChartConf,
  xAxisData: $TSFixMe[],
  valueTypedXAxis: boolean,
  data: $TSFixMe[],
  labelFormatters: Record<string, $TSFixMe>,
  variables: ITemplateVariable[],
  variableValueMap: Record<string, string | number>,
) {
  const dataTemplate = xAxisData.map((v) => [v, 0]);
  const ret = conf.series
    .map((c) => getSeriesItemOrItems(conf, c, dataTemplate, valueTypedXAxis, data, variableValueMap, labelFormatters))
    .flat();
  return ret
    .concat(getReferenceLines(conf.reference_lines, variables, variableValueMap, data))
    .concat(getReferenceAreas(conf.reference_areas, variableValueMap));
}
