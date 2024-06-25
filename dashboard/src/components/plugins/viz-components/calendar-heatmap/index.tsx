import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import * as Migrators from './migrators';
import { translation } from './translation';
import { ClickCalendarDate } from './triggers';
import { DEFAULT_CONFIG, ICalendarHeatmapConf } from './type';
import { VizCalendarHeatmap } from './viz-calendar-heatmap';
import { VizCalendarHeatmapEditor } from './viz-calendar-heatmap-editor';

class VizCalendarHeatmapMigrator extends VersionBasedMigrator {
  readonly VERSION = 4;

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
        config: Migrators.v2(data.config, env),
      };
    });
    this.version(3, (data) => {
      return {
        ...data,
        version: 3,
        config: Migrators.v3(data.config),
      };
    });
    this.version(4, (data) => {
      return {
        ...data,
        version: 4,
        config: Migrators.v4(data.config),
      };
    });
  }
}

type ConfigType = {
  version: number;
  config: ICalendarHeatmapConf;
};

export const CalendarHeatmapVizComponent: VizComponent = {
  displayName: 'viz.calendar_heatmap.viz_name',
  displayGroup: 'chart.groups.echarts_based_charts',
  migrator: new VizCalendarHeatmapMigrator(),
  name: 'calendarHeatmap',
  viewRender: VizCalendarHeatmap,
  configRender: VizCalendarHeatmapEditor,
  createConfig: (): ConfigType => ({ version: 4, config: DEFAULT_CONFIG }),
  triggers: [ClickCalendarDate],
  translation,
};
