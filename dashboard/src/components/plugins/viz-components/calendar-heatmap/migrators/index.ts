import { getDefaultVisualMap } from '~/components/plugins/common-echarts-fields/visual-map';
import { ICalendarHeatmapConf } from '../type';
import { IMigrationEnv } from '~/components/plugins/plugin-data-migrator';

export function v2(legacyConf: any, { panelModel }: IMigrationEnv): ICalendarHeatmapConf {
  try {
    const queryID = panelModel.queryIDs[0];
    if (!queryID) {
      throw new Error('cannot migrate when queryID is empty');
    }
    const changeKey = (key: string) => (key ? `${queryID}.${key}` : key);
    const { calendar, heat_block, tooltip, ...rest } = legacyConf;
    return {
      ...rest,
      calendar: {
        ...calendar,
        data_key: changeKey(calendar.data_key),
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

export function v3(legacyConf: any): ICalendarHeatmapConf {
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

export function v4(legacyConf: any): ICalendarHeatmapConf {
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
