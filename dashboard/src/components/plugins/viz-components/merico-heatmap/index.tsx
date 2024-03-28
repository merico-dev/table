import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { EditMericoHeatmap } from './editors';
import { RenderMericoHeatmap } from './render';
import { ClickHeatBlock } from './triggers';
import { DEFAULT_CONFIG, TMericoHeatmapConf } from './type';

class MericoHeatmapMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
  }
}

export const MericoHeatmapVizComponent: VizComponent = {
  displayName: 'Merico Heatmap',
  displayGroup: 'chart.groups.merico_suite',
  migrator: new MericoHeatmapMigrator(),
  name: 'merico-heatmap',
  viewRender: RenderMericoHeatmap,
  configRender: EditMericoHeatmap,
  createConfig: (): {
    version: number;
    config: TMericoHeatmapConf;
  } => ({
    version: 1,
    config: DEFAULT_CONFIG,
  }),
  triggers: [ClickHeatBlock],
};
