import { VizComponent } from '../../../types/plugin';
import { VizStatsMigrator } from './update';
import { VizStats } from './viz-stats';
import { VizStatsPanel } from './viz-stats-panel';

export const StatsVizComponent: VizComponent = {
  displayName: 'Stats',
  migrator: new VizStatsMigrator(),
  name: 'stats',
  viewRender: VizStats,
  configRender: VizStatsPanel,
};
