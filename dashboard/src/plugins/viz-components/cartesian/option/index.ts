import _, { defaultsDeep } from 'lodash';
import numbro from 'numbro';
import { ICartesianChartConf, IYAxisConf } from '../type';
import { getGrid } from './grid';
import { getRegressionConfs } from './regression';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getXAxes } from './x-axis';
import { getYAxes } from './y-axis';
import { formatAggregatedValue, getAggregatedValue, ITemplateVariable } from '~/utils/template';

const defaultOption = {
  legend: {
    show: true,
    bottom: 0,
    left: 'center',
    type: 'scroll',
  },
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0],
    },
    {
      type: 'inside',
      yAxisIndex: [0],
    },
  ],
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

export function getOption(conf: ICartesianChartConf, data: $TSFixMe[], variables: ITemplateVariable[]) {
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

  const xAxisData = _.uniq(data.map((d) => d[conf.x_axis_data_key]));

  const series = getSeries(conf, xAxisData, data, labelFormatters, variables, variableValueMap);

  const { regressionDataSets, regressionSeries, regressionXAxes } = getRegressionConfs(conf, data);

  const customOptions = {
    xAxis: getXAxes(conf, xAxisData, regressionXAxes),
    yAxis: getYAxes(conf, labelFormatters),
    dataset: [...regressionDataSets],
    series: [...series, ...regressionSeries],
    tooltip: getTooltip(conf, labelFormatters),
    grid: getGrid(conf),
  };
  return defaultsDeep({}, customOptions, defaultOption);
}
