import { IMigrationEnv } from '~/components/plugins/plugin-data-migrator';
import { IHeatmapConf } from '../type';
import _ from 'lodash';
import { getDefaultVisualMap } from '~/components/plugins/common-echarts-fields/visual-map';

export function v2(legacyConf: any, { panelModel }: IMigrationEnv): IHeatmapConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { x_axis, y_axis, heat_block, tooltip, ...rest } = legacyConf;
    return {
      ...rest,
      x_axis: {
        ...x_axis,
        data_key: changeKey(x_axis.data_key),
      },
      y_axis: {
        ...y_axis,
        data_key: changeKey(y_axis.data_key),
      },
      heat_block: {
        ...heat_block,
        data_key: changeKey(heat_block.data_key),
      },
      tooltip: {
        ...tooltip,
        metrics: tooltip.metrics.map((m: any) => ({
          ...m,
          data_key: changeKey(m.data_key),
        })),
      },
    };
  } catch (error) {
    console.error('[Migration failed]', error);
    throw error;
  }
}

export function v3(legacyConf: any): IHeatmapConf {
  return _.defaultsDeep({}, legacyConf, { heat_block: { label: { show: false, fontSize: 10 } } });
}

export function v4(legacyConf: any): IHeatmapConf {
  const { heat_block } = legacyConf;
  let { min, max } = heat_block;
  if (typeof min !== 'number') {
    min = 0;
  }
  if (typeof max !== 'number') {
    max = 100;
  }

  return {
    ...legacyConf,
    heat_block: {
      ...heat_block,
      min: {
        type: 'static',
        value: min,
      },
      max: {
        type: 'static',
        value: max,
      },
    },
  };
}
export function v5(legacyConf: any): IHeatmapConf {
  const {
    visualMap = getDefaultVisualMap(),
    heat_block: { min, max, ...restHeatBlock },
    ...rest
  } = legacyConf;
  return {
    ...rest,
    heat_block: restHeatBlock,
    visualMap: {
      ...getDefaultVisualMap(),
      min,
      max,
    },
  };
}
