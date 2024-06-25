import { VizComponent } from '~/types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { EditMericoHeatmap } from './editors';
import { RenderMericoHeatmap } from './render';
import { ClickHeatBlock } from './triggers';
import { DEFAULT_CONFIG, TMericoHeatmapConf } from './type';
import { translation } from './translation';
import * as Migrators from './migrators';

class MericoHeatmapMigrator extends VersionBasedMigrator {
  readonly VERSION = 2;

  configVersions(): void {
    this.version(1, (data: any) => {
      return {
        version: 1,
        config: data,
      };
    });
    this.version(2, (data) => {
      return {
        ...data,
        version: 2,
        config: Migrators.v2(data.config),
      };
    });
  }
}

export const MericoHeatmapVizComponent: VizComponent = {
  displayName: 'viz.merico_heatmap.viz_name',
  displayGroup: 'chart.groups.merico_suite',
  migrator: new MericoHeatmapMigrator(),
  name: 'merico-heatmap',
  viewRender: RenderMericoHeatmap,
  configRender: EditMericoHeatmap,
  createConfig: (): {
    version: number;
    config: TMericoHeatmapConf;
  } => ({
    version: 2,
    config: DEFAULT_CONFIG,
  }),
  triggers: [ClickHeatBlock],
  translation,
};
