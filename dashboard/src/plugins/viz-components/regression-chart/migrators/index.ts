import _ from 'lodash';
import { IRegressionChartConf } from '../type';

export function v2(legacyConf: $TSFixMe): IRegressionChartConf {
  const patch = {
    x_axis: {
      axisLabel: {
        overflow: {
          x_axis: {
            width: 80,
            overflow: 'truncate',
            ellipsis: '...',
          },
          tooltip: {
            width: 200,
            overflow: 'break',
            ellipsis: '...',
          },
        },
      },
    },
    regression: {
      group_by_key: '',
    },
  };
  return _.defaultsDeep(patch, legacyConf);
}
