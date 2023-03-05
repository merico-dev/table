import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizHeatmap } from './viz-heatmap';
import { VizHeatmapEditor } from './viz-heatmap-editor';
import { DEFAULT_CONFIG, IHeatmapConf } from './type';
import { ClickHeatBlock } from './triggers';

class VizHeatmapMigrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (data: any) => {
      console.log('🟥 unexpected calling');
      return {
        version: 1,
        config: data,
      };
    });
  }
}

export const HeatmapVizComponent: VizComponent = {
  displayName: 'Heatmap',
  displayGroup: 'ECharts-based charts',
  migrator: new VizHeatmapMigrator(),
  name: 'heatmap',
  viewRender: VizHeatmap,
  configRender: VizHeatmapEditor,
  createConfig: (): {
    version: number;
    config: IHeatmapConf;
  } => ({
    version: 1,
    config: DEFAULT_CONFIG,
  }),
  triggers: [ClickHeatBlock],
};
