import { VersionBasedMigrator } from '~/components/plugins/plugin-data-migrator';
import { VizComponent } from '~/types/plugin';
import { DEFAULT_CONFIG, TMericoStatsConf } from './type';
import { VizMericoStats } from './render';
import { VizMericoStatsEditor } from './viz-merico-stats-editor';
import { v2 } from './migrators';
import { translation } from './translation';

class VizMericoStatsMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data) => {
      return {
        ...data,
        version: 1,
        config: data.config,
      };
    });
    this.version(2, (data) => {
      return {
        ...data,
        version: 2,
        config: v2(data.config),
      };
    });
  }
}

export const MericoStatsVizComponent: VizComponent = {
  displayName: 'viz.merico_stats.viz_name',
  displayGroup: 'chart.groups.merico_suite',
  migrator: new VizMericoStatsMigrator(),
  name: 'merico-stats',
  viewRender: VizMericoStats,
  configRender: VizMericoStatsEditor,
  createConfig: (): {
    version: number;
    config: TMericoStatsConf;
  } => ({
    version: 2,
    config: DEFAULT_CONFIG,
  }),
  translation,
};
