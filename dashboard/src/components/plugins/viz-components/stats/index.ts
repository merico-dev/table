import { VizComponent } from '~/types/plugin';
import { DEFAULT_CONFIG } from './type';
import { VizStatsMigrator } from './update';
import { VizStats } from './viz-stats';
import { VizStatsEditor } from './viz-stats-editor';

export const StatsVizComponent: VizComponent = {
  createConfig() {
    return {
      version: 3,
      config: DEFAULT_CONFIG,
    };
  },
  displayName: 'Stats',
  displayGroup: 'Others',
  migrator: new VizStatsMigrator(),
  name: 'stats',
  viewRender: VizStats,
  configRender: VizStatsEditor,
};
