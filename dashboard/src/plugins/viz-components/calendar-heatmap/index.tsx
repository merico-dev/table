import { AnyObject } from '~/types';
import { VizComponent } from '../../../types/plugin';
import { IMigrationEnv, VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizCalendarHeatmap } from './viz-calendar-heatmap';
import { VizCalendarHeatmapEditor } from './viz-calendar-heatmap-editor';
import { DEFAULT_CONFIG, ICalendarHeatmapConf } from './type';
import { ClickCalendarDate } from './triggers';

function v2(legacyConf: any, { panelModel }: IMigrationEnv): ICalendarHeatmapConf {
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

class VizCalendarHeatmapMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data, env) => {
      return {
        ...data,
        version: 2,
        config: v2(data.config, env),
      };
    });
  }
}

type ConfigType = {
  version: number;
  config: ICalendarHeatmapConf;
};

export const CalendarHeatmapVizComponent: VizComponent = {
  displayName: 'Heatmap(Calendar)',
  displayGroup: 'ECharts-based charts',
  migrator: new VizCalendarHeatmapMigrator(),
  name: 'calendarHeatmap',
  viewRender: VizCalendarHeatmap,
  configRender: VizCalendarHeatmapEditor,
  createConfig: (): ConfigType => ({ version: 1, config: DEFAULT_CONFIG }),
  triggers: [ClickCalendarDate],
};
