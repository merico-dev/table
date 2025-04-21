import {
  getDefaultAxisLabelOverflow,
  IAxisLabelOverflow,
} from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { defaultNumberFormat, TNumberFormat } from '~/utils';
import { DEFAULT_DATA_ZOOM_CONFIG, TEchartsDataZoomConfig } from '../cartesian/editors/echarts-zooming-field/types';

import { EChartsNameTextAlign } from '../../common-echarts-fields/name-text-align';
import {
  getDefaultXAxisLabelFormatter,
  IXAxisLabelFormatter,
} from '../../common-echarts-fields/x-axis-label-formatter';
import { ICartesianReferenceLine } from '../cartesian/type';
import { getDefaultSeriesUnit, SeriesUnitType } from '../../common-echarts-fields/series-unit';

export const DEFAULT_PARETO_MARK_LINE = {
  label_template: '${percentage.x} of ${x_axis.name} causes ${percentage.y} of ${bar.name}',
  color: '#789AB4',
};

export interface IParetoChartConf {
  x_axis: {
    name: string;
    data_key: string;
    axisLabel: {
      rotate: number;
      formatter: IXAxisLabelFormatter;
      overflow: IAxisLabelOverflow;
    };
  };
  data_key: string;
  bar: {
    name: string;
    nameAlignment: EChartsNameTextAlign;
    color: string;
    label_formatter: TNumberFormat;
    unit: SeriesUnitType;
  };
  line: {
    name: string;
    nameAlignment: EChartsNameTextAlign;
    color: string;
  };
  dataZoom: TEchartsDataZoomConfig;
  markLine: {
    label_template: string;
    color: string;
  };
  reference_lines: ICartesianReferenceLine[];
}

export const DEFAULT_CONFIG: IParetoChartConf = {
  x_axis: {
    name: 'X Axis',
    data_key: '',
    axisLabel: {
      rotate: 0,
      formatter: getDefaultXAxisLabelFormatter(),
      overflow: getDefaultAxisLabelOverflow(),
    },
  },
  data_key: 'value',
  bar: {
    name: 'Value',
    nameAlignment: 'left',
    color: '#228be6',
    label_formatter: defaultNumberFormat,
    unit: getDefaultSeriesUnit(),
  },
  line: {
    name: 'Value',
    nameAlignment: 'right',
    color: 'red',
  },
  dataZoom: DEFAULT_DATA_ZOOM_CONFIG,
  markLine: DEFAULT_PARETO_MARK_LINE,
  reference_lines: [],
};
