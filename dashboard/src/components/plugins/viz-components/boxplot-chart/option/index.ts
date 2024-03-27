import { getLabelOverflowOptionOnAxis } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { defaultEchartsOptions } from '~/styles/default-echarts-options';
import { ITemplateVariable, formatNumber } from '~/utils';
import { getEchartsXAxisLabel } from '../../cartesian/editors/x-axis/x-axis-label-formatter/get-echarts-x-axis-tick-label';
import { IBoxplotChartConf } from '../type';
import { getDataset } from './dataset';
import { getGrid } from './grid';
import { getLegend } from './legend';
import { getReferenceLines } from './reference-line';
import { getSeries } from './series';
import { getTooltip } from './tooltip';
import { getEchartsDataZoomOption } from '../../cartesian/editors/echarts-zooming-field/get-echarts-data-zoom-option';
import _ from 'lodash';
import * as math from 'mathjs';
import { TFunction } from 'i18next';
import { SeriesNames } from './type';

function autoYAxisMin({ min, max }: { min: number; max: number }) {
  if (min <= 110) {
    return Math.min(0, min);
  }
  if (min <= 200) {
    return 100;
  }
  const l = math.floor(math.log10(min));
  const unit = Math.pow(10, l);
  const prevUnit = Math.pow(10, l - 1);

  if (min / unit <= 2) {
    const base = _.round(min, -1 * (l - 1));
    return base - prevUnit;
  }
  return _.round(min, -1 * l) - unit;
}

function getSeriesNames(t: TFunction): SeriesNames {
  return {
    Box: t('viz.boxplot.box'),
    Scatter: t('viz.boxplot.scatter'),
    Outlier: t('viz.boxplot.outliers'),
  };
}

interface IGetOption {
  config: IBoxplotChartConf;
  data: TPanelData;
  variables: ITemplateVariable[];
  t: TFunction;
}
export function getOption({ config, data, variables, t }: IGetOption) {
  const { x_axis, y_axis, reference_lines } = config;
  const dataset = getDataset(config, data);

  const overflowOption = getLabelOverflowOptionOnAxis(x_axis.axisLabel.overflow.on_axis);
  const seriesNames = getSeriesNames(t);
  const series = getSeries(config, dataset).map((s) => ({ ...s, name: _.get(seriesNames, s.name, s.name) }));

  return {
    dataZoom: getEchartsDataZoomOption(config.dataZoom, 'filter'),
    grid: getGrid(config),
    dataset,
    legend: getLegend({ config, seriesNames }),
    tooltip: getTooltip({ config, seriesNames }),
    xAxis: [
      defaultEchartsOptions.getXAxis({
        type: 'category',
        name: x_axis.name,
        nameGap: 25,
        nameLocation: 'center',
        nameTextStyle: {
          align: 'center',
        },
        axisLabel: {
          ...x_axis.axisLabel,
          ...overflowOption,
          formatter: getEchartsXAxisLabel(x_axis.axisLabel.formatter),
        },
      }),
    ],
    yAxis: [
      defaultEchartsOptions.getYAxis({
        name: y_axis.name,
        minInterval: 1,
        axisLabel: {
          formatter: function (value: number) {
            return formatNumber(value, y_axis.label_formatter);
          },
        },
        min: autoYAxisMin,
      }),
    ],
    series: [...series, ...getReferenceLines(reference_lines, variables, data)],
  };
}
