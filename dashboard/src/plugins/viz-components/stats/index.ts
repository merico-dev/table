import { VizComponent } from '~/types/plugin';
import { DEFAULT_CONFIG } from './type';
import { VizStatsMigrator } from './update';
import { VizStats } from './viz-stats';
import { VizStatsPanel } from './viz-stats-panel';

export const StatsVizComponent: VizComponent = {
  createConfig() {
    return {
      version: 2,
      config: DEFAULT_CONFIG,
    };
  },
  displayName: 'Stats',
  migrator: new VizStatsMigrator(),
  name: 'stats',
  viewRender: VizStats,
  configRender: VizStatsPanel,
};
