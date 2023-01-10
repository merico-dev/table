import _, { defaultsDeep } from 'lodash';
import numbro from 'numbro';
import { IScatterChartConf } from '../type';
import { getGrid } from './grid';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getXAxes } from './x-axis';
import { getYAxes } from './y-axis';
import { formatAggregatedValue, getAggregatedValue, ITemplateVariable } from '~/utils/template';
import { getLegend } from './legend';
import { IYAxisConf } from '../../cartesian/type';
import { getEchartsDataZoomOption } from '../../cartesian/panel/echarts-zooming-field/get-echarts-data-zoom-option';

const defaultOption = {
  tooltip: {
    trigger: 'axis',
  },
  xAxis: [
    {
      type: 'category',
      nameGap: 25,
      nameLocation: 'center',
      nameTextStyle: {
        fontWeight: 'bold',
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: true,
        alignWithLabel: true,
      },
    },
  ],
  grid: {
    top: 10,
    left: 30,
    right: 15,
    bottom: 25,
    containLabel: true,
  },
};

export function getOption(conf: IScatterChartConf, data: $TSFixMe[], variables: ITemplateVariable[]) {
  const variableValueMap = variables.reduce((prev, variable) => {
    const value = getAggregatedValue(variable, data);
    prev[variable.name] = formatAggregatedValue(variable, value);
    return prev;
  }, {} as Record<string, string | number>);

  const labelFormatters = conf.y_axes.reduce(
    (ret: Record<string, (params: $TSFixMe) => string>, { label_formatter }: IYAxisConf, index: number) => {
      ret[index] = function formatter(payload: $TSFixMe) {
        let value = payload;
        if (typeof payload === 'object') {
          if (Array.isArray(payload.value) && payload.value.length === 2) {
            // when there's grouped entries in one seriesItem (use 'Group By' field in editor)
            value = payload.value[1];
          } else {
            value = payload.value;
          }
        }
        if (!label_formatter) {
          return value;
        }
        try {
          return numbro(value).format(label_formatter);
        } catch (error) {
          console.error(error);
          return value;
        }
      };
      return ret;
    },
    {
      default: ({ value }: $TSFixMe) => value,
    },
  );

  const xAxisData = _.uniq(data.map((d) => d[conf.x_axis.data_key]));
  const valueTypedXAxis = xAxisData.every((d) => !Number.isNaN(Number(d)));

  const series = getSeries(conf, xAxisData, valueTypedXAxis, data, labelFormatters, variables, variableValueMap);

  const customOptions = {
    xAxis: getXAxes(conf, xAxisData),
    yAxis: getYAxes(conf, labelFormatters),
    series,
    dataset: [
      {
        source: data,
      },
    ],
    tooltip: getTooltip(conf, labelFormatters),
    grid: getGrid(conf),
    legend: getLegend(),
    dataZoom: getEchartsDataZoomOption(conf.dataZoom),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}
