import _, { cloneDeep, groupBy } from 'lodash';
import { formatAggregatedValue, getAggregatedValue, ITemplateVariable, templateToString } from '~/utils/template';
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
  data: $TSFixMe[],
) {
  const variableValueMap = variables.reduce((prev, variable) => {
    const value = getAggregatedValue(variable, data);
    prev[variable.name] = formatAggregatedValue(variable, value);
    return prev;
  }, {} as Record<string, string | number>);

  return reference_lines.map((r) => ({
    name: 'refs',
    type: 'scatter',
    data: [],
    markLine: {
      data: [
        {
          name: r.name,
          yAxis: Number(variableValueMap[r.variable_key]),
        },
      ],
      silent: true,
      symbol: ['none', 'none'],
      label: {
        formatter: function () {
          return templateToString(r.template, variables, data);
        },
        position: 'insideEndTop',
      },
    },
  }));
}

function getReferenceAreas(
  reference_areas: ICartesianReferenceArea[],
  variables: ITemplateVariable[],
  data: $TSFixMe[],
) {
  const variableValueMap = variables.reduce((prev, variable) => {
    const value = getAggregatedValue(variable, data);
    prev[variable.name] = formatAggregatedValue(variable, value);
    return prev;
  }, {} as Record<string, string | number>);

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
  { x_axis_data_key }: ICartesianChartConf,
  {
    y_axis_data_key,
    yAxisIndex,
    label_position,
    name,
    group_by_key,
    stack,
    color,
    display_name_on_line,
    ...rest
  }: ICartesianChartSeriesItem,
  dataTemplate: $TSFixMe[][],
  data: $TSFixMe[],
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
  if (!group_by_key) {
    seriesItem.data = data.map((d) => d[y_axis_data_key]);
    return seriesItem;
  }

  const keyedData = groupBy(data, group_by_key);
  return Object.entries(keyedData).map(([groupName, _data]) => {
    const ret = cloneDeep(seriesItem);
    ret.data = getFullSeriesItemData(dataTemplate, _data, x_axis_data_key, y_axis_data_key);
    ret.name = groupName;
    ret.color = undefined;
    return ret;
  });
}

export function getSeries(
  conf: ICartesianChartConf,
  xAxisData: $TSFixMe[],
  data: $TSFixMe[],
  labelFormatters: Record<string, $TSFixMe>,
  variables: ITemplateVariable[],
) {
  const dataTemplate = xAxisData.map((v) => [v, 0]);
  const ret = conf.series.map((c) => getSeriesItemOrItems(conf, c, dataTemplate, data, labelFormatters)).flat();
  return ret
    .concat(getReferenceLines(conf.reference_lines, variables, data))
    .concat(getReferenceAreas(conf.reference_areas, variables, data));
}
