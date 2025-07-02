import _ from 'lodash';
import { IMigrationEnv } from '~/components/plugins';
import { getDefaultAxisLabelOverflow } from '~/components/plugins/common-echarts-fields/axis-label-overflow';
import { getDefaultXAxisLabelFormatter } from '~/components/plugins/common-echarts-fields/x-axis-label-formatter';
import { defaultNumberFormat } from '~/utils';
import { IRegressionChartConf } from '../type';

export function v2(legacyConf: $TSFixMe): IRegressionChartConf {
  const patch = {
    x_axis: {
      axisLabel: {
        rotate: 0,
        format: defaultNumberFormat,
        overflow: getDefaultAxisLabelOverflow(),
        formatter: getDefaultXAxisLabelFormatter(),
      },
    },
    regression: {
      group_by_key: '',
    },
  };
  return _.defaultsDeep(patch, legacyConf);
}

export function v3(legacyConf: any, { panelModel }: IMigrationEnv): IRegressionChartConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { x_axis, regression, ...rest } = legacyConf;
    return {
      ...rest,
      x_axis: {
        ...x_axis,
        data_key: changeKey(x_axis.data_key),
      },
      regression: {
        ...regression,
        group_by_key: changeKey(regression.group_by_key),
        y_axis_data_key: changeKey(regression.y_axis_data_key),
      },
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

export function v4(legacyConf: any): IRegressionChartConf {
  return {
    x_axis: {
      data_key: legacyConf.x_axis.data_key,
    },
    regression: legacyConf.regression,
  };
}
