import { VersionBasedMigrator } from '~/plugins/plugin-data-migrator';
import { VizComponent } from '~/types/plugin';
import { DEFAULT_CONFIG, TMericoStatsConf } from './type';
import { VizMericoStats } from './viz-merico-stats';
import { VizMericoStatsEditor } from './viz-merico-stats-editor';

class VizMericoStatsMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data) => {
      return {
        ...data,
        version: 1,
        config: data.config,
      };
    });
  }
}

export const MericoStatsVizComponent: VizComponent = {
  displayName: 'Merico Stats',
  displayGroup: 'Merico suite',
  migrator: new VizMericoStatsMigrator(),
  name: 'merico-stats',
  viewRender: VizMericoStats,
  configRender: VizMericoStatsEditor,
  createConfig: (): {
    version: number;
    config: TMericoStatsConf;
  } => ({
    version: 1,
    config: DEFAULT_CONFIG,
  }),
};
