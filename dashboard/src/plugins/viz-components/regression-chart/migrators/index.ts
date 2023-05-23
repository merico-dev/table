import _ from 'lodash';
import { IRegressionChartConf } from '../type';
import { defaultNumbroFormat } from '~/panel/settings/common/numbro-format-selector';
import { DEFAULT_AXIS_LABEL_OVERFLOW } from '~/plugins/common-echarts-fields/axis-label-overflow';
import { DEFAULT_X_AXIS_LABEL_FORMATTER } from '~/plugins/common-echarts-fields/x-axis-label-formatter/types';

export function v2(legacyConf: $TSFixMe): IRegressionChartConf {
  const patch = {
    x_axis: {
      axisLabel: {
        rotate: 0,
        format: defaultNumbroFormat,
        overflow: DEFAULT_AXIS_LABEL_OVERFLOW,
        formatter: DEFAULT_X_AXIS_LABEL_FORMATTER,
      },
    },
    regression: {
      group_by_key: '',
    },
  };
  return _.defaultsDeep(patch, legacyConf);
}
