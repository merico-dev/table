import { AnyObject } from '~/types';
import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizCalendarHeatmap } from './viz-calendar-heatmap';
import { VizCalendarHeatmapEditor } from './viz-calendar-heatmap-editor';
import { DEFAULT_CONFIG, ICalendarHeatmapConf } from './type';
import { ClickCalendarDate } from './triggers';

// function v2(prev: AnyObject): ICalendarHeatmapConf {
//   return prev;
// }

class VizCalendarHeatmapMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    //     this.version(2, (data) => {
    //       const { config } = data;
    //       return {
    //         ...data,
    //         version: 2,
    //         config: v2(config),
    //       };
    //     });
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
