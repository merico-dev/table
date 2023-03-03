import { VizComponent } from '../../../types/plugin';
import { VersionBasedMigrator } from '../../plugin-data-migrator';
import { VizHeatmap } from './viz-heatmap';
import { VizHeatmapPanel } from './viz-heatmap-panel';
import { DEFAULT_CONFIG, IHeatmapConf } from './type';

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
  configRender: VizHeatmapPanel,
  createConfig: (): {
    version: number;
    config: IHeatmapConf;
  } => ({
    version: 1,
    config: DEFAULT_CONFIG,
  }),
};
