import { VizComponent } from '~/types/plugin';
import { DEFAULT_CONFIG } from './type';
import { VizStatsMigrator } from './update';
import { VizStats } from './viz-stats';
import { VizStatsEditor } from './viz-stats-editor';
import { translation } from './translation';
import { ClickStats } from './triggers';

export const StatsVizComponent: VizComponent = {
  createConfig() {
    return {
      version: 3,
      config: DEFAULT_CONFIG,
    };
  },
  displayName: 'viz.stats.viz_name',
  displayGroup: 'chart.groups.others',
  migrator: new VizStatsMigrator(),
  name: 'stats',
  viewRender: VizStats,
  configRender: VizStatsEditor,
  triggers: [ClickStats],
  translation,
};
